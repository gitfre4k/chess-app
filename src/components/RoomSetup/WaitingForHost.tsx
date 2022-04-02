import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import TimerIcon from "../TimerIcon";

import styles from "../../styles/components/WaitingForHost.module.scss";

interface IWaitingForHostProps {
  clock: string;
}

const WaitingForHost: React.FC<IWaitingForHostProps> = ({ clock }) => {
  return (
    <div className={styles.loading}>
      <p>Waiting for host to start a game...</p>
      <LoadingIndicator pulse={true} />
      <div className={styles.settings}>
        <TimerIcon />
        <p>{clock ? clock : "No Timer"}</p>
      </div>
    </div>
  );
};

export default WaitingForHost;
