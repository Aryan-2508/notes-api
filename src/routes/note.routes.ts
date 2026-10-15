import { Router } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";

import { validate } from "../middleware/validate.middleware";

import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
  paginationSchema,
} from "../validators/note.schema";

const router = Router();

router.get(
  "/",
  validate(paginationSchema, "query"),
  getAllNotes
);

router.get(
  "/:id",
  validate(noteIdSchema, "params"),
  getNoteById
);

router.post(
  "/",
  validate(createNoteSchema, "body"),
  createNote
);

router.put(
  "/:id",
  validate(noteIdSchema, "params"),
  validate(updateNoteSchema, "body"),
  updateNote
);

router.delete(
  "/:id",
  validate(noteIdSchema, "params"),
  deleteNote
);

export default router;