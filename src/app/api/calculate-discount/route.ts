import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originalPrice, finalPrice, discountPercentage } = body;

    if (originalPrice === undefined || originalPrice === null) {
      return NextResponse.json({ error: "originalPrice is required" }, { status: 400 });
    }

    const price = parseFloat(originalPrice);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: "originalPrice must be a valid non-negative number" }, { status: 400 });
    }

    // If finalPrice is provided, calculate the discount percentage
    if (finalPrice !== undefined && finalPrice !== null) {
      const final = parseFloat(finalPrice);
      if (isNaN(final) || final < 0) {
        return NextResponse.json({ error: "finalPrice must be a valid non-negative number" }, { status: 400 });
      }

      if (price === 0) {
        return NextResponse.json({ discountPercentage: 0, originalPrice: price, finalPrice: final });
      }

      const discount = ((price - final) / price) * 100;
      return NextResponse.json({ 
        discountPercentage: Math.round(discount * 100) / 100,
        originalPrice: price,
        finalPrice: final
      });
    }

    // If discountPercentage is provided, calculate the final price
    if (discountPercentage !== undefined && discountPercentage !== null) {
      const discount = parseFloat(discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return NextResponse.json({ error: "discountPercentage must be a valid percentage between 0 and 100" }, { status: 400 });
      }

      const final = price - (price * (discount / 100));
      return NextResponse.json({ 
        finalPrice: Math.round(final * 100) / 100,
        originalPrice: price,
        discountPercentage: discount
      });
    }

    return NextResponse.json({ error: "Either finalPrice or discountPercentage is required" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
