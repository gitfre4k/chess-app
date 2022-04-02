import useRoom from "../hooks/useRoom";

import Head from "next/head";
import Card from "../components/Card/Card";

import styles from "../styles/pages/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
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
        <Card content={<p>Create Room</p>} onClick={createRoom} first={true} />
        <Card content={<p>Join Room</p>} onClick={onJoinRoom} />
      </main>
    </>
  );
};

export default Home;
