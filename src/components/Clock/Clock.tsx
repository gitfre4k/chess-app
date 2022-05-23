import { useEffect } from "react";
import useClock from "../../hooks/useClock";
import { doc, updateDoc } from "firebase/firestore";

import TimerIcon from "../TimerIcon";
import { db } from "../../firebase";

import styles from "../../styles/components/Clock.module.scss";

interface ClockProps {
  time: string;
  roomID: string;
  color: "white" | "black";
  update: boolean;
}

const Clock: React.FC<ClockProps> = ({ time, roomID, color, update }) => {
  const [minutes, seconds] = useClock(time, update);

  useEffect(() => {
    const docRef = doc(db, "rooms", roomID);
    update &&
      updateDoc(docRef, {
        [color + "Clock"]: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
      });
  }, [roomID, minutes, seconds, color, update]);

  return (
    <div className={styles.clock}>
      <TimerIcon />
      <p>{update ? `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` : time}</p>
    </div>
  );
};

export default Clock;
