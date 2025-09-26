import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create a vendor user
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      passwordHash: hashedPassword,
      userType: UserType.vendor,
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Smith Enterprises',
      phone: '+1234567890',
      isVerified: true,
      isActive: true,
    },
  });

  // Create a distributor user
  const distributorUser = await prisma.user.upsert({
    where: { email: 'distributor@example.com' },
    update: {},
    create: {
      email: 'distributor@example.com',
      passwordHash: hashedPassword,
      userType: UserType.distributor,
      firstName: 'Jane',
      lastName: 'Doe',
      companyName: 'Doe Distribution',
      phone: '+0987654321',
      isVerified: true,
      isActive: true,
    },
  });

  // Create vendor profile
  await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      companyDescription: 'Leading provider of innovative products',
      businessLicense: 'BL123456789',
      taxId: 'TAX987654321',
      address: '123 Business Ave, City, State 12345',
      website: 'https://smithenterprises.com',
      verificationStatus: 'verified',
    },
  });

  // Create distributor profile
  await prisma.distributor.upsert({
    where: { userId: distributorUser.id },
    update: {},
    create: {
      userId: distributorUser.id,
      experienceYears: 5,
      coverageAreas: 'North America, Europe',
      distributionChannels: 'Online, Retail, Wholesale',
      portfolioSize: 50,
      verificationStatus: 'verified',
      onboardingStatus: 'completed',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Test credentials:');
  console.log('Vendor: vendor@example.com / password123');
  console.log('Distributor: distributor@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
