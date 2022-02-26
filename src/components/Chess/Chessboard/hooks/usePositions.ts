import { useState } from "react";

import startingPositions from "../constants/starting-positions";

import { IFigure, IEnPassantMoves, IDestination } from "../interfaces";

const usePositions = () => {
  const [positions, setPositions] = useState(startingPositions);

  const updatePositions = (
    moveInfo: [IFigure, IDestination],
    activePlayer: "white" | "black",
    enPassantMoves: IEnPassantMoves
  ) => {
    const [figure, destination] = moveInfo;

    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      if (
        enPassantMoves[activePlayer]?.[0].includes(figure.xy) &&
        enPassantMoves[activePlayer]?.[1] === destination.xy
      ) {
        const xAxis = destination.x.toString();
        const yAxis = destination.y - (activePlayer === "white" ? 1 : -1);
        newPositions[xAxis + `${yAxis}`] = undefined;
      }
      if (figure.name === "king" && Math.abs(figure.x - destination.x) === 2) {
        const xAxis = destination.x === 3 ? "4" : "6";
        const yAxis = figure.y;
        newPositions[xAxis + yAxis] = newPositions[(xAxis === "4" ? "1" : "8") + yAxis];
        newPositions[(xAxis === "4" ? "1" : "8") + yAxis] = undefined;
      }
      newPositions[destination.xy] = newPositions[figure.xy];
      newPositions[figure.xy] = undefined;
      return newPositions;
    });
  };

  const upgradePawn = (pawn: string, figure: string) => {
    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      newPositions[pawn] = figure;
      return newPositions;
    });
  };

  return { positions, updatePositions, upgradePawn };
};

export default usePositions;
