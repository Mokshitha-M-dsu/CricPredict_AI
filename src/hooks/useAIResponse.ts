import { useState } from 'react';

export function useAIResponse<T>() {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (requestFn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn();
      setResponse(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setResponse(null);
    }
    setLoading(false);
  };

  return { response, loading, error, handleRequest };
}