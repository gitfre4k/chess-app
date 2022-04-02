import { useEffect, useRef, useState } from "react";
import * as hooks from "./hooks";

import Square from "../Square";
import UserInfo from "../../UserInfo/UserInfo";
import Clock from "../../Clock/Clock";
import { xyNotation, algebraicNotation } from "../../../constants/square-notation";
import * as f from "../../../constants/figures";
import isMoveValid from "./helpers/move-validity/isMoveValid";
import isKingSafe from "./helpers/move-validity/isKingSafe";

import { IFigure, IDestination } from "./interfaces";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

import styles from "../../../styles/components/Chessboard.module.scss";
import { DocumentReference } from "firebase/firestore";

interface IChessboardProps {
  updateNotationBoard: (figure: IFigure, x: number, y: number, captured: boolean) => void;
  whitePlayer?: { [key: string]: string };
  blackPlayer?: { [key: string]: string };
  roomDataSnapshot: DocumentData | undefined;
  user: User | null | undefined;
  updateClock: (player: "white" | "black", timeLeft: string) => void;
  roomDocRef: DocumentReference;
}

const Chessboard: React.FC<IChessboardProps> = ({
  updateNotationBoard,
  whitePlayer,
  blackPlayer,
  roomDataSnapshot,
  user,
  updateClock,
  roomDocRef,
}) => {
  const [rotateBoard, setRotateBoard] = useState(false);

  const { activePlayer, changePlayer } = hooks.useTurnSwitch(roomDataSnapshot, roomDocRef);
  const { positions, updatePositions, upgradePawn } = hooks.usePositions();
  const { selectedFigure, validMoves, selectFigure, deselectFigure } = hooks.useFigure();
  const { enPassantMoves, checkForEnPassant, preventEnPassant } = hooks.useEnPassant();
  const { castling, updateCastlingStatus } = hooks.useCastling();
  const { pawnPromotion, promotePawn, endPawnPromotion } = hooks.usePawnPromotion();
  const { check, mate, updateCheckStatus, checkForMate } = hooks.useCheckMate();
  const positionsRef = useRef(positions);

  useEffect(() => {
    setRotateBoard(user?.uid !== roomDataSnapshot?.white);
  }, [roomDataSnapshot?.white, user?.uid]);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    preventEnPassant(activePlayer);
    updateCheckStatus(activePlayer, positionsRef.current);
    checkForMate(activePlayer, positionsRef.current);
  }, [activePlayer, pawnPromotion, updateCheckStatus, checkForMate, preventEnPassant]);

  useEffect(() => {
    mate && (check[activePlayer] ? alert("checkmate") : alert("stalemate"));
  }, [mate, check, activePlayer]);

  const squareClickHandler = (x: number, y: number, figure?: IFigure) => {
    if (roomDataSnapshot?.[activePlayer] !== user?.uid) return;
    if (mate || pawnPromotion) return;
    if (!selectedFigure && figure && activePlayer === figure.color) {
      selectFigure(figure, positions, enPassantMoves, castling);
      return;
    }
    if (selectedFigure) {
      if (activePlayer === figure?.color) {
        deselectFigure();
        return;
      }
      const moveInfo: [IFigure, IDestination] = [selectedFigure, { x, y, xy: `${x}${y}` }];
      const moveInfo2 = [selectedFigure.xy, `${x}${y}`];
      if (
        isMoveValid(moveInfo, positions, enPassantMoves, castling) &&
        isKingSafe(moveInfo2, positions)
      ) {
        updatePositions(moveInfo, activePlayer, enPassantMoves);

        updateNotationBoard(selectedFigure, x, y, !!positions[`${x}${y}`]);
        updateCastlingStatus(moveInfo);

        if (selectedFigure.name === "pawn" && (y === 8 || y === 1)) {
          figure && selectFigure(figure, positions, enPassantMoves, castling, true);
          promotePawn(`${x}${y}`);
          return;
        }
        checkForEnPassant(moveInfo2, positions);
        changePlayer();
      }
      deselectFigure();
    }
  };

  const promotionClickHandler = (x: number, y: number, figure?: IFigure) => {
    figure && upgradePawn(pawnPromotion, figure.piece);
    deselectFigure();
    endPawnPromotion();
    changePlayer();
  };

  const renderChessboard = () => {
    const chessboard: JSX.Element[] = [];
    xyNotation.map((square, index) => {
      chessboard.push(
        <Square
          key={algebraicNotation[index]}
          x={square[0]}
          y={square[1]}
          notation={algebraicNotation[index]}
          piece={positions[`${square[0]}${square[1]}`]}
          onClick={squareClickHandler}
          selectedFigure={selectedFigure}
          validMoves={validMoves}
          check={check}
          rotated={rotateBoard}
        />
      );
    });
    return chessboard;
  };

  // "#441a03" : "#b5915f"

  const renderPawnPromotions = () => {
    const promotions: JSX.Element[] = [];
    const whiteFigures = [f.WhiteQueen, f.WhiteKnight, f.WhiteRook, f.WhiteBishop];
    const blackFigures = [f.BlackQueen, f.BlackKnight, f.BlackRook, f.BlackBishop];
    const y = activePlayer === "white" ? 0 : 1;
    for (let i = 0; i < 4; i++) {
      promotions.push(
        <Square
          key={i}
          x={0}
          y={0}
          notation={"z0"}
          piece={y < 1 ? whiteFigures[i].src : blackFigures[i].src}
          onClick={promotionClickHandler}
          selectedFigure={undefined}
          validMoves={["00"]}
          check={check}
          rotated={rotateBoard}
        />
      );
    }
    return promotions;
  };

  const whitePlayerInfo = (
    <div>
      <UserInfo user={whitePlayer} />,
      <Clock
        start={activePlayer === "white"}
        player={"white"}
        user={user?.uid === roomDataSnapshot?.white}
        roomDataSnapshot={roomDataSnapshot}
        updateClock={updateClock}
      />
      ,
    </div>
  );

  const blackPlayerInfo = (
    <div>
      <UserInfo user={blackPlayer} />,
      <Clock
        start={activePlayer === "black"}
        player={"black"}
        user={user?.uid === roomDataSnapshot?.black}
        roomDataSnapshot={roomDataSnapshot}
        updateClock={updateClock}
      />
      ,
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        {pawnPromotion ? <div className={styles.promotions}>{renderPawnPromotions()}</div> : null}
        <div className={styles.chessboard}>
          {!rotateBoard ? renderChessboard() : renderChessboard().reverse()}
        </div>
        <div className={styles.usersInfo}>
          {roomDataSnapshot && !rotateBoard ? (
            <>
              {blackPlayerInfo}
              {whitePlayerInfo}
            </>
          ) : (
            <>
              {whitePlayerInfo}
              {blackPlayerInfo}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chessboard;
