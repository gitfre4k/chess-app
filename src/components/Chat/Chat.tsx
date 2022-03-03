import { useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "../../firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

import Message from "./Message";

import styles from "../../styles/components/Chat.module.scss";

interface IChat {
  sendMessage: (msg: string) => void;
}

const Chat: React.FC<IChat> = ({ sendMessage }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [messagesSnapshot] = useCollection(
    query(collection(db, "messages"), where("roomID", "==", router.query.id), orderBy("timestamp"))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((msg, index) => (
        <Message key={index} msgUserID={msg.data().user} message={msg.data().msg} />
      ));
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue !== "") {
      sendMessage(inputValue);
    }
    setInputValue("");
  };

  return (
    <div className={styles.container}>
      <div>{showMessages()}</div>
      <form onSubmit={submitHandler}>
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;
