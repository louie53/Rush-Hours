import mongoose, { Schema, Document } from 'mongoose';

// Interface defining the Campus structure
export interface ICampus extends Document {
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  isActive: boolean;
}

// Mongoose Schema for Campus
const CampusSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Campus name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // Required GeoJSON format for MongoDB geospatial queries
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Create a geospatial index on the location field
// This is crucial for $near or $geoWithin queries later
CampusSchema.index({ location: '2dsphere' });

export default mongoose.model<ICampus>('Campus', CampusSchema);
