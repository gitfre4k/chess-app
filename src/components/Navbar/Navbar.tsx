import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebase";
import { collection, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { startingPositions } from "../../constants/positions";

import styles from "../../styles/components/Navbar.module.scss";

const Navbar = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const createRoom = () => {
    addDoc(collection(db, "rooms"), {
      users: [user?.email],
      white: user?.email,
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
    }).then((room) => router.push(`/room/${room.id}`));
  };

  const joinRoom = () => {
    const roomID = prompt("Enter room ID");
    if (!roomID) return;
    const docRef = doc(db, "rooms", roomID);
    updateDoc(docRef, {
      users: arrayUnion(user?.email),
      black: user?.email,
    })
      .then(() => router.push(`/room/${roomID}`))
      .catch((err) => err && alert("Wrong room ID!"));
  };

  return (
    <div className={styles.container}>
      <button onClick={createRoom}>Create room</button>
      <button onClick={joinRoom}>Join room</button>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  );
};

export default Navbar;
