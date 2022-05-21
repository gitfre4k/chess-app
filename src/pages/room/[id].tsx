import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import RoomSetup from "../../components/RoomSetup/RoomSetup";
import RoomGame from "../../components/RoomGame/RoomGame";
import Chat from "../../components/Chat/Chat";
import { reducer, initialState } from "../../reducer/chessReducer";

import styles from "../../styles/pages/Room.module.scss";

const Room = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomState] = useDocumentData(roomDocRef);
  const [chessState, dispatch] = useReducer(reducer, initialState);

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
    <div className={styles.container}>
      {user && roomState ? (
        roomState.start ? (
          <RoomGame
            chessState={chessState}
            dispatch={dispatch}
            user={user}
            roomState={roomState}
            roomID={`${router.query.id}`}
          />
        ) : (
          <RoomSetup roomID={`${router.query.id}`} user={user} roomState={roomState} />
        )
      ) : (
        <p>loading...</p>
      )}
      <Chat />
    </div>
  );
};

export default Room;
