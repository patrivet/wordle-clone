import { useState } from "react";

type UseOverlayReturn = [string | null, (message: string, duration?: number) => void];

const useOverlay = (): UseOverlayReturn => {
  const [message, setMessage] = useState<string | null>(null);

  const showOverlay = (message: string, duration: number = 2000) => {
    setMessage(message);
    setTimeout(() => setMessage(null), duration);
  };

  return [message, showOverlay];
};

export default useOverlay;
