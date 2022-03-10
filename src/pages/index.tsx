import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../firebase";
import { collection, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { startingPositions } from "../constants/positions";
import Head from "next/head";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Card/Card";

import styles from "../styles/pages/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
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
    <>
      <Head>
        <title>Chess App</title>
      </Head>
      <main className={styles.container}>
        <Navbar />
        <Card name="Create Room" onClick={createRoom} first={true} />
        <Card name="Join Room" onClick={joinRoom} />
      </main>
    </>
  );
};

export default Home;
