import { useReducer } from "react";
import { reducer, initialState } from "../reducer/chessReducer";
import useRoom from "../hooks/useRoom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import Login from "../components/Login/Login";
import Chessboard from "../components/Chess";
import Head from "next/head";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import NotationBoard from "../components/NotationBoard/NotationBoard";

import styles from "../styles/pages/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user] = useAuthState(auth);
  const { createRoom, joinRoom } = useRoom();

  const onJoinRoom = () => {
    const roomID = prompt("Enter room ID");
    if (!roomID) return;
    joinRoom(roomID);
  };

  return (
    <>
      <Head>
        <title>Chess App</title>
      </Head>
      <main className={styles.container}>
        {user ? (
          <div className={styles.leftSide}>
            <div className={styles.leftSideCards}>
              <Card name="Create Room" action={createRoom} />
              <Card name="Join Room" action={onJoinRoom} />
            </div>
          </div>
        ) : (
          <Login />
        )}
        <div className={styles.container__chess}>
          <div className={styles.conteiner__chess__chessboard}>
            <Chessboard state={state} dispatch={dispatch} />
            <div className={styles.container__chess__chessboard__btn}>
              <Button
                name="Rotate Board"
                style="dark"
                action={() => dispatch({ type: "ROTATE_BOARD" })}
              />
              <Button name="Reset" style="dark" action={() => dispatch({ type: "RESET" })} />
            </div>
          </div>
          <div
            className={
              state.notations.length
                ? styles.container__chess__notations
                : styles.container__chess__notationsHide
            }
          >
            <NotationBoard notations={state.notations} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
