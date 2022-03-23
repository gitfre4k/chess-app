import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import Head from "next/head";
import Image from "next/image";
import bKnight from "../assets/images/bKnight.png";
import wKnight from "../assets/images/wKnight.png";

import styles from "../styles/pages/login.module.scss";

const Login = () => {
  const clickHandler = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <h1>Chess App</h1>
        <div className={styles.figures}>
          <Image src={wKnight} height="100%" width="100%" objectFit="contain" alt="chess piece" />
          <Image src={bKnight} height="100%" width="100%" objectFit="contain" alt="chess piece" />
        </div>
        <p>Play chess online with your friends!</p>
        <p>In order to host or join a room, please sign in.</p>
        <button onClick={clickHandler}>Sign in with Google</button>
      </div>
    </>
  );
};

export default Login;
