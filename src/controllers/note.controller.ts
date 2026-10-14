import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { noteService } from "../services/note.service";

export async function getAllNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);

    const result = await noteService.getAllNotes(page, limit);

    res.status(200).json({
      success: true,
      data: result.notes,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        success: false,
        error: { message: "Invalid resource ID" },
      });
      return;
    }

    const note = await noteService.getNoteById(id);

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      res.status(404).json({
        success: false,
        error: { message: "Note not found" },
      });
      return;
    }

    next(error);
  }
}

export async function createNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, content } = req.body ?? {};

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: [
            {
              field: "title",
              message: "Title is required",
            },
          ],
        },
      });
      return;
    }

    if (content !== undefined && typeof content !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: [
            {
              field: "content",
              message: "Content must be a string",
            },
          ],
        },
      });
      return;
    }

    const note = await noteService.createNote({
      title: title.trim(),
      content,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { title, content } = req.body ?? {};

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        success: false,
        error: { message: "Invalid resource ID" },
      });
      return;
    }

    if (title === undefined && content === undefined) {
      res.status(400).json({
        success: false,
        error: {
          message: "At least one field must be provided",
        },
      });
      return;
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: [
            {
              field: "title",
              message: "Title must be a non-empty string",
            },
          ],
        },
      });
      return;
    }

    if (content !== undefined && typeof content !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: [
            {
              field: "content",
              message: "Content must be a string",
            },
          ],
        },
      });
      return;
    }

    const updateData: {
      title?: string;
      content?: string;
    } = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    const note = await noteService.updateNote(id, updateData);

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      res.status(404).json({
        success: false,
        error: { message: "Note not found" },
      });
      return;
    }

    next(error);
  }
}

export async function deleteNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id)
    ) {
      res.status(400).json({
        success: false,
        error: { message: "Invalid resource ID" },
      });
      return;
    }

    await noteService.deleteNote(id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      res.status(404).json({
        success: false,
        error: { message: "Note not found" },
      });
      return;
    }

    next(error);
  }
}