import useRoomSetup from "../../hooks/useRoomSetup";

import Button from "../Button/Button";
import TimerIcon from "../TimerIcon";

import styles from "../../styles/components/HostScreen.module.scss";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

interface HostScreenProps {
  user: User;
  roomState: DocumentData;
}

const HostScreen: React.FC<HostScreenProps> = ({ user, roomState }) => {
  const { time, changeTime, changeColor, startGame } = useRoomSetup(user, roomState);

  return (
    <div className={styles.hostOptions}>
      <div className={styles.hostOptions__clock}>
        <Button name="-" action={() => changeTime(false)} style="dark" />
        <TimerIcon />
        <p>
          {["", "1:00", "3:00", "5:00"][time] === ""
            ? "No Timer"
            : ["", "1:00", "3:00", "5:00"][time]}
        </p>
        <Button name="+" action={() => changeTime(true)} style="dark" />
      </div>
      <Button name="Change Color" action={changeColor} style="dark" />
      <div className={styles.hostOptions__start}>
        <Button name="START GAME" action={startGame} style="dark" />
      </div>
    </div>
  );
};

export default HostScreen;
