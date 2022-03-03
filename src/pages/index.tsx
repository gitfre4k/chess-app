import Head from "next/head";
import Navbar from "../components/Navbar/Navbar";

import styles from "../styles/pages/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chess App</title>
      </Head>
      <main className={styles.container}>
        <Navbar />
      </main>
    </>
  );
};

export default Home;
