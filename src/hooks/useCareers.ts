import { useState, useEffect } from 'react';
import { Career, initializeCareers, careersMockBase } from '@/lib/careers.service';

export function useCareers() {
  const [careers, setCareers] = useState<Career[]>(careersMockBase as Career[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        setLoading(true);
        console.log('[useCareers] Loading careers...');
        const data = await initializeCareers();
        console.log('[useCareers] Loaded careers:', data);
        setCareers(data);
      } catch (err) {
        console.error('[useCareers] Error:', err);
        setError(err instanceof Error ? err : new Error('Failed to load careers'));
        setCareers(careersMockBase as Career[]);
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  return { careers, loading, error };
}
