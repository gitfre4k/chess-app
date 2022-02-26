import { useState } from "react";

import { getFigureName, getFigureColor, getAxis } from "../helpers/figure-info";

import { IEnPassantMoves, IPositions } from "../interfaces";

const useEnPassant = () => {
  const [enPassantMoves, setEnPassantMoves] = useState<IEnPassantMoves>({
    white: undefined,
    black: undefined,
  });

  const checkForEnPassant = (moveInfo: string[], positions: IPositions) => {
    if (getFigureName(positions[moveInfo[0]]) === "pawn") {
      const [figure, destination] = getAxis(moveInfo);
      const player = getFigureColor(positions[moveInfo[0]]);
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
        setEnPassantMoves((prevValue) => {
          const newValue = { ...prevValue };
          i > 0 ? (newValue.black = enPassantValue) : (newValue.white = enPassantValue);
          return newValue;
        });
      }
    }
  };

  const preventEnPassant = (activePlayer: "white" | "black") => {
    setEnPassantMoves((prevValue) => {
      const newValue = { ...prevValue };
      activePlayer === "white" ? (newValue.black = undefined) : (newValue.white = undefined);
      return newValue;
    });
  };

  return { enPassantMoves, checkForEnPassant, preventEnPassant };
};

export default useEnPassant;
