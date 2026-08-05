import { defineConfig } from "@prisma/config";

const dbUrl = "postgresql://neondb_owner:npg_qgopfAHn83rO@ep-curly-paper-ayvb99ue-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || dbUrl,
  },
});
