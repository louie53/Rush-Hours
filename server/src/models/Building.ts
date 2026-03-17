import mongoose, { Schema, Document } from 'mongoose';

export interface IBuilding extends Document {
  campusId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  // GeoJSON location for geofencing
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  // Custom cartoon asset URL
  iconUrl?: string; 
  totalClassrooms: number;
}

const BuildingSchema: Schema = new Schema(
  {
    campusId: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Building name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    iconUrl: {
      type: String, // e.g., 'https://your-cdn.com/buildings/science-building.png'
    },
    totalClassrooms: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Crucial: 2dsphere index for location-based finding
BuildingSchema.index({ location: '2dsphere' });

export default mongoose.model<IBuilding>('Building', BuildingSchema);
