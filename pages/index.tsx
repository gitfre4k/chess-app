import Chess from "../src/components/Chess";

import styles from "../styles/Home.module.css";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className={styles.container}>
      <Chess />
    </main>
  );
};

export default Home;
