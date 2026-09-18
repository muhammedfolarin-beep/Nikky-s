import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication & Authorization Check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required to upload assets." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePaths: string[] = [];

    for (const file of files) {
      // 2. MIME & Extension Validation
      if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid file type "${file.type}". Only JPEG, PNG, and WebP images are allowed.` },
          { status: 400 }
        );
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json(
          { error: `Invalid file extension ".${extension}". Only .jpg, .png, and .webp are allowed.` },
          { status: 400 }
        );
      }

      // 3. File Size Validation
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed size of 5MB.` },
          { status: 400 }
        );
      }

      // 4. Sanitized Unique File Name
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 50);
      const uniqueName = `product_${Date.now()}_${cleanBaseName}.${extension}`;
      const filePath = path.join(uploadDir, uniqueName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filePath, buffer);

      filePaths.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ success: true, filePaths });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Upload handler error:", error);
    }
    return NextResponse.json({ error: error.message || "Failed to upload file(s)." }, { status: 500 });
  }
}
