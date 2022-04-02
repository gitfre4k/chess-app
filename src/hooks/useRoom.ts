import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  doc,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { startingPositions } from "../constants/positions";

const useRoom = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const createRoom = () => {
    addDoc(collection(db, "rooms"), {
      users: [user?.email],
      host: user?.uid,
      guest: "",
      start: false,
      admin: user?.email,
      white: user?.uid,
      messages: [],
      positions: JSON.stringify(startingPositions),
      activePlayer: "white",
      enPassant: JSON.stringify({
        white: [],
        black: [],
      }),
      castling: JSON.stringify({
        white: { short: true, long: true },
        black: { short: true, long: true },
      }),
      notation: [],
      clock: {
        white: "",
        black: "",
      },
    }).then((room) => {
      router.push(`/room/${room.id}`);
      addDoc(collection(db, "messages"), {
        timestamp: serverTimestamp(),
        user: "SERVER",
        roomID: room.id,
        msg: user?.displayName + " has created the room.",
      });
    });
  };

  const joinRoom = (roomID: string) => {
    const docRef = doc(db, "rooms", roomID);
    updateDoc(docRef, {
      users: arrayUnion(user?.email),
      guest: user?.uid,
      black: user?.uid,
    })
      .then(() => {
        router.push(`/room/${roomID}`);
        addDoc(collection(db, "messages"), {
          timestamp: serverTimestamp(),
          user: "SERVER",
          roomID: roomID,
          msg: user?.displayName + " has joined the room.",
        });
      })
      .catch((err) => err && alert("Wrong room ID!"));
  };

  return { createRoom, joinRoom };
};

export default useRoom;
