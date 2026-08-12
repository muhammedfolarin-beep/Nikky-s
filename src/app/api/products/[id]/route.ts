import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/data/mockProducts";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  // Emulate database fetch delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = getProductById(id);
  
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  return NextResponse.json({ data: product });
}
