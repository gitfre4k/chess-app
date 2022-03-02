import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

import styled from "styled-components";

interface IMessage {
  msgUserID: string;
  message: string;
}

const Message: React.FC<IMessage> = ({ msgUserID, message }) => {
  const [user] = useAuthState(auth);

  const ElementType = msgUserID === user?.uid ? Sender : Reciever;

  return (
    <Container>
      <ElementType>{message}</ElementType>
    </Container>
  );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 5px;
  border-radius: 8px;
  margin: 5px;
  min-width: 60px;
  padding-bottom: 10px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;
