import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campus from './models/Campus';
import Building from './models/Building';
import StudySession from './models/StudySession';

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
            StudySession.deleteMany({}),
        ]);

        // 2. Create the Main Campus (assuming University of Auckland location)
        console.log('Creating Campus...');
        const mainCampus = await Campus.create({
            name: 'Main Campus',
            description: 'The central university campus',
            location: {
                type: 'Point',
                coordinates: [174.7685, -36.8520], // Center of campus
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
                    coordinates: [174.768460, -36.853192], 
                },
                totalClassrooms: 32,
            }),
            Building.create({
                campusId: mainCampus._id,
                name: 'Library',
                description: 'Main General Library',
                location: {
                    type: 'Point',
                    coordinates: [174.769328, -36.851185],
                },
                totalClassrooms: 15,
            }),
        ]);

        // 4. Create Active Study Sessions (Lobbies) for these buildings
        console.log('Creating Active Study Sessions...');
        await Promise.all([
             // Science Building sessions
            StudySession.create({
                buildingId: scienceBuilding._id,
                title: 'COMPSCI 101 Assignment 2 Help',
                description: 'Stuck on the loops part, anyone want to figure it out together?',
                creatorName: 'AlexChen',
                capacity: 4,
                participants: ['AlexChen', 'SarahJ'],
                status: 'active',
            }),
            StudySession.create({
                buildingId: scienceBuilding._id,
                title: 'Data Science Study Group',
                description: 'Reviewing for midterms. Quiet study mostly.',
                creatorName: 'DataNerd',
                capacity: 6,
                participants: ['DataNerd'],
                status: 'active',
            }),
             // Library sessions
            StudySession.create({
                buildingId: library._id,
                title: 'Law Reading marathon 📚',
                description: 'No chatting, just pure focus. 2 hours pomodoro.',
                creatorName: 'FutureLawyer',
                capacity: 10,
                participants: ['FutureLawyer', 'Mike', 'Emma'],
                status: 'active',
            }),
             StudySession.create({
                buildingId: library._id,
                title: 'Physics 101 Group Project',
                description: 'Group 4 meeting here.',
                creatorName: 'PhysicsGuy',
                capacity: 5,
                participants: ['PhysicsGuy', 'Alice', 'Bob', 'Charlie', 'Dave'],
                status: 'active', // full capacity
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
