import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true, name: true },
    });

    if (user && user.email) {
      // 1. Generate secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // 2. Clean up any existing token for this email and save the new one
      await prisma.verificationToken.deleteMany({
        where: { identifier: cleanEmail },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: cleanEmail,
          token,
          expires,
        },
      });

      // 3. Construct reset URL
      const origin = request.nextUrl.origin || process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

      // 4. Dispatch email
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email address, a password reset link has been dispatched to your inbox.",
    });
  } catch (error: any) {
    console.error("[ForgotPassword Error]:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
