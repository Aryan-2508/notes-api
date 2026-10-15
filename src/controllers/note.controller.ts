import type { Request, Response, NextFunction } from "express";
import { noteService } from "../services/note.service";

export async function getAllNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = res.locals.validated.query;

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
    const { id } = res.locals.validated.params;

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
    const { title, content } = res.locals.validated.body;

    const note = await noteService.createNote({
      title,
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
    const { id } = res.locals.validated.params;
    const { title, content } = res.locals.validated.body;

    const updateData: {
      title?: string;
      content?: string;
    } = {};

    if (title !== undefined) {
      updateData.title = title;
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
    const { id } = res.locals.validated.params;

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