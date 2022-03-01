import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import Head from "next/head";
import styled from "styled-components";

const Login = () => {
  const clickHandler = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <button onClick={clickHandler}>Sign in with Google</button>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

export default Login;
