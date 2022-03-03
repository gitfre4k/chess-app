import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import Head from "next/head";
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
        <button onClick={clickHandler}>Sign in with Google</button>
      </div>
    </>
  );
};

export default Login;
