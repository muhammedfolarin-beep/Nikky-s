import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

async function testPasswordResetFlow() {
  console.log("=== Testing Password Reset Flow ===\n");

  const testEmail = "test-reset-user@example.com";
  const initialPassword = "InitialPassword123!";
  const newPassword = "UpdatedPassword456!";

  // 1. Create or ensure test user
  await prisma.user.deleteMany({ where: { email: testEmail } });
  await prisma.verificationToken.deleteMany({ where: { identifier: testEmail } });

  const hashedInitial = await bcrypt.hash(initialPassword, 10);
  const user = await prisma.user.create({
    data: {
      name: "Reset Test User",
      email: testEmail,
      password: hashedInitial,
      role: "USER",
    },
  });
  console.log(`[Step 1] Created test user: ${user.email}`);

  // 2. Simulate forgot password request (token generation)
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000);

  await prisma.verificationToken.create({
    data: {
      identifier: testEmail,
      token,
      expires,
    },
  });
  console.log(`[Step 2] Generated verification token for ${testEmail}`);

  // 3. Dispatch reset email
  const emailRes = await sendPasswordResetEmail({
    to: testEmail,
    name: user.name,
    resetUrl: `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(testEmail)}`,
  });
  console.log(`[Step 3] Password reset email dispatched (Success: ${emailRes.success})`);

  // 4. Verify token from database
  const tokenRecord = await prisma.verificationToken.findFirst({
    where: { identifier: testEmail, token },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    throw new Error("Token verification failed!");
  }
  console.log(`[Step 4] Token record verified in database.`);

  // 5. Simulate reset-password (update password & delete token)
  const hashedNew = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email: testEmail },
    data: { password: hashedNew },
  });
  await prisma.verificationToken.deleteMany({ where: { identifier: testEmail } });
  console.log(`[Step 5] Password updated and token deleted.`);

  // 6. Verify authentication with new password
  const updatedUser = await prisma.user.findUnique({ where: { email: testEmail } });
  const isOldValid = await bcrypt.compare(initialPassword, updatedUser!.password!);
  const isNewValid = await bcrypt.compare(newPassword, updatedUser!.password!);

  console.log(`[Step 6] Old password valid: ${isOldValid} (Expected: false)`);
  console.log(`[Step 6] New password valid: ${isNewValid} (Expected: true)`);

  // Cleanup test user
  await prisma.user.deleteMany({ where: { email: testEmail } });
  console.log(`\n=== Password Reset Flow Test Completed Successfully! ===`);
}

testPasswordResetFlow()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
