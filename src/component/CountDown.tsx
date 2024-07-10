import React, { useEffect, useState } from "react";

interface CountdownProps {
  initialCountdown: number;
  onCountdownEnd: () => void;
}

export default function CountDown({
  initialCountdown,
  onCountdownEnd,
}: CountdownProps) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      onCountdownEnd();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, onCountdownEnd]);

  return <span>{countdown}</span>;
}
