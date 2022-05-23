import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { doc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const useRoom = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const createRoom = () => {
    if (!user) {
      alert("In order to create or join a room, please sign in.");
      return;
    }
    addDoc(collection(db, "rooms"), {
      host: user.uid,
      white: user.uid,
      start: false,
      whiteClock: "",
      blackClock: "",
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
    if (!user) {
      alert("In order to create or join a room, please sign in.");
      return;
    }
    const docRef = doc(db, "rooms", roomID);
    updateDoc(docRef, {
      guest: user.uid,
      black: user.uid,
    })
      .then(() => {
        router.push(`/room/${roomID}`);
        addDoc(collection(db, "messages"), {
          timestamp: serverTimestamp(),
          user: "SERVER",
          roomID: roomID,
          msg: user.displayName + " has joined the room.",
        });
      })
      .catch((err) => err && alert("Wrong room ID!"));
  };

  return { createRoom, joinRoom };
};

export default useRoom;
