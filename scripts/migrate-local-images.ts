import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of products) {
    let changed = false;
    const newImages = product.images.map((img) => {
      if (img.includes("supabase.co/storage/v1/object/public/uploads/")) {
        const filename = img.split("/").pop();
        changed = true;
        return `/uploads/${filename}`;
      }
      return img;
    });

    if (changed) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages },
      });
      console.log(`Updated product "${product.name}" images:`, newImages);
      updatedCount++;
    }
  }

  console.log(`Finished migrating ${updatedCount} products to local /uploads/ URLs.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
