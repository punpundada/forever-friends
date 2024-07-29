import { z } from "zod";

export const AdoptionStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export const adoptionCenterInertSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1, "Name is required"),
    landmark: z.string().optional(),
    pincode: z.coerce.number({required_error:"please enter pincode",invalid_type_error:"Pincode must be a number"}).int().max(999999, "Invalid pincode"),
    street: z.string().min(1, "Street is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be a 10-digit number"),
    email: z.string().email("Invalid email address"),
  });

export const adoptionCenterSelectSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1, "Name is required"),
    landmark: z.string().optional(),
    pincode: z.number().int().max(999999, "Invalid pincode"),
    street: z.string().min(1, "Street is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be a 10-digit number"),
    email: z.string().email("Invalid email address"),
  });

  export type AdoptionCenterInsert = z.infer<typeof adoptionCenterInertSchema>
  
  export type AdoptionCenterSelect = z.infer<typeof adoptionCenterSelectSchema>