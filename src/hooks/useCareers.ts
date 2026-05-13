import { useState, useEffect } from 'react';
import { Career, initializeCareers, careersMockBase, careers as globalCareers } from '@/lib/careers.service';

export function useCareers() {
  const [careers, setCareers] = useState<Career[]>(globalCareers.length > 0 ? globalCareers : (careersMockBase as Career[]));
  const [loading, setLoading] = useState(globalCareers.length === 0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        if (careers.length === 0) setLoading(true);
        const data = await initializeCareers();
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
