import { useState, useEffect, useCallback } from 'react';
import { sessionService } from '../services/sessionService';
import type { StudySession } from '../types/StudySession';

export const useSessions = (buildingId: string | undefined) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!buildingId) return;
    try {
      setLoading(true);
      const data = await sessionService.fetchSessionsByBuilding(buildingId);
      setSessions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return { sessions, loading, error, refreshSessions: loadSessions };
};
