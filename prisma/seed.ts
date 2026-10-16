import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.earning.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      id: "admin-1",
      name: "DLV Admin",
      email: "admin@dlvdispatch.com",
      phone: "08011111111",
      password: "admin123",
      role: "ADMIN",
    },
  });

  // Create Riders
  const rider1 = await prisma.user.create({
    data: {
      id: "rider-1",
      name: "Chinedu Okoro",
      phone: "08022222222",
      password: "rider123",
      role: "RIDER",
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "Chinedu Okoro",
    },
  });

  const rider2 = await prisma.user.create({
    data: {
      id: "rider-2",
      name: "Amaka Eze",
      phone: "08033333333",
      password: "rider123",
      role: "RIDER",
      bankName: "Access Bank",
      accountNumber: "9876543210",
      accountName: "Amaka Eze",
    },
  });

  // Create Customer
  const customer = await prisma.user.create({
    data: {
      id: "customer-1",
      name: "Etiosa Joseph",
      phone: "08044444444",
      password: "customer123",
      role: "CUSTOMER",
    },
  });

  // Create sample order
  await prisma.order.create({
    data: {
      trackingCode: "DLV-241015-A7K9",
      status: "PENDING",
      paymentMethod: "CASH",
      paymentStatus: "PENDING",
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      pickupAddress: "Effurun Market, Warri",
      pickupLandmark: "Near First Bank",
      dropoffAddress: "PTI Road, Effurun",
      dropoffLandmark: "Beside NNPC Housing",
      packageDescription: "Documents and small parcel",
      packageSize: "Small",
      deliveryFee: 2500,
      platformFee: 450,
      riderEarning: 2050,
    },
  });

  console.log("Seed completed successfully!");
  console.log("Demo accounts:");
  console.log("  Admin:    08011111111 / admin123");
  console.log("  Rider:    08022222222 / rider123");
  console.log("  Customer: 08044444444 / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
