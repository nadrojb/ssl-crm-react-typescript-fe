import { useEffect, useState } from "react";

import {
  isAppError,
  toAppError,
  type AppError,
} from "../api/errorHandler";

type UseAsyncDataResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
};

export function useAsyncData<T>(
  load: () => Promise<T>,
  deps: readonly unknown[]
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await load();
        if (isMounted) {
          setData(result);
        }
      } catch (e: unknown) {
        if (isMounted) {
          setError(isAppError(e) ? e : toAppError(e));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, isLoading, error };
}
