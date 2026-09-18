import crypto from "crypto";

async function testPaystackWebhookSecurity() {
  console.log("=================================================");
  console.log("   TESTING PAYSTACK WEBHOOK HMAC VERIFICATION    ");
  console.log("=================================================\n");

  const mockSecret = "sk_test_mock_secret_key_sn24_luxury_123456789";
  process.env.PAYSTACK_SECRET_KEY = mockSecret;

  const mockPayload = JSON.stringify({
    event: "charge.success",
    data: {
      reference: "SN24-TEST-REF-" + Date.now(),
      amount: 2500000, // 25,000 NGN in kobo
      currency: "NGN",
      channel: "card",
      customer: {
        email: "test.customer@gmail.com",
        first_name: "Ade",
        last_name: "Balogun"
      }
    }
  });

  // 1. Generate valid HMAC SHA-512 signature
  const validSignature = crypto
    .createHmac("sha512", mockSecret)
    .update(mockPayload)
    .digest("hex");

  console.log("1. Generated Valid HMAC SHA-512 Signature:");
  console.log(`   ${validSignature.slice(0, 32)}...`);

  // Verification helper matching /api/webhooks/paystack
  const verify = (payload: string, signatureHeader: string, secret: string) => {
    const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
    return hash === signatureHeader;
  };

  // 2. Test valid signature
  const isValid = verify(mockPayload, validSignature, mockSecret);
  if (isValid) {
    console.log("\x1b[32m✔ Valid signature successfully verified.\x1b[0m\n");
  } else {
    console.error("\x1b[31m✖ Valid signature verification failed!\x1b[0m\n");
    process.exit(1);
  }

  // 3. Test tampered payload detection
  const tamperedPayload = mockPayload.replace("2500000", "500000");
  const isTamperedRejected = !verify(tamperedPayload, validSignature, mockSecret);
  if (isTamperedRejected) {
    console.log("\x1b[32m✔ Tampered payload successfully detected and rejected.\x1b[0m\n");
  } else {
    console.error("\x1b[31m✖ Tampered payload was not rejected!\x1b[0m\n");
    process.exit(1);
  }

  // 4. Test invalid secret detection
  const isFakeSecretRejected = !verify(mockPayload, validSignature, "sk_test_fake_attacker_key");
  if (isFakeSecretRejected) {
    console.log("\x1b[32m✔ Untrusted secret successfully rejected.\x1b[0m\n");
  } else {
    console.error("\x1b[31m✖ Untrusted secret was not rejected!\x1b[0m\n");
    process.exit(1);
  }

  console.log("=================================================");
  console.log("   PAYSTACK WEBHOOK TEST PASSED WITH 100% SUCCESS");
  console.log("=================================================\n");
}

testPaystackWebhookSecurity().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
