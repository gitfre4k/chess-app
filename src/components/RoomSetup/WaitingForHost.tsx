import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import TimerIcon from "../TimerIcon";

import styles from "../../styles/components/WaitingForHost.module.scss";

interface IWaitingForHostProps {
  clock: string;
}

const WaitingForHost: React.FC<IWaitingForHostProps> = ({ clock }) => {
  return (
    <div className={styles.waiting}>
      <div className={styles.waitingClock}>
        <TimerIcon />
        <p>{clock ? clock : "No Timer"}</p>
      </div>
      <p>Waiting for host to start a game...</p>
      <LoadingIndicator pulse={true} />
    </div>
  );
};

export default WaitingForHost;
