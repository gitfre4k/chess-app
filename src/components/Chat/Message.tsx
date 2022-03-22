import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

import styles from "../../styles/components/Message.module.scss";

interface IMessage {
  msgUserID: string;
  message: string;
}

const Message: React.FC<IMessage> = ({ msgUserID, message }) => {
  const [user] = useAuthState(auth);

  const msgType = msgUserID === user?.uid ? styles.sender : styles.reciver;
  const msgClassName = msgUserID === "SERVER" ? styles.server : styles.message + " " + msgType;

  return <p className={msgClassName}>{message}</p>;
};

export default Message;
