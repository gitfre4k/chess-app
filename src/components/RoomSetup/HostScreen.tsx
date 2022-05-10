import useRoomSetup from "../../hooks/useRoomSetup";

import Button from "../Button/Button";
import TimerIcon from "../TimerIcon";

import styles from "../../styles/components/HostScreen.module.scss";

const HostScreen = () => {
  const { time, changeTime, changeColor, startGame } = useRoomSetup();

  return (
    <div className={styles.hostOptions}>
      <div className={styles.hostOptionsClock}>
        <TimerIcon />
        <Button name="-" action={() => changeTime(false)} style="dark" />
        <p>
          {["", "1:00", "3:00", "5:00"][time] === ""
            ? "No Timer"
            : ["", "1:00", "3:00", "5:00"][time]}
        </p>
        <Button name="+" action={() => changeTime(true)} style="dark" />
      </div>
      <Button name="Change Color" action={changeColor} style="dark" />
      <Button name="START GAME" action={startGame} style="dark" />
    </div>
  );
};

export default HostScreen;
