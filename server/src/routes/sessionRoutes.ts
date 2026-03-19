import { Router } from 'express';
import { sessionController } from '../controllers/sessionController';

const router = Router();

router.get('/building/:identifier', sessionController.getSessions);
router.post('/', sessionController.createSession);
router.post('/:sessionId/join', sessionController.joinSession);

export default router;
