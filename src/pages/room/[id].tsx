import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

import RoomSetup from "../../components/RoomSetup/RoomSetup";
import Card from "../../components/Card/Card";
import Chess from "../../components/Chess";
import Chat from "../../components/Chat/Chat";

import styles from "../../styles/pages/room.module.scss";

const Room = () => {
  const [start, setStart] = useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomDataSnapshot] = useDocumentData(roomDocRef);

  useEffect(() => {
    if (roomDataSnapshot?.start) {
      setStart(true);
    }
  }, [roomDataSnapshot?.start]);

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
    // setStart(true);
    updateDoc(roomDocRef, {
      start: true,
    });
  };

  return (
    <div className={styles.container}>
      <Chat sendMessage={sendMessage} />
      {start ? <Chess /> : <RoomSetup roomID={`${router.query.id}`} startGame={startGame} />}
    </div>
  );
};

export default Room;
