import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  buildingId: mongoose.Types.ObjectId;
  title: string;          // e.g., 'COMP101 Study Group', 'Quiet reading'
  description?: string;   // e.g., 'Working on Assignment 3, join if you need help'
  creatorName: string;    // Name of the student who created it (simplification for MVP before Auth)
  capacity: number;       // Max people
  participants: string[]; // List of participant names
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema: Schema = new Schema(
  {
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    creatorName: {
      type: String,
      required: true,
      default: 'Anonymous Student',
    },
    capacity: {
      type: Number,
      required: true,
      default: 4,
      min: 2,
      max: 50,
    },
    participants: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudySession>('StudySession', StudySessionSchema);
