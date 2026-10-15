import { z } from "zod";

// Validate the request body when creating a note
export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  content: z
    .string()
    .optional(),
}).strict();

// Validate the request body when updating a note
export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .optional(),

    content: z
      .string()
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined,
    {
      message: "At least one field is required to update",
    }
  );

// Validate note IDs in route parameters
export const noteIdSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid note ID"),
}).strict();

// Validate pagination query parameters
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
}).strict();