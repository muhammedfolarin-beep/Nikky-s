import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Starting image migration...");
  
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;

    let needsUpdate = false;
    const newImages = [];

    for (const image of product.images) {
      // If it's a local upload path, we need to migrate it
      if (image.startsWith('/uploads/')) {
        const filename = image.replace('/uploads/', '');
        const localPath = path.join(process.cwd(), 'public', 'uploads', filename);

        if (fs.existsSync(localPath)) {
          console.log(`Uploading ${filename} for product ${product.name}...`);
          
          const fileBuffer = fs.readFileSync(localPath);
          
          const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filename, fileBuffer, {
              contentType: 'image/jpeg', // Defaulting, mostly fine for browsers
              upsert: true,
            });

          if (error) {
            console.error(`Error uploading ${filename}:`, error.message);
            newImages.push(image); // keep old one on failure
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('uploads')
              .getPublicUrl(filename);
            
            newImages.push(publicUrl);
            needsUpdate = true;
            console.log(`Successfully migrated to: ${publicUrl}`);
          }
        } else {
          console.log(`Local file not found for ${image}, skipping...`);
          newImages.push(image);
        }
      } else {
        // It's already a full URL or something else
        newImages.push(image);
      }
    }

    if (needsUpdate) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      });
      updatedCount++;
      console.log(`Updated database for product: ${product.name}`);
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
