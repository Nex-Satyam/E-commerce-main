import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:"postgresql://postgres:1234@localhost:5432/Ecommerce_app", 
  },
});