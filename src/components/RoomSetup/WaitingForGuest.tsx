import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

import styles from "../../styles/components/WaitingForGuest.module.scss";

interface IWaitingForGuestProps {
  roomID: string;
}

const WaitingForGuest: React.FC<IWaitingForGuestProps> = ({ roomID }) => {
  return (
    <div className={styles.waiting}>
      <p>Share this room ID with a friend.</p>
      <input value={roomID} readOnly />
      <div onClick={() => navigator.clipboard.writeText(roomID)} className={styles.copyBtn}>
        Copy
      </div>
      <LoadingIndicator pulse={true} />
      <p>W8ing 4 some1 to join...</p>
    </div>
  );
};

export default WaitingForGuest;
