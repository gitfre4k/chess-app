import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import RoomSetup from "../../components/RoomSetup/RoomSetup";
import Card from "../../components/Card/Card";
import Chess from "../../components/Chess";
import Chat from "../../components/Chat/Chat";

import styles from "../../styles/pages/room.module.scss";

const Room = () => {
  const [start, setStart] = useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);

  // useEffect(() => {
  //   if (router.query.id && user) {
  //     addDoc(collection(db, "messages"), {
  //       timestamp: serverTimestamp(),
  //       user: "chessApp",
  //       roomID: router.query.id,
  //       msg: user.displayName + " has joined!",
  //     });
  //   }
  // }, [router.query.id, user]);

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

  const startGame = () => {
    setStart(true);
  };

  return (
    <div className={styles.container}>
      <Chat sendMessage={sendMessage} />
      {start ? <Chess /> : <RoomSetup roomID={`${router.query.id}`} startGame={startGame} />}
    </div>
  );
};

export default Room;
