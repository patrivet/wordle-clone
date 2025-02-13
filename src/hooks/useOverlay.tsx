import { useState } from "react";

type UseOverlayReturn = [
  string | null,
  (message: string, duration?: number, callback?: () => void) => void
];

const useOverlay = (): UseOverlayReturn => {
  const [message, setMessage] = useState<string | null>(null);

  const showOverlay = (message: string, duration: number = 2000, callback?: () => void) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
      if (callback) callback();
    }, duration);
  };

  return [message, showOverlay];
};

export default useOverlay;
