import { prisma } from "../lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, name: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  console.log("Product slugs in database:");
  for (const p of products) {
    console.log(`- ${p.slug} (${p.isActive ? "active" : "inactive"}) - ${p.name}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
