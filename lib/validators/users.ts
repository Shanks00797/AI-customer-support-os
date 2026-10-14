
import { z } from "zod";

export const createAgentSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254).transform((value) =>
      value.toLowerCase()
    ),
    password: z.string().min(12).max(128),
  })
  .strict();
