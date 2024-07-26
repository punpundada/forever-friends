import z from "zod";
import emailSchema from "./emailSchema";

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, "Password must be 6 or more characters"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const SignupSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, "Name must be more than 3 char"),
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, "Password must be more than 6 char"),
});

export type SignupType = z.infer<typeof SignupSchema>