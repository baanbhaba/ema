import { defineConfig } from "@prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_qgopfAHn83rO@ep-curly-paper-ayvb99ue-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  earlyAccess: true,
  datasource: {
    url: dbUrl,
    adapter: () => {
      const pool = new Pool({ connectionString: dbUrl });
      return new PrismaPg(pool);
    },
  },
});
