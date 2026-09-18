import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "All fields (email, token, password) are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Verify token exists and is valid
    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier: cleanEmail,
        token: token,
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Invalid password reset link. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > record.expires) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({
        where: { identifier: cleanEmail },
      });
      return NextResponse.json(
        { message: "This password reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update user password
    await prisma.user.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword },
    });

    // 4. Delete the token so it cannot be re-used
    await prisma.verificationToken.deleteMany({
      where: { identifier: cleanEmail },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You may now sign in.",
    });
  } catch (error: any) {
    console.error("[ResetPassword Error]:", error);
    return NextResponse.json(
      { message: "Failed to reset password. Please try again later." },
      { status: 500 }
    );
  }
}
