import useClock from "../../hooks/useClock";
import { DocumentData } from "firebase/firestore";
import TimerIcon from "../TimerIcon";

import styles from "../../styles/components/Clock.module.scss";

interface IClockProps {
  start: boolean;
  player: "white" | "black";
  user: boolean;
  roomDataSnapshot: DocumentData | undefined;
}

const Clock: React.FC<IClockProps> = ({ start, player, user, roomDataSnapshot }) => {
  const { minutes, seconds, timeLeft } = useClock(player, user, start, roomDataSnapshot);

  const userOutput = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <>
      {roomDataSnapshot?.clock.white ? (
        <div className={styles.clock}>
          <TimerIcon />
          <p>{user ? userOutput : timeLeft}</p>
        </div>
      ) : null}
    </>
  );
};

export default Clock;
