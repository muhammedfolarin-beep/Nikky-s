import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateFunctionalEmail } from "@/lib/emailValidation";
import { sendWelcomeConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const rawEmail = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!name || !rawEmail || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required." },
        { status: 400 }
      );
    }

    // Validate that the email is functional, active, and not disposable/malformed
    const validationResult = await validateFunctionalEmail(rawEmail);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { message: validationResult.error || "Please provide a valid, functional email address." },
        { status: 400 }
      );
    }

    const email = validationResult.normalizedEmail || rawEmail.toLowerCase().trim();

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { message: "Password exceeds the maximum length of 128 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password securely with work factor 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create standard customer user (role strictly locked to USER)
    const user = await prisma.user.create({
      data: {
        name: name.slice(0, 100),
        email,
        password: hashedPassword,
        role: "USER"
      }
    });

    // Dispatch luxury welcome and account confirmation email (non-blocking)
    sendWelcomeConfirmationEmail({
      to: email,
      name: user.name,
    }).catch((mailErr) => {
      console.warn("Welcome confirmation email dispatch error:", mailErr);
    });

    return NextResponse.json(
      { 
        message: "Account created successfully.",
        user: { id: user.id, name: user.name, email: user.email }
      },
      { status: 201 }
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Registration error:", error);
    }
    return NextResponse.json(
      { message: "An unexpected error occurred during account creation." },
      { status: 500 }
    );
  }
}
