'use client';

import { useState, useEffect } from 'react';

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this runs only once on mount

  const time = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', // Added seconds for live effect
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const date = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeZone: 'Asia/Kolkata',
  }).format(currentTime);

  return (
    <>
      <h2
        data-testid="currentTime"
        className="text-5xl font-bold text-[#e0e0e0] drop-shadow-[0_0_15px_rgba(0,188,212,0.6)]"
      >
        {time}
      </h2>
      <p data-testid="currentDate" className="text-sm text-[#a0a0a0]">
        {date}
      </p>
    </>
  );
};

export default LiveClock;