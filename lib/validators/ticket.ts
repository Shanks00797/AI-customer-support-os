
import { z } from "zod";

export const createTicketSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100),
    customerEmail: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    subject: z.string().trim().min(3).max(200),
    message: z.string().trim().min(1).max(10000),
  })
  .strict();

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
