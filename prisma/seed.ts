import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.document.deleteMany();
  console.log('🗑️  Cleared existing documents');

  // Subjects for documents
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Art',
    'Music'
  ];

  // Phases for education
  const phases = ['Elementary', 'Middle School', 'High School', 'University'];

  // Academic years
  const academicYears = ['2023/2024', '2024/2025', '2022/2023', '2021/2022'];

  // Create sample documents
  const documents = [];
  for (let i = 1; i <= 20; i++) {
    const document = {
      subject: faker.helpers.arrayElement(subjects),
      teacherName: faker.person.fullName(),
      phase: faker.helpers.arrayElement(phases),
      academicYear: faker.helpers.arrayElement(academicYears),
      attachmentUrl: `https://example.com/documents/document-${i}.pdf`
    };
    documents.push(document);
  }

  // Insert documents
  await prisma.document.createMany({
    data: documents
  });

  console.log(`✅ Created ${documents.length} sample documents`);
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
