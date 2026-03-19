import { Request, Response } from 'express';
import { sessionService } from '../services/sessionService';

export const sessionController = {
  getSessions: async (req: Request, res: Response) => {
    try {
      const identifier = req.params.identifier as string;
      const buildingId = await sessionService.getBuildingIdByIdentifier(identifier);
      const sessions = await sessionService.getSessionsByBuilding(buildingId);
      res.json(sessions);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  createSession: async (req: Request, res: Response) => {
    try {
      const newSession = await sessionService.createSession(req.body);
      res.status(201).json(newSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  joinSession: async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const { userName } = req.body;
      const updatedSession = await sessionService.joinSession(sessionId, userName);
      res.json(updatedSession);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};
