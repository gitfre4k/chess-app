import Image from "next/image";
import loadingImage from "../../assets/images/loading.jpg";

import Head from "next/head";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import styles from "../../styles/components/Loading.module.scss";

const Loading = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className={styles.container}>
        <Image src={loadingImage} alt="chessboard" />
        <div className={styles.indicator}>
          <LoadingIndicator />
        </div>
      </div>
    </>
  );
};

export default Loading;
