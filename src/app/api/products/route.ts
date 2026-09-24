import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};
    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { collection: { contains: query, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(100, Math.max(1, limit)),
    });

    return NextResponse.json({
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    console.error("API /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
