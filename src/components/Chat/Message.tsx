import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

import styles from "../../styles/components/Message.module.scss";

interface IMessage {
  msgUserID: string;
  message: string;
}

const Message: React.FC<IMessage> = ({ msgUserID, message }) => {
  const [user] = useAuthState(auth);

  const msgClass = msgUserID === user?.uid ? styles.sender : styles.reciver;

  return (
    <div className={styles.container}>
      <p className={msgClass}>{message}</p>
    </div>
  );
};

export default Message;
