import { useState } from "react";

import styled from "styled-components";

interface IChat {
  sendMessage: (msg: string) => void;
}

const Chat: React.FC<IChat> = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message !== "") {
      sendMessage(message);
    }
    setMessage("");
  };

  return (
    <Container>
      <ChatScreen />
      <ChatInput onSubmit={submitHandler}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button>Send</button>
      </ChatInput>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  position: relative;
  flex: 1;
  owerflow: scroll;
  width: 300px;
  height: 500px;
  border: 5px solid black;
`;

const ChatScreen = styled.div``;
const ChatInput = styled.form`
  position: absolute;
  bottom: 0;
`;
