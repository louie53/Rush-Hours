import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campus from './models/Campus';
import Building from './models/Building';
import StudyRoom from './models/StudyRoom';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is undefined');
        }
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB.');

        // 1. Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            Campus.deleteMany({}),
            Building.deleteMany({}),
            StudyRoom.deleteMany({}),
        ]);

        // 2. Create the Main Campus (assuming University of Auckland location)
        console.log('Creating Campus...');
        const mainCampus = await Campus.create({
            name: 'Main Campus',
            description: 'The central university campus',
            location: {
                type: 'Point',
                coordinates: [174.7681, -36.8523], // Center of campus
            },
        });

        // 3. Create Buildings with GeoJSON locations
        console.log('Creating Buildings...');
        const [scienceBuilding, library] = await Promise.all([
            Building.create({
                campusId: mainCampus._id,
                name: 'Science Building',
                description: 'Faculty of Science',
                location: {
                    type: 'Point',
                    coordinates: [174.7670, -36.8510], // Slightly offset from center
                },
                totalClassrooms: 32,
            }),
            Building.create({
                campusId: mainCampus._id,
                name: 'Library',
                description: 'Main General Library',
                location: {
                    type: 'Point',
                    coordinates: [174.7690, -36.8530], // Slightly offset from center
                },
                totalClassrooms: 15,
            }),
        ]);

        // 4. Create Study Rooms for these buildings
        console.log('Creating Study Rooms...');
        await Promise.all([
             // Science Building rooms
            StudyRoom.create({
                buildingId: scienceBuilding._id,
                name: 'Lab 101',
                capacity: 40,
                currentOccupancy: 12,
                features: ['whiteboard', 'computers'],
            }),
            StudyRoom.create({
                buildingId: scienceBuilding._id,
                name: 'Lecture Theatre A',
                capacity: 150,
                currentOccupancy: 0,
                features: ['projector'],
            }),
             // Library rooms
            StudyRoom.create({
                buildingId: library._id,
                name: 'Quiet Reading Room',
                capacity: 100,
                currentOccupancy: 45,
                features: ['silent-zone', 'power-outlets'],
            }),
             StudyRoom.create({
                buildingId: library._id,
                name: 'Group Discussion Room 1',
                capacity: 8,
                currentOccupancy: 8,
                isAvailable: false,
                features: ['whiteboard', 'tv'],
            }),
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
