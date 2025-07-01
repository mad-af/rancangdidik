import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.product.deleteMany();
  console.log('🗑️  Cleared existing products');

  // Categories for products
  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Toys',
    'Groceries',
    'Books',
    'Jewelry',
    'Beauty Products'
  ];

  // Create sample products
  const products = [];
  for (let i = 1; i <= 20; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      category: faker.helpers.arrayElement(categories),
      photo_url: `https://api.slingacademy.com/public/sample-products/${i}.png`
    };
    products.push(product);
  }

  // Insert products
  await prisma.product.createMany({
    data: products
  });

  console.log(`✅ Created ${products.length} sample products`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
