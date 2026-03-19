import { useState } from 'react';
import { sessionService } from '../services/sessionService';
import type { StudySession, CreateSessionDTO } from '../types/StudySession';

export const useCreateSession = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (formData: CreateSessionDTO) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newSession = await sessionService.createSession(formData);
      return newSession;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const joinSession = async (sessionId: string, userName: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedSession = await sessionService.joinSession(sessionId, userName);
      return updatedSession;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createSession, joinSession, isSubmitting, error };
};
