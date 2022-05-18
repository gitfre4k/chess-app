import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

import Button from "../Button/Button";

import styles from "../../styles/components/Login.module.scss";

const Login = () => {
  return (
    <div className={styles.container}>
      <h2>Welcome to Chess App!</h2>
      <p>Play chess online with your friends!</p>
      <p>In order to host or join a room, please sign in.</p>
      <Button
        name="Sign in with Google"
        style="dark"
        action={() => signInWithPopup(auth, provider)}
      />
    </div>
  );
};

export default Login;
