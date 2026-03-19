import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('[database error]: MONGODB_URI is not defined in .env file');
            process.exit(1);
        }
        
        const conn = await mongoose.connect(mongoURI);
        console.log(`[database]: MongoDB connected successfully to ${conn.connection.host}`);
    } catch (error) {
        console.error(`[database error]: MongoDB connection failed - ${error}`);
        process.exit(1);
    }
};

// Start database connection
connectDB();

import sessionRoutes from './routes/sessionRoutes';

// Routes
app.use('/api/sessions', sessionRoutes);

app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'Hello from MERN backend! MongoDB connection is configured.' });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
