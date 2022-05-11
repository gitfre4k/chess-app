import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import useNotationBoard from "../../hooks/useNotationBoard";

import RoomSetup from "../../components/RoomSetup/RoomSetup";
import Chess from "../../components/Chess";
import Chat from "../../components/Chat/Chat";
import room from "../../assets/images/room.jpg";
import NotationBoard from "../../components/NotationBoard/NotationBoard";

import styles from "../../styles/pages/Room.module.scss";

const Room = () => {
  const [start, setStart] = useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomDataSnapshot] = useDocumentData(roomDocRef);
  const [whitePlayer, setWhitePlayer] = useState<{ [key: string]: string }>();
  const [blackPlayer, setBlackPlayer] = useState<{ [key: string]: string }>();
  const { notation, updateNotationBoard } = useNotationBoard(
    roomDataSnapshot?.notation,
    roomDocRef
  );

  useEffect(() => {
    const getPlayers = async () => {
      if (roomDataSnapshot) {
        const hostSnap = await getDoc(doc(db, "users", roomDataSnapshot.host));
        const guestSnap = roomDataSnapshot.guest
          ? await getDoc(doc(db, "users", roomDataSnapshot.guest))
          : undefined;
        if (roomDataSnapshot.host === roomDataSnapshot.white) {
          setWhitePlayer(hostSnap.data());
          setBlackPlayer(guestSnap?.data());
        } else {
          setWhitePlayer(guestSnap?.data());
          setBlackPlayer(hostSnap.data());
        }
      }
    };
    getPlayers();
  }, [roomDataSnapshot]);

  useEffect(() => {
    if (roomDataSnapshot?.start) {
      setStart(true);
    }
  }, [roomDataSnapshot?.start]);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (connected) =>
        !connected &&
        addDoc(collection(db, "messages"), {
          timestamp: serverTimestamp(),
          user: "SERVER",
          roomID: router.query.id,
          msg: user?.displayName + " has left the room.",
        })
    );
  }, [user, router.query.id]);

  return (
    <>
      <div className={styles.container}>
        {/* <Chat /> */}
        {start ? (
          <>
            <NotationBoard figures={notation} />
            <Chess />
          </>
        ) : (
          <RoomSetup
            roomID={`${router.query.id}`}
            user={user}
            roomDataSnapshot={roomDataSnapshot}
          />
        )}
      </div>
    </>
  );
};

export default Room;
