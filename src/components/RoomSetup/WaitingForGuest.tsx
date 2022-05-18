import { useState } from "react";

import Button from "../Button/Button";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import Image from "next/image";
import success from "../../assets/images/success.png";

import styles from "../../styles/components/WaitingForGuest.module.scss";

interface IWaitingForGuestProps {
  roomID: string;
}

const WaitingForGuest: React.FC<IWaitingForGuestProps> = ({ roomID }) => {
  const [copyLink, setCopyLink] = useState(false);
  const [copyID, setCopyID] = useState(false);
  const href = window.location.href;

  const onCopy = (link?: boolean) => {
    if (link) {
      navigator.clipboard.writeText(href);
      setCopyLink(true);
      setTimeout(() => setCopyLink(false), 1000);
      return;
    }
    navigator.clipboard.writeText(roomID);
    setCopyID(true);
    setTimeout(() => setCopyID(false), 1000);
  };

  return (
    <>
      <div className={styles.waiting}>
        <p className={styles.waitingTitle}>Share link or room ID to invite a friend.</p>
        <p>Link</p>
        <div className={styles.waitingCopyLines}>
          <input value={href} readOnly />
          <Button name="Copy" action={() => onCopy(true)} style="dark" />
          <Image
            src={success}
            alt="success icon"
            height={20}
            width={20}
            className={copyLink ? styles.success : styles.img}
          />
        </div>
        <p>Room ID</p>
        <div className={styles.waitingCopyLines}>
          <input value={roomID} readOnly />
          <Button name="Copy" action={() => onCopy()} style="dark" />
          <Image
            src={success}
            alt="success icon"
            height={20}
            width={20}
            className={copyID ? styles.success : styles.img}
          />
        </div>
      </div>
      <div className={styles.loading}>
        <LoadingIndicator pulse={true} />
        <p>Waiting for someone to join...</p>
      </div>
    </>
  );
};

export default WaitingForGuest;
