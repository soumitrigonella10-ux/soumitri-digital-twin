import { useState, useEffect } from "react";

/**
 * Generic hook to fetch data from an API route.
 * Returns { data, loading, error } — loads once on mount.
 *
 * Usage:
 *   const { data, loading } = useDbData<MyType[]>("/api/my-endpoint", []);
 */
export function useDbData<T>(url: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const detail = body?.error || `HTTP ${res.status}`;
          throw new Error(detail);
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json.data ?? fallback);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`[useDbData] ${url}:`, err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
}
