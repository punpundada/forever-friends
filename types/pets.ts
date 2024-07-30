import z from "zod";

export const petInsertSchema = z.object({
  name: z.string().min(1, "Please enter name"),
  age: z.number({ required_error: "Please enter age" }).int().nonnegative(),
  breed: z.string().min(1, "Please enter Breed"),
  description: z.string().min(1, "Please enter description of pet"),
  imageUrl: z.array(z.string().url({ message: "Invalid url" })),
  location: z.string().min(1, "Please enter location"),
  available: z.boolean().default(true),
  adoptionCenterId: z
    .number({ required_error: "Please enter adoption" })
    .int()
    .nonnegative(),
  userId: z.string().optional(),
  assignedTo:z.string({required_error:"Please select employee to assign"}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const petSelectSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Please enter name"),
  age: z.number({ required_error: "Please enter age" }).int().nonnegative(),
  breed: z.string().min(1, "Please enter Breed"),
  description: z.string().min(1, "Please enter description of pet"),
  imageUrl: z.array(z.string().url({ message: "Invalid url" })),
  location: z.string().min(1, "Please enter location"),
  available: z.boolean().default(true),
  adoptionCenterId: z
    .number({ required_error: "Please enter adoption" })
    .int()
    .nonnegative(),
  userId: z.string().optional().nullable(),
  assignedTo:z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PetInsertType = z.infer<typeof petInsertSchema>;
export type PetSelectType = z.infer<typeof petSelectSchema>;
