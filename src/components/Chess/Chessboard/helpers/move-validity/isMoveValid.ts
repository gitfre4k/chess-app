import { getFigureColor } from "../figure-info";
import pawnValidity from "./figures/pawn";
import rookValidity from "./figures/rook";
import knightValidity from "./figures/knight";
import bishopValidity from "./figures/bishop";
import queenValidity from "./figures/queen";
import kingValidity from "./figures/king";

import {
  IFigure,
  IDestination,
  IPositions,
  IEnPassantMoves,
  ICastling,
} from "../../../../../interfaces";

const isMoveValid = (
  moveInfo: [IFigure, IDestination],
  positions: IPositions,
  enPassantMoves?: IEnPassantMoves,
  castling?: ICastling
) => {
  const [figure, destination] = moveInfo;
  if (figure.color === getFigureColor(positions[destination.xy])) return false;
  switch (figure.name) {
    case "pawn":
      return pawnValidity(moveInfo, positions, enPassantMoves);
    case "rook":
      return rookValidity(moveInfo, positions);
    case "knight":
      return knightValidity(moveInfo);
    case "bishop":
      return bishopValidity(moveInfo, positions);
    case "queen":
      return queenValidity(moveInfo, positions);
    case "king":
      return kingValidity(moveInfo, positions, castling);
    default:
      return false;
  }
};

export default isMoveValid;
