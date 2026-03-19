import type { CreateSessionDTO, StudySession } from '../types/StudySession';
import apiClient from './apiClient';


export const sessionService = {
  fetchSessionsByBuilding: async (buildingId: string): Promise<StudySession[]> => {
    const response = await apiClient.get<StudySession[]>(`/sessions/building/${buildingId}`);
    return response.data;
  },

  createSession: async (data: CreateSessionDTO): Promise<StudySession> => {
    const response = await apiClient.post<StudySession>('/sessions', data);
    return response.data;
  },

  joinSession: async (sessionId: string, userName: string): Promise<StudySession> => {
    // Axios takes (url, data, config)
    const response = await apiClient.post<StudySession>(`/sessions/${sessionId}/join`, { userName });
    return response.data;
  }
};
