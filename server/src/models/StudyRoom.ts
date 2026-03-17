import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyRoom extends Document {
  buildingId: mongoose.Types.ObjectId;
  name: string; // e.g., 'Room 101', 'Quiet Zone A'
  capacity: number;
  currentOccupancy: number; // Real-time tracked users inside
  isAvailable: boolean;
  // In a real precise geofencing scenario, rooms could have their own precise coordinates
  // Or simply rely on the Building's location for geofencing check
  features?: string[]; // e.g., ['whiteboard', 'projector', 'power-outlets']
}

const StudyRoomSchema: Schema = new Schema(
  {
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      default: 30, // Default capacity
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    features: [String],
  },
  {
    timestamps: true,
  }
);

// Prevent currentOccupancy from exceeding capacity (application-level logic mostly, but good mental note)
export default mongoose.model<IStudyRoom>('StudyRoom', StudyRoomSchema);
