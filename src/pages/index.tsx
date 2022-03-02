import Head from "next/head";
import Sidebar from "../components/Sidebar/Sidebar";

import styles from "../styles/Home.module.css";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chess App</title>
      </Head>
      <main className={styles.container}>
        <Sidebar />
        {/* <Chat /> */}
      </main>
    </>
  );
};

export default Home;
