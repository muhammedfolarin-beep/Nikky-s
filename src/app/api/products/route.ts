import { NextResponse } from "next/server";
import { mockProducts } from "@/data/mockProducts";

export async function GET() {
  // Emulate database fetch delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    data: mockProducts,
    total: mockProducts.length,
  });
}
