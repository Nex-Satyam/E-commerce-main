import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nex.com" },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: "admin@nex.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created or updated:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());