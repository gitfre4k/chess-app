import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase";
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";

import Chat from "../../components/Chat/Chat";
import Sidebar from "../../components/Sidebar/Sidebar";

import { GetServerSideProps } from "next";

interface IRoomProps {
  messages: { [key: string]: string }[];
}

const Room = ({ messages }: IRoomProps) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const { id } = router.query;
  const sendMessage = (msg: string) => {
    if (id && user) {
      addDoc(collection(db, "messages"), {
        user: user.uid,
        id,
        msg,
      });
    }
  };

  const showMessages = () => {};

  return (
    <>
      <h1>Room id: {id}</h1>
      {messages.map((msg, index) => (
        <p key={index}>{msg.msg}</p>
      ))}
      <Chat sendMessage={sendMessage} />
    </>
  );
};

export default Room;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const colRef = collection(db, "messages");
  const q = query(colRef, where("id", "==", context.query.id));
  const querySnapshot = await getDocs(q);
  const messages: { id: string }[] = [];
  querySnapshot.forEach((doc) => {
    messages.push({ ...doc.data(), id: doc.id });
  });
  return {
    props: {
      messages,
    },
  };
};
