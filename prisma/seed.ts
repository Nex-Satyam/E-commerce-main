import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
<<<<<<< HEAD
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nex.com" },
=======
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin creation: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in .env");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
>>>>>>> origin/main
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
<<<<<<< HEAD
    },
    create: {
      name: "Admin",
      email: "admin@nex.com",
      password: hashedPassword,
      role: "ADMIN",
=======
      // isSuperAdmin: true,
    },
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      // isSuperAdmin: true,
>>>>>>> origin/main
    },
  });

  console.log("Admin created or updated:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());