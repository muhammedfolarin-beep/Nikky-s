export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  type?: string | null;
  colors: string[];
  sizes: string[];
  images: string[];
  isNew?: boolean | null;
  isBestseller?: boolean | null;
  description?: string | null;
  material?: string | null;
  careInstructions?: string | null;
  collection?: string | null;
};

const defaultDetails = {
  description: "Experience the epitome of luxury with our meticulously crafted pieces. Designed to provide both comfort and style, this garment features a modern silhouette that seamlessly transitions from day to night. Each piece is constructed with premium materials to ensure longevity and timeless appeal in your wardrobe.",
  material: "Premium composition featuring 80% sustainable fibers. Lined with breathable cupro for ultimate comfort against the skin.",
  careInstructions: "Dry clean only. Cool iron if necessary. Do not bleach or tumble dry. Store on a contoured hanger to preserve shape."
};

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Structured Midi Shirt Dress",
    brand: "Nikky's Reserve",
    price: 345,
    category: "The Office Edit",
    type: "Dresses",
    colors: ["#16202C", "#FCFCFC", "#E4E7EB"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop"
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
    brand: "Studio N",
    price: 285,
    category: "Evening & Occasion",
    type: "Dresses",
    colors: ["#16202C"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1515347619362-747da441229a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=600&auto=format&fit=crop"
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
    brand: "Nikky's Essentials",
    price: 195,
    category: "The Resort Collection",
    type: "Bottoms",
    colors: ["#FCFCFC", "#E4E7EB"],
    sizes: ["24", "26", "28", "30", "32"],
    images: [
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e65329e324?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Breathable luxury and clean, uninterrupted lines. These high-waisted wide-leg trousers are crafted from crisp linens in calming neutral tones, perfect for relaxed sunny afternoons.",
    material: "100% Premium Organic Linen.",
    careInstructions: "Cold hand wash or dry clean.",
    collection: "Soft White Minimalism"
  },
  {
    id: "p4",
    name: "Classic Double-Breasted Trench Coat",
    brand: "Nikky's Reserve",
    price: 450,
    originalPrice: 520,
    category: "Outerwear & Layering",
    type: "Outerwear",
    colors: ["#C9A96E", "#16202C"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop"
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
    brand: "Nikky's Essentials",
    price: 220,
    category: "Everyday Essentials",
    type: "Knitwear",
    colors: ["#16202C", "#4A5565"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The foundation of a premium wardrobe. Designed for elevated, effortless daily living, this fine-knit turtleneck offers warmth and unmatched softness.",
    material: "70% Merino Wool, 30% Cashmere.",
    careInstructions: "Hand wash cold, dry flat.",
    collection: "The Midnight Navy Edit"
  },
  {
    id: "p6",
    name: "Crisp Silk Camisole",
    brand: "Studio N",
    price: 135,
    category: "The Office Edit",
    type: "Tops & Blouses",
    colors: ["#FCFCFC"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=600&auto=format&fit=crop"
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
    brand: "Nikky's Essentials",
    price: 185,
    category: "Everyday Essentials",
    type: "Denim",
    colors: ["#B8C8D6"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop"
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
    brand: "Nikky's Reserve",
    price: 310,
    category: "The Office Edit",
    type: "Outerwear",
    colors: ["#16202C"],
    sizes: ["36", "38", "40", "42"],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=600&auto=format&fit=crop"
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
    brand: "Studio N",
    price: 245,
    originalPrice: 280,
    category: "Everyday Essentials",
    type: "Loungewear & Intimates",
    colors: ["#FCFCFC", "#16202C"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1583391733975-685b8823528b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15070f14022?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Ultimate wardrobe foundation for effortless relaxed living. Premium matching silk sleepwear designed to provide comfort without compromising on elegance.",
    material: "100% Washable Silk.",
    careInstructions: "Hand wash or gentle machine wash.",
    collection: "Soft White Minimalism"
  },
  {
    id: "p10",
    name: "Draped Asymmetric Blouse",
    brand: "Nikky's Atelier",
    price: 195,
    category: "Evening & Occasion",
    type: "Tops & Blouses",
    colors: ["#C9A96E", "#16202C"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485230895905-ef10cefaec8e?q=80&w=600&auto=format&fit=crop"
    ],
    isBestseller: true,
    description: "For moments that require a lasting impression. This statement piece is crafted from luxurious, flowing fabrics that drape beautifully, offering sophisticated depth.",
    material: "100% Viscose Georgette.",
    careInstructions: "Dry clean only.",
    collection: "The Midnight Navy Edit"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};
