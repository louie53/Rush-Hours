import StudySession, { IStudySession } from '../models/StudySession';
import Building from '../models/Building';

export const sessionService = {
  getBuildingIdByIdentifier: async (identifier: string): Promise<string> => {
    if (identifier === 'science-bldg' || identifier === 'library') {
      const nameMap: { [key: string]: string } = {
        'science-bldg': 'Science Building',
        'library': 'Library'
      };
      const building = await Building.findOne({ name: nameMap[identifier] });
      if (!building) throw new Error('Building not found');
      return building._id.toString();
    }
    return identifier;
  },

  getSessionsByBuilding: async (buildingId: string): Promise<IStudySession[]> => {
    return StudySession.find({ buildingId }).sort({ createdAt: -1 });
  },

  createSession: async (data: any): Promise<IStudySession> => {
    const { buildingIdentifier, title, description, creatorName, capacity } = data;
    const buildingId = await sessionService.getBuildingIdByIdentifier(buildingIdentifier);

    return StudySession.create({
      buildingId,
      title,
      description,
      creatorName,
      capacity,
      participants: [creatorName],
      status: 'active',
    });
  },

  joinSession: async (sessionId: string, participantName: string): Promise<IStudySession> => {
    const session = await StudySession.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status === 'closed') throw new Error('Session is closed');
    if (session.participants.length >= session.capacity) throw new Error('Session is full');
    if (session.participants.includes(participantName)) throw new Error('Already joined');

    session.participants.push(participantName);
    return session.save();
  }
};
