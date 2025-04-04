import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.ts",
    dbCredentials: {
        url: "postgresql://expense-db_owner:d9jBp1JXLbgG@ep-damp-flower-a5uypc1v.us-east-2.aws.neon.tech/expense-db?sslmode=require",
    },
    tablesFilter: ["*"],
});
