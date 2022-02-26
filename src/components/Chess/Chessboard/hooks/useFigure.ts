import { useState } from "react";
import isMoveValid from "../helpers/move-validity/isMoveValid";
import isKingSafe from "../helpers/move-validity/isKingSafe";

import { IFigure, IDestination, IEnPassantMoves, ICastling, IPositions } from "../interfaces";

const useFigure = () => {
  const [selectedFigure, setSelectedFigure] = useState<IFigure | undefined>(undefined);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const selectFigure = (
    figure: IFigure,
    positions: IPositions,
    enPassantMoves: IEnPassantMoves,
    castling: ICastling,
    promotion?: boolean
  ) => {
    setSelectedFigure(figure);
    if (promotion) {
      setValidMoves([]);
      return;
    }
    const allValidMoves: string[] = [];
    for (const [key] of Object.entries(positions)) {
      const moveInfo = [figure.xy, `${key}`];
      const moveInfo1: [IFigure, IDestination] = [
        figure,
        { x: Number(key.charAt(0)), y: Number(key.charAt(1)), xy: key },
      ];
      if (
        isMoveValid(moveInfo1, positions, enPassantMoves, castling) &&
        isKingSafe(moveInfo, positions)
      )
        allValidMoves.push(key);
    }
    setValidMoves(allValidMoves);
  };

  const deselectFigure = () => {
    setSelectedFigure(undefined);
    setValidMoves([]);
  };

  return { selectedFigure, validMoves, selectFigure, deselectFigure };
};

export default useFigure;
