import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollStats() {
  const [eventsPerSecond, setEventsPerSecond] = useState(0);
  const [lastOffset, setLastOffset] = useState(0);
  const eventCount = useRef(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setEventsPerSecond(eventCount.current);
      eventCount.current = 0;
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const registerScroll = useCallback((offset: number) => {
    eventCount.current += 1;
    setLastOffset(offset);
  }, []);

  return { eventsPerSecond, lastOffset, registerScroll };
}
