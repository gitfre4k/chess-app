import { Dispatch, useState, useEffect } from "react";
import { ChessState, ChessAction } from "../../interfaces";
import { DocumentData, getDoc, doc, updateDoc } from "firebase/firestore";

import Chessboard from "../Chess";
import UserInfo from "../UserInfo/UserInfo";
import { db } from "../../firebase";
import { emptyBoard } from "../../constants/positions";

import styles from "../../styles/components/RoomGame.module.scss";
import { User as IUser } from "firebase/auth";

interface RoomGameProps {
  chessState: ChessState;
  dispatch: Dispatch<ChessAction>;
  user: IUser;
  roomState: DocumentData;
  roomID: string;
}

const RoomGame: React.FC<RoomGameProps> = ({ chessState, dispatch, user, roomState, roomID }) => {
  const [whitePlayer, setWhitePlayer] = useState<DocumentData>();
  const [blackPlayer, setBlackPlayer] = useState<DocumentData>();
  const { white, black, activePlayer, positions, enPassantMoves } = roomState;

  useEffect(() => {
    (async () => {
      setWhitePlayer((await getDoc(doc(db, "users", white))).data());
      setBlackPlayer((await getDoc(doc(db, "users", black))).data());
    })();
  }, [white, black]);

  useEffect(() => {
    dispatch({ type: "CHANGE_PLAYER", payload: { value: activePlayer } });
  }, [activePlayer, dispatch]);

  useEffect(() => {
    dispatch({
      type: "SYNC_POSITIONS",
      payload: { value: { ...emptyBoard, ...JSON.parse(positions) } },
    });
  }, [positions, dispatch]);

  useEffect(() => {
    dispatch({
      type: "SYNC_EN_PASSANT_MOVES",
      payload: { value: { ...JSON.parse(enPassantMoves) } },
    });
  }, [enPassantMoves, dispatch]);

  return (
    <div className={styles.roomGame}>
      <div className={styles.roomGamePlayer}>{blackPlayer && <UserInfo user={blackPlayer} />}</div>
      <Chessboard
        state={chessState}
        dispatch={dispatch}
        roomState={roomState}
        user={user}
        roomID={roomID}
      />
      <div className={styles.roomGamePlayer}>{whitePlayer && <UserInfo user={whitePlayer} />}</div>
    </div>
  );
};

export default RoomGame;