import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { onDisconnect } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

import RoomSetup from "../../components/RoomSetup/RoomSetup";
import Chess from "../../components/Chess";
import Chat from "../../components/Chat/Chat";
import NotationBoard from "../../components/NotationBoard/NotationBoard";
import { one2a } from "../../constants/square-notation";

import styles from "../../styles/pages/room.module.scss";
import { IFigure } from "../../components/Chess/Chessboard/interfaces";

const Room = () => {
  const [notation, setNotation] = useState<any[]>([]);
  const [start, setStart] = useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomDataSnapshot] = useDocumentData(roomDocRef);
  const [whitePlayer, setWhitePlayer] = useState<{ [key: string]: string }>();
  const [blackPlayer, setBlackPlayer] = useState<{ [key: string]: string }>();

  useEffect(() => {
    const updateRoomInfo = async () => {
      if (roomDataSnapshot) {
        const hostSnap = await getDoc(doc(db, "users", roomDataSnapshot.host));
        const guestSnap = roomDataSnapshot.guest
          ? await getDoc(doc(db, "users", roomDataSnapshot.guest))
          : undefined;
        if (roomDataSnapshot.host === roomDataSnapshot.white) {
          setWhitePlayer(hostSnap.data());
          setBlackPlayer(guestSnap?.data());
        } else {
          setWhitePlayer(guestSnap?.data());
          setBlackPlayer(hostSnap.data());
        }
      }
    };
    updateRoomInfo();
  }, [roomDataSnapshot]);

  useEffect(() => {
    if (roomDataSnapshot?.notation) {
      setNotation(roomDataSnapshot.notation);
    }
  }, [roomDataSnapshot?.notation]);

  useEffect(() => {
    if (roomDataSnapshot?.start) {
      setStart(true);
    }
  }, [roomDataSnapshot?.start]);

  useEffect(() => {
    if (user) {
      addDoc(collection(db, "messages"), {
        timestamp: serverTimestamp(),
        user: "SERVER",
        roomID: router.query.id,
        msg: user.displayName + " has joind the room.",
      });
    }
    onAuthStateChanged(
      auth,
      (connected) =>
        !connected &&
        addDoc(collection(db, "messages"), {
          timestamp: serverTimestamp(),
          user: "SERVER",
          roomID: router.query.id,
          msg: user?.displayName + " has left the room.",
        })
    );
  }, [user, router.query.id]);

  const sendMessage = (msg: string) => {
    if (router.query.id && user) {
      addDoc(collection(db, "messages"), {
        timestamp: serverTimestamp(),
        user: user.uid,
        roomID: router.query.id,
        msg,
      });
    }
  };

  const startGame = () => {
    updateDoc(roomDocRef, {
      start: true,
    });
  };

  const changeColor = () => {
    const black = roomDataSnapshot?.white;
    updateDoc(roomDocRef, {
      white: roomDataSnapshot?.black,
      black,
    });
  };

  const setClock = useCallback(
    (time: string) => {
      updateDoc(roomDocRef, {
        clock: {
          white: time,
          black: time,
        },
      });
    },
    [roomDocRef]
  );

  const updateClock = useCallback(
    (player: "white" | "black", timeLeft: string) => {
      // if (!roomDataSnapshot?.clock) return;
      const clockData = roomDataSnapshot?.clock;
      updateDoc(roomDocRef, {
        clock: {
          ...clockData,
          [player]: timeLeft,
        },
      });
    },
    [roomDocRef, roomDataSnapshot?.clock]
  );

  const figureNotation = (figure: IFigure) => {
    switch (figure.name) {
      case "bishop":
        return "B";
      case "knight":
        return "N";
      case "rook":
        return "R";
      case "queen":
        return "Q";
      case "king":
        return "K";
      default:
        return "";
    }
  };

  const updateNotationBoard = (figure: IFigure, x: number, y: number, captured: boolean) => {
    if (figure.name === "king" && Math.abs(figure.x - x) === 2) {
      setNotation((prevValue) => [...prevValue, x === 7 ? "0-0" : "0-0-0"]);
      return;
    }
    const figureName =
      captured && figure.name === "pawn" ? one2a(figure.x) : figureNotation(figure);
    const squareNotation = `${one2a(x)}${y}`;

    const move = figureName + (captured ? "x" : "") + squareNotation;
    setNotation((prevValue) => {
      if (figure.color === "white") {
        updateDoc(roomDocRef, {
          notation: [...prevValue, move],
        });
        return [...prevValue, move];
      }
      const newValue = [...prevValue];
      newValue[newValue.length - 1] = newValue[newValue.length - 1] + " " + move;
      updateDoc(roomDocRef, {
        notation: newValue,
      });
      return newValue;
    });
  };

  return (
    <div className={styles.container}>
      <Chat sendMessage={sendMessage} />
      {start ? (
        <>
          <NotationBoard figures={notation} />
          <Chess
            updateNotationBoard={updateNotationBoard}
            whitePlayer={whitePlayer}
            blackPlayer={blackPlayer}
            roomDataSnapshot={roomDataSnapshot}
            user={user}
            updateClock={updateClock}
          />
        </>
      ) : (
        <RoomSetup
          roomID={`${router.query.id}`}
          changeColor={changeColor}
          startGame={startGame}
          user={user}
          roomDataSnapshot={roomDataSnapshot}
          setClock={setClock}
        />
      )}
    </div>
  );
};

export default Room;
