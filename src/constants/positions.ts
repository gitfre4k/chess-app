import { xyNotation } from "./square-notation";
import * as figure from "./figures";

const setFigure = (index: number) => {
  switch (index) {
    case 0:
    case 7:
      return figure.BlackRook.src;
    case 1:
    case 6:
      return figure.BlackKnight.src;
    case 2:
    case 5:
      return figure.BlackBishop.src;
    case 3:
      return figure.BlackQueen.src;
    case 4:
      return figure.BlackKing.src;
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
      return figure.BlackPawn.src;
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
      return figure.WhitePawn.src;
    case 56:
    case 63:
      return figure.WhiteRook.src;
    case 57:
    case 62:
      return figure.WhiteKnight.src;
    case 58:
    case 61:
      return figure.WhiteBishop.src;
    case 59:
      return figure.WhiteQueen.src;
    case 60:
      return figure.WhiteKing.src;
  }
};

const boardSetup = (xyNotation: [number, number][]) => {
  const startingPositions: { [key: string]: string | undefined } = {};
  const emptyBoard: { [key: string]: undefined } = {};
  xyNotation.map((square, index) => {
    startingPositions[`${square[0]}${square[1]}`] = setFigure(index);
    emptyBoard[`${square[0]}${square[1]}`] = undefined;
  });
  return { startingPositions, emptyBoard };
};

const { startingPositions, emptyBoard } = boardSetup(xyNotation);

export { startingPositions, emptyBoard };
