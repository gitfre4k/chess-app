import { getFigureName } from "../../Chessboard/helpers/figure-info";
import styles from "../Square.module.css";

import { ICheck } from "../interfaces";

const getSquareClass = (
  x: number,
  y: number,
  validMoves: string[],
  check: ICheck,
  piece: string | undefined
) => {
  let squareClass = styles.square;
  if (validMoves.includes(`${x}${y}`)) squareClass = squareClass + " " + styles.valid;
  if (
    (check.white && piece?.includes("WhiteKing")) ||
    (check.black && piece?.includes("BlackKing"))
  )
    squareClass = squareClass + " " + styles.check;
  return squareClass;
};

const getFigure = (x: number, y: number, piece?: string) => {
  if (!piece) return undefined;
  const color: "white" | "black" = piece.includes("White") ? "white" : "black";
  const name: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | undefined =
    getFigureName(piece);
  if (!name) return undefined;
  const figureInfo = {
    x,
    y,
    xy: `${x}${y}`,
    name,
    color,
    piece,
  };
  return figureInfo;
};

export { getSquareClass, getFigure };
