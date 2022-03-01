import Chess from "../components/Chess";
import Chat from "../components/Chat/Chat";
import Sidebar from "../components/Sidebar/Sidebar";
import { auth } from "../firebase";

import styles from "../styles/Home.module.css";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className={styles.container}>
      <Chess />
      <Sidebar />
      {/* <Chat /> */}
    </main>
  );
};

export default Home;
