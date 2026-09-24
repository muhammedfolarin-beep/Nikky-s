import nodemailer from "nodemailer";

interface LoginConfirmationPayload {
  to: string;
  name?: string | null;
  userAgent?: string;
  ip?: string;
  timestamp?: Date;
}

interface WelcomeConfirmationPayload {
  to: string;
  name?: string | null;
}

/**
 * Creates and returns a Nodemailer transporter.
 * Supports standard SMTP, Gmail app passwords, or fallback development logging.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    if (process.env.GMAIL_USER || (host && host.includes("gmail"))) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    }

    return nodemailer.createTransport({
      host: host || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback dev transporter (logs to console)
  return null;
}

const FROM_NAME = process.env.EMAIL_FROM_NAME || "SN24 Security & Concierge";
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER || "security@sn24.com.ng";
const STORE_URL = process.env.NEXTAUTH_URL || "https://sn24.com.ng";

/**
 * Sends a luxury sign-in confirmation and security alert email to the user's Gmail/email.
 */
export async function sendLoginConfirmationEmail(payload: LoginConfirmationPayload) {
  const { to, name, userAgent, ip, timestamp = new Date() } = payload;
  const displayName = name || "Valued SN24 Client";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "UTC",
  }).format(timestamp);

  const subject = "Security Alert: New Sign-in to your SN24 Account";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F8; color: #111111; }
    .container { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8E8E6; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 32px 24px; text-align: center; }
    .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; margin: 0; }
    .sub-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C6A87D; margin-top: 6px; font-weight: 600; }
    .content { padding: 40px 32px; }
    .greeting { font-size: 20px; font-weight: 600; color: #111111; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 24px; }
    .detail-card { background-color: #F9F9F8; border-radius: 12px; border: 1px solid #EAEAE8; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EEEEEC; font-size: 13px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #888888; font-weight: 500; }
    .detail-value { color: #111111; font-weight: 600; text-align: right; }
    .alert-box { background-color: #FFFDF8; border-left: 4px solid #C6A87D; padding: 14px 18px; margin-bottom: 28px; font-size: 12px; color: #66522E; line-height: 1.5; border-radius: 0 8px 8px 0; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #111111; color: #FFFFFF !important; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .footer { background-color: #FAFAFA; padding: 24px 32px; text-align: center; border-top: 1px solid #EAEAE8; font-size: 12px; color: #888888; }
    .footer a { color: #111111; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">SN24</div>
      <div class="sub-brand">Luxury Atelier &bull; Security</div>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${displayName}</div>
      <p class="message">
        We noticed a recent sign-in to your SN24 account associated with <strong>${to}</strong>.
      </p>

      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">Account Email</span>
          <span class="detail-value">${to}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time (UTC)</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        ${userAgent ? `
        <div class="detail-row">
          <span class="detail-label">Device / Client</span>
          <span class="detail-value">${userAgent.slice(0, 50)}</span>
        </div>` : ""}
        ${ip ? `
        <div class="detail-row">
          <span class="detail-label">IP Address</span>
          <span class="detail-value">${ip}</span>
        </div>` : ""}
        <div class="detail-row">
          <span class="detail-label">Security Status</span>
          <span class="detail-value" style="color: #2E7D32;">&#10003; Authorized</span>
        </div>
      </div>

      <div class="alert-box">
        <strong>Security Notice:</strong> If this was you, you can safely disregard this email. If you did not sign in to your account, please secure your account immediately by changing your password.
      </div>

      <div class="button-container">
        <a href="${STORE_URL}/home" class="button">Go to SN24 Store</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">SN24 Luxury Apparel & Accessories &bull; Lagos, Nigeria</p>
      <p style="margin: 0;">Need assistance? Contact our concierge at <a href="mailto:support@sn24.com.ng">support@sn24.com.ng</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hello ${displayName},

We detected a sign-in to your SN24 account (${to}) on ${formattedDate}.

${ip ? `IP Address: ${ip}\n` : ""}${userAgent ? `Device: ${userAgent}\n` : ""}

If this was you, no action is needed.
If you did not perform this login, please change your password or contact our support team immediately at support@sn24.com.ng.

SN24 Luxury Apparel
${STORE_URL}
  `.trim();

  try {
    const transporter = getTransporter();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[SN24 Mail] Login confirmation email delivered to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SN24 Mail (Dev Logger)] Login confirmation triggered for: ${to}`);
      console.log(`[SN24 Mail (Dev Logger)] Subject: ${subject}`);
      console.log(`[SN24 Mail (Dev Logger)] To: ${to} | Time: ${formattedDate}`);
      return { success: true, isDevLog: true };
    }
  } catch (error: any) {
    console.error("[SN24 Mail Error] Failed to send login confirmation email:", error.message || error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a luxury welcome and account registration confirmation email.
 */
export async function sendWelcomeConfirmationEmail(payload: WelcomeConfirmationPayload) {
  const { to, name } = payload;
  const displayName = name || "Valued Client";
  const subject = "Welcome to SN24 — Your Exclusive Account is Active";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F8; color: #111111; }
    .container { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8E8E6; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 36px 24px; text-align: center; }
    .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; margin: 0; }
    .sub-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C6A87D; margin-top: 6px; font-weight: 600; }
    .content { padding: 40px 32px; }
    .greeting { font-size: 22px; font-weight: 600; color: #111111; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.8; color: #4A4A4A; margin-bottom: 24px; }
    .perks-card { background-color: #F9F9F8; border-radius: 12px; border: 1px solid #EAEAE8; padding: 24px; margin-bottom: 28px; }
    .perks-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #C6A87D; margin-bottom: 14px; }
    .perk-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #333333; line-height: 1.5; }
    .perk-item:last-child { margin-bottom: 0; }
    .perk-bullet { color: #C6A87D; font-weight: bold; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #111111; color: #FFFFFF !important; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .footer { background-color: #FAFAFA; padding: 24px 32px; text-align: center; border-top: 1px solid #EAEAE8; font-size: 12px; color: #888888; }
    .footer a { color: #111111; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">SN24</div>
      <div class="sub-brand">Luxury Atelier &bull; Membership</div>
    </div>
    <div class="content">
      <div class="greeting">Welcome to SN24, ${displayName}.</div>
      <p class="message">
        Your account registration with <strong>${to}</strong> has been confirmed. You now have privileged access to our bespoke collections, private drops, and expedited atelier services.
      </p>

      <div class="perks-card">
        <div class="perks-title">Your Member Privileges</div>
        <div class="perk-item">
          <span class="perk-bullet">&bull;</span>
          <span><strong>Exclusive Drops:</strong> Priority access to seasonal haute couture and limited releases.</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">&bull;</span>
          <span><strong>Custom Tailoring:</strong> Personalized bespoke measurement profile for perfect sizing.</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">&bull;</span>
          <span><strong>Seamless Checkout:</strong> Secure order tracking and expedited concierge shipping.</span>
        </div>
      </div>

      <div class="button-container">
        <a href="${STORE_URL}/shop" class="button">Explore Collections</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">SN24 Luxury Apparel & Accessories &bull; Lagos, Nigeria</p>
      <p style="margin: 0;">Concierge Support: <a href="mailto:hello@sn24.com.ng">hello@sn24.com.ng</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Welcome to SN24, ${displayName}!

Your account registration (${to}) is confirmed and active.
Explore our collections at ${STORE_URL}/shop.

SN24 Luxury Apparel & Accessories
support@sn24.com.ng
  `.trim();

  try {
    const transporter = getTransporter();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[SN24 Mail] Welcome email sent to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SN24 Mail (Dev Logger)] Welcome email triggered for: ${to}`);
      console.log(`[SN24 Mail (Dev Logger)] Subject: ${subject}`);
      return { success: true, isDevLog: true };
    }
  } catch (error: any) {
    console.error("[SN24 Mail Error] Failed to send welcome email:", error.message || error);
    return { success: false, error: error.message };
  }
}

export interface OrderConfirmationPayload {
  orderId: string;
  paymentRef?: string | null;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip?: string;
  totalAmount: number;
  currency?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size?: string | null;
    color?: string | null;
  }>;
  createdAt?: Date;
}

/**
 * Sends a luxury itemized order confirmation email with full receipt and delivery info.
 */
export async function sendOrderConfirmationEmail(payload: OrderConfirmationPayload) {
  const {
    orderId,
    paymentRef,
    customerName,
    customerEmail,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
    totalAmount,
    currency = "USD",
    items,
    createdAt = new Date(),
  } = payload;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(createdAt);

  const formattedTotal = currency === "NGN" 
    ? `₦${totalAmount.toLocaleString()}` 
    : `$${totalAmount.toFixed(2)}`;

  const subject = `Order Confirmed: SN24 #${orderId.slice(-8).toUpperCase()}`;

  const itemRowsHtml = items.map((item) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #EEEEEC; font-size: 13px; color: #111111;">
        <strong>${item.name}</strong>
        ${item.size || item.color ? `<div style="font-size: 11px; color: #888888; margin-top: 3px;">Size: ${item.size || 'RTW'} ${item.color ? `| Color: ${item.color}` : ''}</div>` : ''}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #EEEEEC; font-size: 13px; text-align: center; color: #666666;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #EEEEEC; font-size: 13px; text-align: right; font-weight: 600; color: #111111;">
        ${currency === 'NGN' ? `₦${(item.price * item.quantity).toLocaleString()}` : `$${(item.price * item.quantity).toFixed(2)}`}
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F8; color: #111111; }
    .container { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8E8E6; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 36px 24px; text-align: center; }
    .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 30px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; margin: 0; }
    .sub-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C6A87D; margin-top: 6px; font-weight: 600; }
    .content { padding: 40px 32px; }
    .status-badge { display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; }
    .greeting { font-size: 22px; font-weight: 600; color: #111111; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 28px; }
    .order-box { background-color: #F9F9F8; border-radius: 12px; border: 1px solid #EAEAE8; padding: 20px; margin-bottom: 28px; }
    .order-header-row { display: flex; justify-content: space-between; font-size: 12px; color: #888888; margin-bottom: 8px; }
    .order-ref { font-family: monospace; font-size: 14px; font-weight: 700; color: #111111; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .items-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; text-align: left; padding: 8px; border-bottom: 1px solid #DDDDDC; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; margin-top: 16px; border-top: 2px solid #EAEAE8; font-size: 16px; font-weight: 700; color: #111111; }
    .shipping-card { background-color: #FFFFFF; border: 1px solid #EAEAE8; border-radius: 12px; padding: 18px; margin-bottom: 28px; }
    .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #C6A87D; margin-bottom: 10px; }
    .shipping-details { font-size: 13px; line-height: 1.6; color: #4A4A4A; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #111111; color: #FFFFFF !important; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .footer { background-color: #FAFAFA; padding: 24px 32px; text-align: center; border-top: 1px solid #EAEAE8; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">SN24</div>
      <div class="sub-brand">Luxury Atelier &bull; Order Confirmation</div>
    </div>
    <div class="content">
      <div class="status-badge">&#10003; Payment Verified &bull; Order In Progress</div>
      <div class="greeting">Thank you for your order, ${customerName}.</div>
      <p class="message">
        We have received and verified your payment. Your ready-to-wear pieces are now being prepared for dispatch by our atelier team.
      </p>

      <div class="order-box">
        <div class="order-header-row">
          <span>Order Number: <strong>#${orderId.slice(-8).toUpperCase()}</strong></span>
          <span>${formattedDate}</span>
        </div>
        ${paymentRef ? `<div style="font-size: 11px; color: #888888; margin-bottom: 12px;">Payment Ref: <span style="font-family: monospace;">${paymentRef}</span></div>` : ''}
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Garment</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemRowsHtml}
          </tbody>
        </table>

        <div class="total-row">
          <span>Total Paid</span>
          <span style="font-size: 18px; color: #111111;">${formattedTotal}</span>
        </div>
      </div>

      <div class="shipping-card">
        <div class="card-title">Delivery Destination</div>
        <div class="shipping-details">
          <strong>${customerName}</strong><br>
          ${shippingAddress}<br>
          ${shippingCity}, ${shippingState} ${shippingZip || ''}<br>
          <span style="font-size: 12px; color: #888888;">Notification Email: ${customerEmail}</span>
        </div>
      </div>

      <div class="button-container">
        <a href="${STORE_URL}/account" class="button">View Order in Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">SN24 Ready-to-Wear Atelier &bull; Lagos, Nigeria</p>
      <p style="margin: 0;">Need concierge assistance with your order? Reply directly to this email or write to <a href="mailto:support@sn24.com.ng" style="color: #111111;">support@sn24.com.ng</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Thank you for your order, ${customerName}!

Order ID: #${orderId.slice(-8).toUpperCase()}
Payment Ref: ${paymentRef || 'N/A'}
Date: ${formattedDate}
Total Paid: ${formattedTotal}

Items:
${items.map(i => `- ${i.name} (Qty: ${i.quantity}, Size: ${i.size || 'RTW'}) : $${(i.price * i.quantity).toFixed(2)}`).join('\n')}

Shipping Address:
${customerName}
${shippingAddress}, ${shippingCity}, ${shippingState}

View your order: ${STORE_URL}/account
Support: support@sn24.com.ng
  `.trim();

  try {
    const transporter = getTransporter();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: customerEmail,
        subject,
        text,
        html,
      });
      console.log(`[SN24 Mail] Order confirmation email dispatched to ${customerEmail} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SN24 Mail (Dev Logger)] Order confirmation triggered for: ${customerEmail}`);
      console.log(`[SN24 Mail (Dev Logger)] Order #${orderId.slice(-8).toUpperCase()} | Total: ${formattedTotal}`);
      return { success: true, isDevLog: true };
    }
  } catch (error: any) {
    console.error("[SN24 Mail Error] Failed to send order confirmation email:", error.message || error);
    return { success: false, error: error.message };
  }
}

interface PasswordResetPayload {
  to: string;
  name?: string | null;
  resetUrl: string;
}

/**
 * Sends a luxury password reset link email.
 */
export async function sendPasswordResetEmail(payload: PasswordResetPayload) {
  const { to, name, resetUrl } = payload;
  const displayName = name || "Valued Client";
  const subject = "Reset Your SN24 Password";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F8; color: #111111; }
    .container { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8E8E6; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 32px 24px; text-align: center; }
    .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; margin: 0; }
    .sub-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C6A87D; margin-top: 6px; font-weight: 600; }
    .content { padding: 40px 32px; }
    .greeting { font-size: 20px; font-weight: 600; color: #111111; margin-bottom: 16px; }
    .message { font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 24px; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #111111; color: #FFFFFF !important; padding: 15px 36px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .alert-box { background-color: #FFFDF8; border-left: 4px solid #C6A87D; padding: 14px 18px; margin: 28px 0; font-size: 12px; color: #66522E; line-height: 1.5; border-radius: 0 8px 8px 0; }
    .link-fallback { font-size: 11px; color: #888888; word-break: break-all; margin-top: 16px; }
    .footer { background-color: #FAFAFA; padding: 24px 32px; text-align: center; border-top: 1px solid #EAEAE8; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">SN24</div>
      <div class="sub-brand">Account Security &bull; Password Reset</div>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${displayName}</div>
      <p class="message">
        We received a request to reset the password for your SN24 account associated with <strong>${to}</strong>.
      </p>
      <div class="button-container">
        <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
      </div>
      <div class="alert-box">
        <strong>Security Notice:</strong> This password reset link is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this message—your account remains completely secure.
      </div>
      <p class="link-fallback">
        If the button above does not work, copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color: #111111;">${resetUrl}</a>
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} SN24 Atelier. All rights reserved.<br/>
      Need assistance? Contact <a href="mailto:support@sn24.com.ng" style="color: #111111;">support@sn24.com.ng</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hello, ${displayName}!

We received a request to reset your SN24 password.

Click or paste the link below to choose a new password:
${resetUrl}

This link is valid for 1 hour. If you did not make this request, you can safely ignore this email.

SN24 Security Concierge
support@sn24.com.ng
  `.trim();

  try {
    const transporter = getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[SN24 Mail] Password reset email dispatched to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SN24 Mail (Dev Logger)] Password reset requested for: ${to}`);
      console.log(`[SN24 Mail (Dev Logger)] Reset URL: ${resetUrl}`);
      return { success: true, isDevLog: true, resetUrl };
    }
  } catch (error: any) {
    console.error("[SN24 Mail Error] Failed to send password reset email:", error.message || error);
    return { success: false, error: error.message };
  }
}

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactInquiryEmail(payload: ContactInquiryPayload) {
  const { name, email, phone, subject, message } = payload;
  const conciergeTo = process.env.CONTACT_EMAIL || process.env.GMAIL_USER || "hello@sn24.com.ng";

  const emailSubject = `[SN24 Concierge Inquiry] ${subject} - ${name}`;
  const text = `
New Client Concierge Inquiry:

From: ${name} (${email})
Phone: ${phone || "Not provided"}
Inquiry Topic: ${subject}
Date: ${new Date().toUTCString()}

Message:
${message}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0C0C0E; color: #F9F9FB; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #17171C; border: 1px solid #26262B; border-radius: 12px; padding: 32px;">
    <h2 style="color: #D8C3A5; font-size: 20px; margin-top: 0;">New Client Concierge Inquiry</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr><td style="color: #8E8E93; padding: 6px 0; font-size: 13px;">Client Name:</td><td style="color: #F9F9FB; font-weight: bold; font-size: 14px;">${name}</td></tr>
      <tr><td style="color: #8E8E93; padding: 6px 0; font-size: 13px;">Email Address:</td><td style="color: #F9F9FB; font-family: monospace; font-size: 13px;">${email}</td></tr>
      <tr><td style="color: #8E8E93; padding: 6px 0; font-size: 13px;">Phone:</td><td style="color: #F9F9FB; font-size: 13px;">${phone || "Not provided"}</td></tr>
      <tr><td style="color: #8E8E93; padding: 6px 0; font-size: 13px;">Topic:</td><td style="color: #D8C3A5; font-weight: bold; font-size: 13px;">${subject}</td></tr>
    </table>
    <div style="background: #0C0C0E; border: 1px solid #26262B; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <span style="color: #8E8E93; font-size: 11px; text-transform: uppercase; font-weight: bold;">Client Message:</span>
      <p style="color: #F9F9FB; font-size: 14px; line-height: 1.6; margin-top: 8px; white-space: pre-wrap;">${message}</p>
    </div>
    <p style="color: #8E8E93; font-size: 11px; margin: 0;">SN24 Luxury Concierge Operations &bull; ${STORE_URL}</p>
  </div>
</body>
</html>
  `.trim();

  try {
    const transporter = getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: conciergeTo,
        replyTo: email,
        subject: emailSubject,
        text,
        html,
      });
      console.log(`[SN24 Mail] Concierge inquiry sent to ${conciergeTo} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SN24 Mail (Dev Logger)] Concierge inquiry from ${name} (${email}): ${message}`);
      return { success: true, isDevLog: true };
    }
  } catch (error: any) {
    console.error("[SN24 Mail Error] Failed to send contact inquiry email:", error.message || error);
    return { success: false, error: error.message };
  }
}


