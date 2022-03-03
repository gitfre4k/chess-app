import Image from "next/image";
import loadingImage from "../../assets/images/loading.jpg";

import Head from "next/head";
import styles from "../../styles/components/Loading.module.scss";

const Loading = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className={styles.container}>
        <Image src={loadingImage} alt="blured image of chessboard" />
        <h2>Loading...</h2>
      </div>
    </>
  );
};

export default Loading;
