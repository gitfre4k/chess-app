import { useEffect } from "react";

import Square from "../Square";
import { xyNotation, algebraicNotation } from "../../../constants/square-notation";
import * as f from "../../../constants/figures";
import isMoveValid from "./helpers/move-validity/isMoveValid";
import isKingSafe from "./helpers/move-validity/isKingSafe";

import { IFigure, IDestination, ChessState, ChessAction } from "../../../interfaces";
import { Dispatch } from "react";

import styles from "../../../styles/components/Chessboard.module.scss";

interface ChessboardProps {
  state: ChessState;
  dispatch: Dispatch<ChessAction>;
}

const Chessboard: React.FC<ChessboardProps> = ({ state, dispatch }) => {
  const {
    activePlayer,
    positions,
    selectedFigure,
    validMoves,
    enPassantMoves,
    castling,
    pawnPromotion,
    check,
    mate,
    rotateBoard,
  } = state;

  useEffect(() => {
    dispatch({ type: "PREVENT_EN_PASSANT" });
    dispatch({ type: "UPDATE_CHECK_STATUS" });
    dispatch({ type: "CHECK_FOR_MATE" });
  }, [activePlayer, pawnPromotion, dispatch]);

  useEffect(() => {
    mate && (check[activePlayer] ? alert("checkmate") : alert("stalemate"));
  }, [mate, check, activePlayer]);

  const squareClickHandler = (x: number, y: number, figure?: IFigure) => {
    if (mate || pawnPromotion) return;
    if (!selectedFigure && figure && activePlayer === figure.color) {
      dispatch({
        type: "SELECT_FIGURE",
        payload: { figure, promotion: false },
      });
      return;
    }
    if (selectedFigure) {
      if (activePlayer === figure?.color) {
        dispatch({ type: "DESELECT_FIGURE" });
        return;
      }
      const moveInfo: [IFigure, IDestination] = [selectedFigure, { x, y, xy: `${x}${y}` }];
      const moveInfo2 = [selectedFigure.xy, `${x}${y}`];
      if (
        isMoveValid(moveInfo, positions, enPassantMoves, castling) &&
        isKingSafe(moveInfo2, positions)
      ) {
        dispatch({ type: "UPDATE_POSITIONS", payload: { moveInfo } });
        dispatch({ type: "UPDATE_CASTLING_STATUS", payload: { moveInfo } });
        if (selectedFigure.name === "pawn" && (y === 8 || y === 1)) {
          figure &&
            dispatch({
              type: "SELECT_FIGURE",
              payload: { figure, promotion: true },
            });
          dispatch({ type: "PROMOTE_PAWN", payload: `${x}${y}` });
          return;
        }
        dispatch({ type: "CHECK_FOR_EN_PASSANT", payload: moveInfo2 });
        dispatch({ type: "CHANGE_PLAYER", payload: activePlayer === "white" ? "black" : "white" });
      }
      dispatch({ type: "DESELECT_FIGURE" });
    }
  };

  const promotionClickHandler = (x: number, y: number, figure?: IFigure) => {
    figure && dispatch({ type: "UPGRADE_PAWN", payload: { figure: figure.piece } });
    dispatch({ type: "DESELECT_FIGURE" });
    dispatch({ type: "END_PAWN_PROMOTION" });
    dispatch({ type: "CHANGE_PLAYER", payload: activePlayer === "white" ? "black" : "white" });
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

  return (
    <>
      <div className={styles.container}>
        {pawnPromotion ? <div className={styles.promotions}>{renderPawnPromotions()}</div> : null}
        <div className={styles.chessboard}>
          {!rotateBoard ? renderChessboard() : renderChessboard().reverse()}
        </div>
      </div>
    </>
  );
};

export default Chessboard;
