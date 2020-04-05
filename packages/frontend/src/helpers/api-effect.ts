import { useEffect, useCallback } from 'react';

import { Ajax } from '../api/ajax';

/**
 * useEffect with an API call. Calls request.abort() when the component unmounts.
 *
 * @param request the API Request
 * @param requestCallback the callback, taking the request
 * @param dependencies the dependencies
 */
export function useApiEffect<T>(
  requestFactory: () => Ajax<T>,
  requestCallback: (request: Ajax<T>) => Promise<void>,
  dependencies: React.DependencyList | undefined
) {
  const memoizedCallback = useCallback(() => {
    const request = requestFactory();
    requestCallback(request);
    return () => {
      request.abort();
    };
  }, [requestFactory, requestCallback]);
  useEffect(memoizedCallback, dependencies);
}
