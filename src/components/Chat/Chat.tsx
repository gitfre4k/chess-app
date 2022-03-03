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
      <ChatEntry onSubmit={submitHandler}>
        <ChatInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button>Send</Button>
      </ChatEntry>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  position: absolute;
  flex: 1;
  width: 300px;
  height: 50vh;
  background-color: #313131;
  border: 5px solid white;
  right: 0;
  top: 0;
`;

const MessageContainer = styled.div``;

const ChatEntry = styled.form`
  position: absolute;
  bottom: 0;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  position: absolute;
  padding: 12px 26px;
  border: 1px solid #ccc;
  border-radius: 4px;
  bottom: 0;
`;
