import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/mail";

/**
 * Paystack Webhook Endpoint (/api/webhooks/paystack)
 * Receives asynchronous events directly from Paystack (e.g., charge.success).
 * Guarantees cryptographic HMAC SHA512 signature validation and automatic order reconciliation.
 */
export async function POST(req: NextRequest) {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.warn("[Paystack Webhook] PAYSTACK_SECRET_KEY is not defined in environment.");
      return NextResponse.json({ error: "Server webhook configuration missing" }, { status: 500 });
    }

    // 1. Read raw body for cryptographic signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("[Paystack Webhook] Missing x-paystack-signature header.");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // 2. Validate HMAC SHA512 hash
    const computedHash = crypto
      .createHmac("sha512", paystackSecret)
      .update(rawBody)
      .digest("hex");

    if (computedHash !== signature) {
      console.warn("[Paystack Webhook] Signature verification failed. Untrusted webhook request rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse JSON event payload
    const eventPayload = JSON.parse(rawBody);
    const { event, data } = eventPayload;

    console.log(`[Paystack Webhook] Received verified event: "${event}" (Ref: ${data?.reference})`);

    // 4. Handle successful charge event
    if (event === "charge.success") {
      const reference = data.reference;
      const amountPaid = data.amount / 100; // Convert from kobo/cents to primary unit
      const customerEmail = data.customer?.email || "";
      const customerName = data.metadata?.custom_fields?.find((f: any) => f.variable_name === "customer_name")?.value 
        || `${data.customer?.first_name || ""} ${data.customer?.last_name || ""}`.trim() 
        || "Valued Client";

      if (!reference) {
        return NextResponse.json({ status: "ignored", message: "No reference provided" }, { status: 200 });
      }

      // Check if order already exists in database
      const existingOrder = await prisma.order.findFirst({
        where: { paymentRef: reference },
        include: { items: true },
      });

      if (existingOrder) {
        if (existingOrder.status !== "PAID") {
          const updatedOrder = await prisma.order.update({
            where: { id: existingOrder.id },
            data: { status: "PAID" },
            include: { items: true },
          });

          console.log(`[Paystack Webhook] Order #${updatedOrder.id} successfully marked as PAID.`);

          // Dispatch confirmation email
          await sendOrderConfirmationEmail({
            orderId: updatedOrder.id,
            paymentRef: reference,
            customerName: updatedOrder.shippingName || customerName,
            customerEmail: updatedOrder.shippingEmail || customerEmail,
            shippingAddress: updatedOrder.shippingAddress,
            shippingCity: updatedOrder.shippingCity,
            shippingState: updatedOrder.shippingState,
            shippingZip: updatedOrder.shippingZip,
            totalAmount: updatedOrder.totalAmount,
            currency: data.currency || "USD",
            items: updatedOrder.items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })),
            createdAt: updatedOrder.createdAt,
          });
        } else {
          console.log(`[Paystack Webhook] Order #${existingOrder.id} is already marked as PAID.`);
        }
      } else {
        // Fallback: If customer closed browser before client-side processOrder ran
        console.log(`[Paystack Webhook] No matching order found yet for ref: "${reference}". Payment recorded.`);
      }
    }

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Paystack Webhook Error]:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
