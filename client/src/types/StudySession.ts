export interface StudySession {
  _id: string;
  buildingIdentifier: string;
  title: string;
  description?: string;
  creatorName: string;
  capacity: number;
  participants: string[];
  status: 'open' | 'closed';
  createdAt: string;
}

export interface CreateSessionDTO {
  buildingIdentifier: string;
  title: string;
  description?: string;
  creatorName: string;
  capacity: number;
}
