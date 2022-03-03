import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebase";
import { collection, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { startingPositions } from "../../constants/positions";

import styled from "styled-components";

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
    <Container>
      <Button onClick={createRoom}>Create room</Button>
      <Button onClick={joinRoom}>Join room</Button>
      <Button onClick={() => auth.signOut()}>SignOut</Button>
    </Container>
  );
};

const Container = styled.nav`
  width: 95%;
  height: 60px;
  position: sticky;
  display: flex;
  z-index: 1;
  top: 10px;
  background-color: rgb(12, 12, 12);
  overflow-x: hidden;
  border-radius: 50px;
`;

const Button = styled.button`
  padding: 8px 20px;
  margin: 7px 6px;
  border: 2px solid white;
  border-radius: 50px;
  background: none;
  color: white;
  :hover {
    background-color: rgb(22, 22, 22);
    cursor: pointer;
  }
`;

export default Navbar;
