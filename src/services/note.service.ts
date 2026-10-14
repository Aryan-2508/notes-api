import { noteRepository } from "../repositories/note.repository";

export class NoteService {
  async getAllNotes(page: number, limit: number) {
    return noteRepository.findAll(page, limit);
  }

  async getNoteById(id: string) {
    const note = await noteRepository.findById(id);

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  }

  async createNote(data: { title: string; content?: string }) {
    return noteRepository.create(data);
  }

  async updateNote(
    id: string,
    data: { title?: string; content?: string }
  ) {
    const note = await noteRepository.update(id, data);

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  }

  async deleteNote(id: string) {
    const note = await noteRepository.delete(id);

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  }
}

export const noteService = new NoteService();