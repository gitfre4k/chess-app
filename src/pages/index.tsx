import useRoom from "../hooks/useRoom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import Hero from "../components/Hero/Hero";
import Login from "../components/Login/Login";
import Chessboard from "../components/Chess";
import Head from "next/head";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";

import styles from "../styles/pages/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [user] = useAuthState(auth);
  const { createRoom, joinRoom } = useRoom();

  const onJoinRoom = () => {
    const roomID = prompt("Enter room ID");
    if (!roomID) return;
    joinRoom(roomID);
  };

  return (
    <>
      <Head>
        <title>Chess App</title>
      </Head>
      <main className={styles.container}>
        {user ? (
          <div className={styles.leftSide}>
            <Hero />
            <div className={styles.leftSideCards}>
              <Card name="Create Room" action={createRoom} />
              <Card name="Join Room" action={onJoinRoom} />
            </div>
          </div>
        ) : (
          <Login />
        )}
        <div className={styles.containerChess}>
          <Chessboard />
          <div className={styles.containerChessBtn}>
            <Button name="Rotate Board" style="dark" action={() => console.log("rotate")} />
            <Button name="Reset" style="dark" action={() => console.log("reset")} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
