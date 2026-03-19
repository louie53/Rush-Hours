import { Router, Request, Response } from 'express';
import StudySession from '../models/StudySession';
import Building from '../models/Building';

const router = Router();

// GET all active sessions for a specific building
router.get('/building/:identifier', async (req: Request, res: Response): Promise<any> => {
    try {
        const { identifier } = req.params;
        let buildingId = identifier;

        // Map frontend hardcoded IDs to actual Building Names in DB
        if (identifier === 'science-bldg' || identifier === 'library') {
            const nameMap: { [key: string]: string } = {
                'science-bldg': 'Science Building',
                'library': 'Library'
            };
            const building = await Building.findOne({ name: nameMap[identifier] });
            if (!building) {
                return res.status(404).json({ message: 'Building not found in DB' });
            }
            buildingId = building._id.toString();
        }

        const sessions = await StudySession.find({ buildingId })
            .sort({ createdAt: -1 }); // Newest first
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Server error fetching sessions' });
    }
});

// POST create a new session
router.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { buildingId: identifier, title, description, creatorName, capacity } = req.body;
        
        if (!identifier || !title || !creatorName || !capacity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let buildingId = identifier;
        if (identifier === 'science-bldg' || identifier === 'library') {
            const nameMap: { [key: string]: string } = {
                'science-bldg': 'Science Building',
                'library': 'Library'
            };
            const building = await Building.findOne({ name: nameMap[identifier] });
            if (!building) {
                return res.status(404).json({ message: 'Building not found in DB' });
            }
            buildingId = building._id.toString();
        }

        // The creator is automatically the first participant
        const newSession = await StudySession.create({
            buildingId,
            title,
            description,
            creatorName,
            capacity,
            participants: [creatorName],
            status: 'active',
        });

        res.status(201).json(newSession);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Server error creating session' });
    }
});

// POST join a session
router.post('/:sessionId/join', async (req: Request, res: Response): Promise<any> => {
    try {
        const { sessionId } = req.params;
        const { participantName } = req.body;

        if (!participantName) {
            return res.status(400).json({ message: 'Participant name is required' });
        }

        const session = await StudySession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status === 'closed') {
            return res.status(400).json({ message: 'Session is closed' });
        }

        if (session.participants.length >= session.capacity) {
            return res.status(400).json({ message: 'Session is already full' });
        }

        if (session.participants.includes(participantName)) {
            return res.status(400).json({ message: 'You have already joined this session' });
        }

        session.participants.push(participantName);
        await session.save();

        res.json(session);
    } catch (error) {
        console.error('Error joining session:', error);
        res.status(500).json({ message: 'Server error joining session' });
    }
});

export default router;
