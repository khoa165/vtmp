import mongoose, { ObtainDocumentType } from 'mongoose';

const TodoItem = {
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  points: { type: Number, required: true, default: 1 },
};

export type TodoItemDocument = ObtainDocumentType<typeof TodoItem>;

const TodoItemSchema = new mongoose.Schema(TodoItem, { timestamps: true });

export default mongoose.model('TodoItem', TodoItemSchema);
