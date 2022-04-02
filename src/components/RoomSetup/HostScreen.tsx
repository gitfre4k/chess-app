import useRoomSetup from "../../hooks/useRoomSetup";

import styles from "../../styles/components/HostScreen.module.scss";

const HostScreen = () => {
  const { time, changeTime, changeColor, startGame } = useRoomSetup();

  return (
    <div className={styles.hostOptions}>
      <div className={styles.clock}>
        <div className={styles.clockBtn} onClick={() => changeTime(false)}>
          -
        </div>
        <p>
          {["", "1:00", "3:00", "5:00"][time] === ""
            ? "No Timer"
            : ["", "1:00", "3:00", "5:00"][time]}
        </p>
        <div className={styles.clockBtn} onClick={() => changeTime(true)}>
          +
        </div>
      </div>
      <div className={styles.hostBtn} onClick={changeColor}>
        Change color
      </div>
      <div className={styles.hostBtn + " " + styles.main} onClick={startGame}>
        START GAME
      </div>
    </div>
  );
};

export default HostScreen;
