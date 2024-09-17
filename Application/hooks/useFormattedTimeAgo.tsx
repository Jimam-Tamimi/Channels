import { useState, useEffect } from 'react';
import moment from 'moment';

const useFormattedTime = (timestamp: string) => {
  const calculateDuration = () => {
    const duration = moment.duration(moment().diff(moment(timestamp)));
    if (duration.asYears() >= 1) return `${Math.floor(duration.asYears())}y`;
    if (duration.asWeeks() >= 1) return `${Math.floor(duration.asWeeks())}w`;
    if (duration.asDays() >= 1) return `${Math.floor(duration.asDays())}d`;
    if (duration.asHours() >= 1) return `${Math.floor(duration.asHours())}h`;
    if (duration.asMinutes() >= 1) return `${Math.floor(duration.asMinutes())}m`;
    return duration.asSeconds()  < 9 ? "Now" : `${Math.floor(duration.asSeconds())}s`;
  };

  const [formattedTime, setFormattedTime] = useState(calculateDuration());

  useEffect(() => {
    const updateTime = () => {
      setFormattedTime(calculateDuration());
    };

    let interval: NodeJS.Timeout;
    
    // Update every 5 seconds for the first minute
    const startInitialInterval = () => {
      interval = setInterval(() => {
        updateTime();
      }, 10000);
    };

    // After the first minute, switch to updating every 1 minute
    const switchToOneMinuteInterval = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        updateTime();
      }, 60000); // 1 minute
    };

    startInitialInterval();

    // Switch the interval to 1 minute after 1 minute has passed
    const timeout = setTimeout(switchToOneMinuteInterval, 60000); // 1 minute

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [timestamp]);

  useEffect(() => {
    // Reset the time when a new timestamp is passed
    setFormattedTime(calculateDuration());
  }, [timestamp]);

  if (!timestamp) {
    return '';
  }
  
  return formattedTime;
};

export default useFormattedTime;
