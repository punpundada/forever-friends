import { z } from "zod";

export const AdoptionStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
