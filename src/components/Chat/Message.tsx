import styles from "../../styles/components/Message.module.scss";

interface IMessage {
  message: string;
  msgUserID: string;
  userID: string;
}

const Message: React.FC<IMessage> = ({ message, msgUserID, userID }) => {
  const msgType = msgUserID === userID ? styles.sender : styles.reciver;
  const msgClassName = msgUserID === "SERVER" ? styles.server : styles.message + " " + msgType;

  return <p className={msgClassName}>{message}</p>;
};

export default Message;
