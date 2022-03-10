import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import Chess from "../../components/Chess";
import Chat from "../../components/Chat/Chat";

import styles from "../../styles/pages/room.module.scss";

// import { GetServerSideProps } from "next";

// interface IRoomProps {
//   messages: [{ roomID: string }, { user: string }, { msg: string }, { timestamp: string }];
// }

const Room = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  // const messages: { roomID: string; user: string; msg: string; timestamp: string }[] = JSON.parse(
  //   `${msg}`
  // );

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

  return (
    <div className={styles.container}>
      <h2>Room id: {router.query.id}</h2>
      <Chess />
      <Chat sendMessage={sendMessage} />
    </div>
  );
};

export default Room;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const colRef = collection(db, "messages");
//   const q = query(colRef, where("roomID", "==", context.query.id), orderBy("timestamp"));
//   const querySnapshot = await getDocs(q);

//   const messages: { id: string }[] = [];
//   querySnapshot.forEach((doc) => messages.push({ ...doc.data(), id: doc.id }));

//   return {
//     props: {
//       messages: JSON.stringify(messages),
//     },
//   };
// };
