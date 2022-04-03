import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

import styles from "../../styles/components/WaitingForGuest.module.scss";

interface IWaitingForGuestProps {
  roomID: string;
}

const WaitingForGuest: React.FC<IWaitingForGuestProps> = ({ roomID }) => {
  const href = window.location.href;
  return (
    <>
      <div className={styles.waiting}>
        <p>Share link or room ID to invite a friend.</p>
        <div className={styles.inline}>
          <p>Link</p>
          <input value={href} readOnly />
          <div onClick={() => navigator.clipboard.writeText(href)} className={styles.copyBtn}>
            Copy
          </div>
        </div>
        <div className={styles.inline}>
          <p>Room ID</p>
          <input value={roomID} readOnly />
          <div onClick={() => navigator.clipboard.writeText(roomID)} className={styles.copyBtn}>
            Copy
          </div>
        </div>
      </div>
      <div className={styles.loading}>
        <LoadingIndicator pulse={true} />
        <p>W8ing 4 some1 to join...</p>
      </div>
    </>
  );
};

export default WaitingForGuest;
