import z, { ZodError } from "zod";

const envarSchema = z.object({
  DATABASE_URL: z.string({ required_error: "DATABASE_URL is missing" }),
  NODE_ENV: z.enum(["production", "development"], {
    invalid_type_error: "NODE_ENV must be either production or development",
    required_error: "NODE_ENV is missing",
  }),
  MONGO_INITDB_ROOT_PASSWORD: z.string({
    required_error: "MONGO_INITDB_ROOT_PASSWORD is missing",
  }),
  MONGO_INITDB_ROOT_USERNAME: z.string({ required_error: "MONGO_INITDB_ROOT_USERNAME is missing" }),
  MONGO_INITDB_DATABASE: z.string({ required_error: "MONGO_INITDB_DATABASE is missing" }),
  SMTP_HOST: z.string({ required_error: "SMTP_HOST is required" }),
  SMTP_PORT: z.coerce.number({ required_error: "SMTP_PORT is required" }),
  SMTP_USER: z.string({
    required_error: "SMTP_USER is required",
  }),
  SMTP_PASS: z.string({ required_error: "SMTP_PASS is required" }),
  EMAIL_FROM:z.string({required_error:"EMAIL_FROM is required"}),
  SUPER_ADMIN_EMAIL:z.string({required_error:"SUPER_ADMIN_EMAIL is required"}),
  SUPER_ADMIN_PASSWORD:z.string({required_error:"SUPER_ADMIN_PASSWORD is required"}),
  BASE_URL:z.string({required_error:"BASE_URL is required"})
});

try {
  envarSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error(error.issues);
    process.exit(1);
  }
}

export default envarSchema.parse(process.env);
