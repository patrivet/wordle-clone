import { useEffect, useRef, useState } from 'react';

type UseOverlayReturn = [
  string | null,
  (message: string, duration?: number, callback?: () => void) => void
];

const useOverlay = (): UseOverlayReturn => {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutId = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutId.current !== null) window.clearTimeout(timeoutId.current);
    },
    []
  );

  const showOverlay = (
    message: string,
    duration: number = 2000,
    callback?: () => void
  ) => {
    if (timeoutId.current !== null) window.clearTimeout(timeoutId.current);
    setMessage(message);
    timeoutId.current = window.setTimeout(() => {
      setMessage(null);
      if (callback) callback();
    }, duration);
  };

  return [message, showOverlay];
};

export default useOverlay;
