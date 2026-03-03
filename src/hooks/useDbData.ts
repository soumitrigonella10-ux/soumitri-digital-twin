import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic hook to fetch data from an API route.
 * Returns { data, loading, error, refetch } — loads once on mount.
 *
 * Usage:
 *   const { data, loading, refetch } = useDbData<MyType[]>("/api/my-endpoint", []);
 */
export function useDbData<T>(url: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep fallback in a ref so the fetch callback always sees the latest
  // value without needing it as a useCallback dependency (avoids stale closures
  // if the caller passes a new reference on every render).
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

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
        setData(json.data ?? fallbackRef.current);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`[useDbData] ${url}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
