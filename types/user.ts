import { z } from "zod";
import emailSchema from "./emailSchema";

export const UserSchema = z.object({
    id:z.string({required_error:"Id is required"}).trim().min(1,"Id is required"),
    name:z.string({required_error:"Name is required"}).trim().min(3,"Name must be more than 3 char"),
    email:emailSchema,
    password:z.string({required_error:"Password is required"}).trim().min(6,"Password must be more than 6 char"),
    email_verified:z.boolean().default(false),
})

export type UserType = z.infer<typeof UserSchema>