import useRoom from "../hooks/useRoom";

import Head from "next/head";
import Card from "../components/Card/Card";
import Image from "next/image";
import home from "../assets/images/home.jpg";

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
        <Image src={home} alt="home background" layout="fill" objectFit="cover" />
        <div className={styles.content}>
          <Card content={<p>Create Room</p>} onClick={createRoom} first={true} />
          <Card content={<p>Join Room</p>} onClick={onJoinRoom} />
        </div>
      </main>
    </>
  );
};

export default Home;
