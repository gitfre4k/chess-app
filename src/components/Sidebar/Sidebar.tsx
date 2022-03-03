import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebase";
import { collection, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { startingPositions } from "../../constants/positions";

import styled from "styled-components";

const Sidebar = () => {
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
    <Container>
      <button onClick={createRoom}>Create room</button>
      <button onClick={joinRoom}>Join room</button>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(37, 37, 37);
  overflow-x: hidden;
`;

export default Sidebar;
