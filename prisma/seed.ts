import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin creation: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in .env");
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, email: true, role: true },
  });

  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email} (${existingAdmin.role})`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
    select: { id: true, email: true, role: true },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
