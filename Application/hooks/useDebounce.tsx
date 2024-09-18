import { useState, useEffect, useRef } from 'react';

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const queueRef = useRef<{ timeout: NodeJS.Timeout | null; value: string | null }>({
    timeout: null,
    value: null,
  });

  useEffect(() => {
    // Clear previous timeout
    if (queueRef.current.timeout) {
      clearTimeout(queueRef.current.timeout);
    }

    // Set up a new timeout
    queueRef.current.timeout = setTimeout(() => {
      setDebouncedValue(queueRef.current.value ?? value);
    }, delay);

    // Update the queued value
    queueRef.current.value = value;

    // Cleanup function to clear timeout on unmount or value change
    return () => {
      if (queueRef.current.timeout) {
        clearTimeout(queueRef.current.timeout);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
