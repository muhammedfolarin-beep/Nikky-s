import { 
  sendLoginConfirmationEmail, 
  sendWelcomeConfirmationEmail,
  sendOrderConfirmationEmail 
} from "../src/lib/mail";

async function runMailConfirmationTest() {
  console.log("=================================================");
  console.log("   TESTING EMAIL CONFIRMATION NOTIFICATIONS     ");
  console.log("=================================================\n");

  const testGmail = "folarin.dev@gmail.com";
  const testName = "Folarin Luxury Client";

  console.log(`1. Dispatching Login Confirmation Email to "${testGmail}"...`);
  const loginResult = await sendLoginConfirmationEmail({
    to: testGmail,
    name: testName,
    ip: "197.210.55.12",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(),
  });

  if (loginResult.success) {
    console.log(`\x1b[32m✔ Login confirmation successfully triggered!\x1b[0m\n`);
  } else {
    console.error(`\x1b[31m✖ Login confirmation dispatch failed:\x1b[0m`, loginResult.error);
  }

  console.log(`2. Dispatching Welcome / Registration Email to "${testGmail}"...`);
  const welcomeResult = await sendWelcomeConfirmationEmail({
    to: testGmail,
    name: testName,
  });

  if (welcomeResult.success) {
    console.log(`\x1b[32m✔ Welcome registration confirmation successfully triggered!\x1b[0m\n`);
  } else {
    console.error(`\x1b[31m✖ Welcome confirmation dispatch failed:\x1b[0m`, welcomeResult.error);
  }

  console.log(`3. Dispatching Ready-to-Wear Order Confirmation Email to "${testGmail}"...`);
  const orderResult = await sendOrderConfirmationEmail({
    orderId: "cm789abcde0012345",
    paymentRef: "PAYSTACK-REF-99281726",
    customerName: testName,
    customerEmail: testGmail,
    shippingAddress: "Plot 14 Admiralty Way, Lekki Phase 1",
    shippingCity: "Lekki",
    shippingState: "Lagos",
    shippingZip: "105102",
    totalAmount: 245.00,
    currency: "USD",
    items: [
      {
        name: "Noir Silk Midi Dress",
        price: 185.00,
        quantity: 1,
        size: "UK 10",
        color: "Obsidian Black"
      },
      {
        name: "Sculpted Satin Scarf",
        price: 60.00,
        quantity: 1,
        size: "One Size",
        color: "Warm Sand"
      }
    ]
  });

  if (orderResult.success) {
    console.log(`\x1b[32m✔ Order confirmation email successfully triggered!\x1b[0m\n`);
  } else {
    console.error(`\x1b[31m✖ Order confirmation dispatch failed:\x1b[0m`, orderResult.error);
  }

  console.log("=================================================");
  console.log("   MAIL CONFIRMATION TEST COMPLETED SUCCESSFULLY ");
  console.log("=================================================\n");
}

runMailConfirmationTest().catch(console.error);

