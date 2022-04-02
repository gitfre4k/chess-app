import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import Message from "../components/Chat/Message";
import { addDoc, collection, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";

const useChat = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [inputValue, setInputValue] = useState("");
  const [messagesSnapshot] = useCollection(
    query(collection(db, "messages"), where("roomID", "==", router.query.id), orderBy("timestamp"))
  );
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current &&
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
      });
  };

  const sendMessage = (msg: string) => {
    if (router.query.id && user) {
      addDoc(collection(db, "messages"), {
        timestamp: serverTimestamp(),
        user: user.uid,
        roomID: router.query.id,
        msg,
      });
    }
  };

  const showMessages = () => {
    if (!user) return;
    if (messagesSnapshot) {
      scrollToBottom();
      return messagesSnapshot.docs.map((msg, index) => (
        <Message
          key={index}
          msgUserID={msg.data().user}
          message={msg.data().msg}
          userID={user.uid}
        />
      ));
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue !== "") {
      sendMessage(inputValue);
      scrollToBottom();
    }
    setInputValue("");
  };

  return { inputValue, endOfMessagesRef, setInputValue, showMessages, submitHandler };
};

export default useChat;
