import isPathFree from "../isPathFree";
import isKingSafe from "../isKingSafe";

import { IFigure, IDestination, IPositions, ICastling } from "../../../interfaces";

const kingValidity = (
  moveInfo: [IFigure, IDestination],
  positions: IPositions,
  castling?: ICastling
) => {
  const [figure, destination] = moveInfo;
  if (figure.x === destination.x && Math.abs(figure.y - destination.y) === 1) return true;
  if (figure.y === destination.y && Math.abs(figure.x - destination.x) === 1) return true;
  if (Math.abs(figure.x - destination.x) === 1 && Math.abs(figure.y - destination.y) === 1)
    return true;
  const activePlayer = figure.color;
  if (castling && isKingSafe(["CHECK", activePlayer], positions)) {
    const i = activePlayer === "white" ? 1 : 8;
    if (destination.y === i) {
      if (
        castling[activePlayer].long &&
        destination.x === 3 &&
        isPathFree([figure, { x: 1, y: i, xy: "1" + i }], positions) &&
        isKingSafe([figure.xy, "4" + i], positions)
      )
        return true;
      if (
        castling[activePlayer].short &&
        destination.x === 7 &&
        isPathFree([figure, { x: 8, y: i, xy: "8" + i }], positions) &&
        isKingSafe([figure.xy, "6" + i], positions)
      )
        return true;
    }
  }
  return false;
};

export default kingValidity;
