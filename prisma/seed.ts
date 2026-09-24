const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Copy the latest mockProducts data here for seeding
const defaultDetails = {
  description: "Experience the epitome of luxury with our meticulously crafted pieces. Designed to provide both comfort and style, this garment features a modern silhouette that seamlessly transitions from day to night. Each piece is constructed with premium materials to ensure longevity and timeless appeal in your wardrobe.",
  material: "Premium composition featuring 80% sustainable fibers. Lined with breathable cupro for ultimate comfort against the skin.",
  careInstructions: "Dry clean only. Cool iron if necessary. Do not bleach or tumble dry. Store on a contoured hanger to preserve shape."
};

const mockProducts = [
  {
    id: "p1",
    name: "Structured Midi Shirt Dress",
    brand: "SN24 Reserve",
    price: 345,
    category: "The Office Edit",
    type: "Dresses",
    colors: ["#16202C", "#FCFCFC", "#E4E7EB"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/uploads/1786654782269-download__8_.jpg",
      "/uploads/1786654782271-download__7_.jpg"
    ],
    isNew: true,
    isBestseller: true,
    description: "Command the boardroom with sharply tailored lines. This structured midi dress features a neat button-down front, a cinched waist for definition, and breathable cotton-blend fabric for all-day comfort.",
    material: "Main: 95% Cotton, 5% Elastane.",
    careInstructions: "Dry clean or gentle cold wash.",
    collection: "The SN24 Capsule"
  },
  {
    id: "p2",
    name: "Fluid Satin Slip Dress",
    brand: "SN24 Studio",
    price: 285,
    category: "Evening & Occasion",
    type: "Dresses",
    colors: ["#16202C"],
    sizes: ["S", "M", "L"],
    images: [
      "/uploads/1786654380097-3281.jpg",
      "/uploads/1786654380104-3290.jpg"
    ],
    isNew: true,
    description: "Elegant and sophisticated depth for the transition from day to evening. This slip dress drapes beautifully over the body, crafted from luxurious heavy silk satin.",
    material: "100% Heavy Silk Satin.",
    careInstructions: "Professional dry clean only.",
    collection: "The Midnight Navy Edit"
  },
  {
    id: "p3",
    name: "Soft Linen Wide-Leg Trousers",
    brand: "SN24 Essentials",
    price: 195,
    category: "The Resort Collection",
    type: "Bottoms",
    colors: ["#FCFCFC", "#E4E7EB"],
    sizes: ["24", "26", "28", "30", "32"],
    images: [
      "/uploads/1786654266079-Timeless_Gold_Watch___Blue_Stripes_Ensemble.jpg",
      "/uploads/1786654266082-_High_Waisted_Wide_Leg_Work_Pants_for_Women___Elegant_Office___Business_Casual_Style_.jpg"
    ],
    description: "Breathable luxury and clean, uninterrupted lines. These high-waisted wide-leg trousers are crafted from crisp linens in calming neutral tones, perfect for relaxed sunny afternoons.",
    material: "100% Premium Organic Linen.",
    careInstructions: "Cold hand wash or dry clean.",
    collection: "Soft White Minimalism"
  },
  {
    id: "p4",
    name: "Classic Double-Breasted Trench Coat",
    brand: "SN24 Reserve",
    price: 450,
    originalPrice: 520,
    category: "Outerwear & Layering",
    type: "Outerwear",
    colors: ["#C9A96E", "#16202C"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/uploads/1786654891405-___Chocolate_Brown_Satin_Blouse_Outfit_Inspiration.jpg",
      "/uploads/1786653991709-494.jpg"
    ],
    isBestseller: true,
    description: "The finishing touch for any premium wardrobe. This timeless trench coat drapes beautifully over any ensemble, offering a structured, commanding silhouette.",
    material: "100% Gabardine Cotton.",
    careInstructions: "Professional dry clean only.",
    collection: "The SN24 Capsule"
  },
  {
    id: "p5",
    name: "Cashmere-Blend Ribbed Turtleneck",
    brand: "SN24 Essentials",
    price: 220,
    category: "Everyday Essentials",
    type: "Knitwear",
    colors: ["#16202C", "#4A5565"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/uploads/1786654115061-Gemini_Generated_Image_z9hik8z9hik8z9hi.png",
      "/uploads/1786654115125-____.jpg"
    ],
    description: "The foundation of a premium wardrobe. Designed for elevated, effortless daily living, this fine-knit turtleneck offers warmth and unmatched softness.",
    material: "70% Merino Wool, 30% Cashmere.",
    careInstructions: "Hand wash cold, dry flat.",
    collection: "The Midnight Navy Edit"
  },
  {
    id: "p6",
    name: "Crisp Silk Camisole",
    brand: "SN24 Studio",
    price: 135,
    category: "The Office Edit",
    type: "Tops & Blouses",
    colors: ["#FCFCFC"],
    sizes: ["S", "M", "L"],
    images: [
      "/uploads/1786654461488-Solid_Color_Lapel_Long_Sleeve_Casual_Top.jpg",
      "/uploads/1786654473252-Gemini_Generated_Image_3sfekv3sfekv3sfe.png"
    ],
    isNew: true,
    description: "A celebration of light, airy structures and understated elegance. This seamless silk camisole is a foundational layering piece for sharp blazers or flowing skirts.",
    material: "100% Mulberry Silk.",
    careInstructions: "Dry clean only.",
    collection: "Soft White Minimalism"
  },
  {
    id: "p7",
    name: "Elevated Denim Jacket",
    brand: "SN24 Essentials",
    price: 185,
    category: "Everyday Essentials",
    type: "Denim",
    colors: ["#B8C8D6"],
    sizes: ["S", "M", "L"],
    images: [
      "/uploads/1786654201054-spring_outfits_casual__The_Chic_Minimalist_a_crisp_white_oversized_poplin_button-down_shirt_with_structured_cuffs__tucked_into_high-waisted_tailored_beige_linen_trousers_with_a_thin_leather_belt_.jpg",
      "/uploads/1786654201061-Women_s_Oversized_Cotton_Poplin_Button-Down_Shirt___More_Colors_Available.jpg"
    ],
    isBestseller: true,
    description: "High-quality basics reimagined. Our elevated denim jacket features minimalist hardware and a structured fit that effortlessly bridges the gap between casual and polished.",
    material: "100% Premium Cotton Denim.",
    careInstructions: "Machine wash cold inside out.",
    collection: "The SN24 Capsule"
  },
  {
    id: "p8",
    name: "Tailored Double-Breasted Blazer",
    brand: "SN24 Reserve",
    price: 310,
    category: "The Office Edit",
    type: "Outerwear",
    colors: ["#16202C"],
    sizes: ["36", "38", "40", "42"],
    images: [
      "/uploads/1786653991709-494.jpg",
      "/uploads/1786653991714-429.jpg"
    ],
    isNew: true,
    description: "Command the boardroom with sharply tailored blazers. Neatly made pieces that project authority and style, featuring deep, rich tones and timeless silhouettes.",
    material: "100% Italian Wool.",
    careInstructions: "Dry clean only.",
    collection: "The Midnight Navy Edit"
  },
  {
    id: "p9",
    name: "Silk Sleepwear Set",
    brand: "SN24 Studio",
    price: 245,
    originalPrice: 280,
    category: "Everyday Essentials",
    type: "Loungewear & Intimates",
    colors: ["#FCFCFC", "#16202C"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/uploads/1786654655428-download__6_.jpg",
      "/uploads/1786654655436-Buy_this_Black_Square_Neck_Cap_Sleeve_Top_with_Champagne_Satin_Maxi_Skirt.jpg"
    ],
    description: "Ultimate wardrobe foundation for effortless relaxed living. Premium matching silk sleepwear designed to provide comfort without compromising on elegance.",
    material: "100% Washable Silk.",
    careInstructions: "Hand wash or gentle machine wash.",
    collection: "Soft White Minimalism"
  },
  {
    id: "p10",
    name: "Draped Asymmetric Blouse",
    brand: "SN24 Atelier",
    price: 195,
    category: "Evening & Occasion",
    type: "Tops & Blouses",
    colors: ["#C9A96E", "#16202C"],
    sizes: ["S", "M", "L"],
    images: [
      "/uploads/1786653893542-16306.jpg",
      "/uploads/1786653893548-16953.jpg"
    ],
    isBestseller: true,
    description: "For moments that require a lasting impression. This statement piece is crafted from luxurious, flowing fabrics that drape beautifully, offering sophisticated depth.",
    material: "100% Viscose Georgette.",
    careInstructions: "Dry clean only.",
    collection: "The Midnight Navy Edit"
  }
];

async function main() {
  console.log('Start seeding ...')
  // Clear existing data
  await prisma.product.deleteMany({})

  for (const p of mockProducts) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice || null,
        category: p.category,
        type: p.type || null,
        colors: p.colors.join(','),
        sizes: p.sizes.join(','),
        images: p.images.join(','),
        isNew: p.isNew || false,
        isBestseller: p.isBestseller || false,
        description: p.description,
        material: p.material,
        careInstructions: p.careInstructions,
        collection: p.collection
      },
    })
    console.log(`Created product with id: ${product.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
