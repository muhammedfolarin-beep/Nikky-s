import dns from "dns";

// Common temporary / throwaway / disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "10minutemail.com",
  "10minutemail.net",
  "10mail.org",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "cool.fr.nf",
  "jetable.fr.nf",
  "nospam.ze.tc",
  "nomail.xl.cx",
  "mega.zik.dj",
  "speed.1s.fr",
  "courriel.fr.nf",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",
  "throwawaymail.com",
  "dispostable.com",
  "trashmail.com",
  "trashmail.net",
  "trashmail.org",
  "maildrop.cc",
  "fakeinbox.com",
  "getairmail.com",
  "mytemp.email",
  "inboxkitten.com",
  "mohmal.com",
  "burnermail.io",
  "crazymailing.com",
  "generator.email",
  "nada.ltd",
  "getnada.com",
  "emailondeck.com",
  "fakemailgenerator.com",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "einrot.com",
  "disposablemail.com",
  "dropmail.me",
  "trashmail.me",
  "emailfake.com",
  "tempinbox.com",
  "boximail.com",
  "discard.email",
  "mailsac.com",
  "harakirimail.com",
  "tmailor.com",
  "burnermail.com",
  "minuteinbox.com",
  "internxt.com",
]);

// Common domain typos mapped to their correct counterpart
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmaul.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmeil.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmai.co": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yaho.co": "yahoo.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlock.com": "outlook.com",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
};

// Obvious dummy / spam usernames
const JUNK_LOCALPARTS = new Set([
  "test",
  "testing",
  "asdf",
  "asdfgh",
  "asdfasdf",
  "qwerty",
  "fake",
  "dummy",
  "junk",
  "temp",
  "sample",
  "example",
  "123456",
  "111111",
  "000000",
  "aaaaaa",
  "bbbbbb",
  "cccccc",
  "abcdef",
  "noemail",
  "nomail",
  "null",
  "undefined",
  "none",
  "nothing",
]);

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface EmailValidationOptions {
  allowTestEmails?: boolean;
  skipMxCheck?: boolean;
}

/**
 * Validates syntax, provider-specific rules, domain MX records, and blocklists.
 */
export async function validateFunctionalEmail(
  rawEmail: string,
  options?: EmailValidationOptions
): Promise<{ isValid: boolean; error?: string; normalizedEmail?: string }> {
  const isTestEnv =
    options?.allowTestEmails ||
    process.env.NODE_ENV === "test" ||
    process.env.ALLOW_TEST_EMAILS === "true";

  if (!rawEmail || typeof rawEmail !== "string") {
    return { isValid: false, error: "Email address is required." };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic length checks (RFC 5321)
  if (email.length < 6 || email.length > 254) {
    return { isValid: false, error: "Email address must be between 6 and 254 characters." };
  }

  if (!STRICT_EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please provide a valid email format (e.g. name@domain.com)." };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Email must contain a single '@' separator." };
  }

  const [localPart, domain] = parts;

  // Local part length check
  if (localPart.length < 1 || localPart.length > 64) {
    return { isValid: false, error: "The username before @ must be between 1 and 64 characters." };
  }

  // Domain length and format checks
  if (domain.length < 4 || domain.length > 255) {
    return { isValid: false, error: "Email domain is invalid." };
  }

  // Check top-level domain (TLD)
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: "Email must have a valid top-level domain (e.g. .com, .ng)." };
  }

  // Check for consecutive dots in localpart or domain
  if (localPart.includes("..") || domain.includes("..")) {
    return { isValid: false, error: "Email address cannot contain consecutive periods (..)." };
  }

  // Check if local part starts or ends with a period
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return { isValid: false, error: "Email username cannot start or end with a period." };
  }

  // Check typo suggestions
  if (DOMAIN_TYPOS[domain]) {
    return {
      isValid: false,
      error: `Did you mean @${DOMAIN_TYPOS[domain]}? Please check your email spelling.`,
    };
  }

  // Check disposable email blacklist
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "Temporary or disposable email addresses are not permitted. Please use a permanent email.",
    };
  }

  // Check junk localparts (unless in test environment or test options enabled)
  const cleanLocal = localPart.replace(/[._+-]/g, "");
  if (!isTestEnv && (JUNK_LOCALPARTS.has(cleanLocal) || cleanLocal.length < 2)) {
    return {
      isValid: false,
      error: "Please provide a real, functional email address.",
    };
  }

  // Provider-Specific Strict Validation Rules
  if (domain === "gmail.com" || domain === "googlemail.com") {
    // Gmail strict rule: 6-30 characters, letters/numbers/dots only
    const cleanGmailUser = localPart.replace(/\./g, "");
    if (!isTestEnv && (cleanGmailUser.length < 6 || cleanGmailUser.length > 30)) {
      return {
        isValid: false,
        error: "Google Gmail usernames must be between 6 and 30 characters long.",
      };
    }

    if (!/^[a-z0-9.]+$/.test(localPart)) {
      return {
        isValid: false,
        error: "Gmail usernames can only contain letters (a-z), numbers (0-9), and periods (.).",
      };
    }

    // Check for repetitive characters (e.g. "aaaaaa", "111111")
    if (!isTestEnv && /^(.)\1+$/.test(cleanGmailUser)) {
      return {
        isValid: false,
        error: "Please enter a valid, active Gmail address.",
      };
    }
  } else if (domain === "yahoo.com" || domain.startsWith("yahoo.")) {
    // Yahoo rules: 4-32 characters, must start with letter
    if (localPart.length < 4 || localPart.length > 32) {
      return {
        isValid: false,
        error: "Yahoo usernames must be between 4 and 32 characters long.",
      };
    }
    if (!/^[a-z]/.test(localPart)) {
      return {
        isValid: false,
        error: "Yahoo usernames must start with a letter.",
      };
    }
    if (!/^[a-z0-9._]+$/.test(localPart)) {
      return {
        isValid: false,
        error: "Yahoo usernames can only contain letters, numbers, underscores, and periods.",
      };
    }
  } else if (domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com") {
    if (!/^[a-z0-9]/.test(localPart)) {
      return {
        isValid: false,
        error: "Microsoft email usernames must start with a letter or number.",
      };
    }
  }

  // If in test mode or skipMxCheck is specified, skip network DNS MX lookup for known test domains
  if (options?.skipMxCheck || (isTestEnv && (domain === "example.com" || domain === "test.com" || domain.endsWith(".local") || domain.endsWith(".test")))) {
    return {
      isValid: true,
      normalizedEmail: email,
    };
  }

  // Real-time DNS MX Lookup to guarantee the domain can receive email
  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

    const mxRecords = await Promise.race([
      resolver.resolveMx(domain),
      new Promise<dns.MxRecord[]>((_, reject) =>
        setTimeout(() => reject(new Error("DNS_TIMEOUT")), 3500)
      ),
    ]);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        error: `The email domain "${domain}" does not have active mail servers (MX records).`,
      };
    }

    // Check for null MX record (RFC 7505 - "no mail service accepted")
    const isNullMx = mxRecords.some((rec) => rec.exchange === "" || rec.exchange === ".");
    if (isNullMx && mxRecords.length === 1) {
      return {
        isValid: false,
        error: `The domain "${domain}" does not accept incoming emails.`,
      };
    }
  } catch (err: any) {
    if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "SERVFAIL") {
      return {
        isValid: false,
        error: `The email domain "${domain}" does not exist or has no active mail server.`,
      };
    }
    // If DNS times out or has network issue, fallback to basic syntax check so users aren't blocked on network glitches
    console.warn(`DNS MX check skipped for domain ${domain}:`, err.message || err);
  }

  return {
    isValid: true,
    normalizedEmail: email,
  };
}
