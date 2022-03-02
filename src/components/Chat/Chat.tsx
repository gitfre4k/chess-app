import { useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "../../firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

import Message from "./Message";

import styled from "styled-components";

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
    <Container>
      <MessageContainer>{showMessages()}</MessageContainer>
      <ChatInput onSubmit={submitHandler}>
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button>Send</button>
      </ChatInput>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  position: absolute;
  flex: 1;
  owerflow: scroll;
  width: 300px;
  height: 50vh;
  border: 5px solid black;
  right: 0;
  top: 0;
`;

const MessageContainer = styled.div``;
const ChatInput = styled.form`
  position: absolute;
  width: 300px;
  bottom: 0;
`;
