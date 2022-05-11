import { getFigureName, getFigureColor, getAxis } from "../helpers/figure-info";

import { IEnPassantMoves, IPositions } from "../interfaces";

const checkForEnPassant = (
  enPassantMoves: IEnPassantMoves,
  moveInfo: string[],
  positions: IPositions
): IEnPassantMoves => {
  const newValue = { ...enPassantMoves };
  if (getFigureName(positions[moveInfo[1]]) === "pawn") {
    const [figure, destination] = getAxis(moveInfo);
    const player = getFigureColor(positions[moveInfo[1]]);
    let i = player === "white" ? 1 : -1;
    let enPassantFigures: string[] = [];
    if (figure.y + 2 * i === destination.y) {
      const possibilities = [
        `${destination.x + 1}${destination.y}`,
        `${destination.x - 1}${destination.y}`,
      ];
      for (let pos of possibilities) {
        if (
          positions[pos] &&
          getFigureName(positions[pos]) === "pawn" &&
          getFigureColor(positions[pos]) !== player
        ) {
          enPassantFigures.push(pos);
        }
      }
      const enPassantValue: [string[], string] = [
        enPassantFigures,
        `${figure.x}${figure.y + 1 * i}`,
      ];

      i > 0 ? (newValue.black = enPassantValue) : (newValue.white = enPassantValue);
    }
  }
  return newValue;
};

const preventEnPassant = (enPassantMoves: IEnPassantMoves, activePlayer: "white" | "black") => {
  const newValue = { ...enPassantMoves };
  activePlayer === "white" ? (newValue.black = []) : (newValue.white = []);
  return newValue;
};
export { checkForEnPassant, preventEnPassant };
