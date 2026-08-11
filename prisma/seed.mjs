import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const demo = await prisma.user.upsert({
    where: { username: "baanbhaba" },
    update: { passwordHash: hashPassword("baanbhaba") },
    create: {
      username: "baanbhaba",
      email: "baanbhaba@alchemi.dev",
      passwordHash: hashPassword("baanbhaba"),
      role: "developer",
    },
  });
  console.log(`Seeded demo user: ${demo.username} (${demo.id})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
