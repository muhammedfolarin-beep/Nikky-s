import { validateFunctionalEmail } from "../src/lib/emailValidation";

interface TestCase {
  email: string;
  expectedValid: boolean;
  description: string;
  options?: { allowTestEmails?: boolean; skipMxCheck?: boolean };
}

const TEST_CASES: TestCase[] = [
  // 1. Valid production-style emails
  {
    email: "folarin.dev@gmail.com",
    expectedValid: true,
    description: "Valid standard Gmail address",
  },
  {
    email: "support@microsoft.com",
    expectedValid: true,
    description: "Valid corporate email with active MX",
  },
  {
    email: "contact@yahoo.com",
    expectedValid: true,
    description: "Valid Yahoo address",
  },

  // 2. Syntax / Format errors
  {
    email: "plainaddress",
    expectedValid: false,
    description: "Missing @ and domain",
  },
  {
    email: "@missing-username.com",
    expectedValid: false,
    description: "Missing username",
  },
  {
    email: "user@domain..com",
    expectedValid: false,
    description: "Consecutive dots in domain",
  },
  {
    email: ".user@domain.com",
    expectedValid: false,
    description: "Username starting with dot",
  },
  {
    email: "user@domain",
    expectedValid: false,
    description: "Missing top-level domain",
  },

  // 3. Typo domains
  {
    email: "customer@gmial.com",
    expectedValid: false,
    description: "Typo in Gmail domain (gmial.com)",
  },
  {
    email: "customer@hotmial.com",
    expectedValid: false,
    description: "Typo in Hotmail domain (hotmial.com)",
  },
  {
    email: "customer@yahooo.com",
    expectedValid: false,
    description: "Typo in Yahoo domain (yahooo.com)",
  },

  // 4. Disposable / Temp domains
  {
    email: "temporary@10minutemail.com",
    expectedValid: false,
    description: "Disposable domain 10minutemail.com",
  },
  {
    email: "throwaway@mailinator.com",
    expectedValid: false,
    description: "Disposable domain mailinator.com",
  },
  {
    email: "anon@tempmail.com",
    expectedValid: false,
    description: "Disposable domain tempmail.com",
  },

  // 5. Junk usernames
  {
    email: "asdfasdf@gmail.com",
    expectedValid: false,
    description: "Junk keyboard mash username",
  },

  // 6. Non-existent domain / Missing MX records
  {
    email: "user@thisdomaindoesnotexist123456789xyz.com",
    expectedValid: false,
    description: "Non-existent domain with no MX records",
  },

  // 7. Explicit Test email mode testing
  {
    email: "test@example.com",
    expectedValid: true,
    description: "Test address with test allowance enabled",
    options: { allowTestEmails: true },
  },
  {
    email: "automated.tester@test.local",
    expectedValid: true,
    description: "Test domain (.local) with test allowance enabled",
    options: { allowTestEmails: true },
  },
];

async function runEmailValidationTests() {
  console.log("=================================================");
  console.log("    EMAIL VALIDATION SUITE - TEST EXECUTION     ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    process.stdout.write(`[${i + 1}/${TEST_CASES.length}] Testing: "${tc.email}" - ${tc.description}... `);

    try {
      const result = await validateFunctionalEmail(tc.email, tc.options);
      const isSuccess = result.isValid === tc.expectedValid;

      if (isSuccess) {
        console.log("\x1b[32mPASSED\x1b[0m");
        passed++;
      } else {
        console.log("\x1b[31mFAILED\x1b[0m");
        console.log(`   Expected isValid=${tc.expectedValid}, got isValid=${result.isValid}. Error message: "${result.error}"`);
        failed++;
      }
    } catch (err: any) {
      console.log("\x1b[31mERROR EXECUTING TEST\x1b[0m");
      console.error(`   ${err.message || err}`);
      failed++;
    }
  }

  console.log("\n=================================================");
  console.log(`RESULTS: \x1b[32m${passed} Passed\x1b[0m | \x1b[31m${failed} Failed\x1b[0m (Total: ${TEST_CASES.length})`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runEmailValidationTests();
