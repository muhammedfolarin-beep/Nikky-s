import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { originalPrice, finalPrice, discountPercentage } = await request.json();

    if (originalPrice === undefined || originalPrice === null) {
      return NextResponse.json({ error: "originalPrice is required" }, { status: 400 });
    }

    const price = parseFloat(originalPrice);

    // If finalPrice is provided, calculate the discount percentage
    if (finalPrice !== undefined && finalPrice !== null) {
      const final = parseFloat(finalPrice);
      if (price === 0) {
        return NextResponse.json({ discountPercentage: 0, originalPrice: price, finalPrice: final });
      }
      const discount = ((price - final) / price) * 100;
      return NextResponse.json({ 
        discountPercentage: Math.round(discount * 100) / 100, // Round to 2 decimal places
        originalPrice: price,
        finalPrice: final
      });
    }

    // If discountPercentage is provided, calculate the final price
    if (discountPercentage !== undefined && discountPercentage !== null) {
      const discount = parseFloat(discountPercentage);
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
