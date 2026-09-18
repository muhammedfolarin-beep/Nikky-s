import { Page } from "@playwright/test";

/**
 * Intercepts external Paystack network calls and provides mock transaction callbacks.
 */
export async function setupPaystackMock(page: Page, options?: { shouldSucceed?: boolean }) {
  const shouldSucceed = options?.shouldSucceed ?? true;

  // Provide init script fallback
  await page.addInitScript(`
    window.__PAYSTACK_TEST_MOCK__ = { shouldSucceed: ${shouldSucceed} };
    window.PaystackPop = {
      setup: function(options) {
        return {
          openIframe: function() {
            setTimeout(function() {
              if (${shouldSucceed}) {
                var ref = "E2E_MOCK_PAYSTACK_REF_" + Date.now();
                if (options.callback) options.callback({ reference: ref });
                if (options.onSuccess) options.onSuccess({ reference: ref });
              } else {
                if (options.onClose) options.onClose();
              }
            }, 100);
          }
        };
      }
    };
  `);

  // Intercept Paystack inline JS SDK if loaded
  await page.route("**/js.paystack.co/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `
        window.PaystackPop = {
          setup: function(options) {
            return {
              openIframe: function() {
                setTimeout(function() {
                  if (${shouldSucceed}) {
                    var ref = "E2E_MOCK_PAYSTACK_REF_" + Date.now();
                    if (options.callback) options.callback({ reference: ref });
                    if (options.onSuccess) options.onSuccess({ reference: ref });
                  } else {
                    if (options.onClose) options.onClose();
                  }
                }, 100);
              }
            };
          }
        };
      `
    });
  });

  // Intercept Paystack API verify endpoint
  await page.route("https://api.paystack.co/transaction/verify/**", async (route) => {
    if (shouldSucceed) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: true,
          message: "Verification successful",
          data: {
            status: "success",
            reference: "E2E_MOCK_PAYSTACK_REF",
            amount: 45000,
            currency: "USD",
            gateway_response: "Successful"
          }
        })
      });
    } else {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          status: false,
          message: "Transaction failed"
        })
      });
    }
  });
}
