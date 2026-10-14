import { Note } from "../models/note.model";

export class NoteRepository {
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      Note.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Note.countDocuments(),
    ]);

    return {
      notes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return Note.findById(id).lean();
  }

  async create(data: { title: string; content?: string }) {
    const note = await Note.create(data);
    return note;
  }

  async update(
    id: string,
    data: { title?: string; content?: string }
  ) {
    return Note.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Note.findByIdAndDelete(id);
  }
}

export const noteRepository = new NoteRepository();