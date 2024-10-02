import { useEffect, useState } from "react";


function TimeStamp({time}) {
    const [timeStamp, setTimeStamp] = useState("");
    useEffect(() => {
        function calTime(time) {
          const s = new Date(time);
          const now = new Date();
          const diff = now - s;

          const seconds = Math.floor(diff / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);

          if (days > 0) {
            return days === 1 ? `${days} day ago` : `${days} days ago`;
          } else if (hours > 0) {
            return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
          } else if (minutes > 0) {
            return minutes === 1
              ? `${minutes} minute ago`
              : `${minutes} minutes ago`;
          } else {
            return seconds === 1
              ? `${seconds} second ago`
              : `${seconds} seconds ago`;
          }
        }

        setTimeStamp(calTime(time));

        const interval = setInterval(() => {
            setTimeStamp(calTime(time));
        })

        return () => clearInterval(interval);

    }, [timeStamp]);
  return (
    <div>{timeStamp}</div>
  )
}

export default TimeStamp