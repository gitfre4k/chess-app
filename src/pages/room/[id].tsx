import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
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
    const getPlayers = async () => {
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
    getPlayers();
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

  const updateClock = useCallback(
    (player: "white" | "black", timeLeft: string) => {
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
      <Chat />
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
            roomDocRef={roomDocRef}
          />
        </>
      ) : (
        <RoomSetup roomID={`${router.query.id}`} user={user} roomDataSnapshot={roomDataSnapshot} />
      )}
    </div>
  );
};

export default Room;
