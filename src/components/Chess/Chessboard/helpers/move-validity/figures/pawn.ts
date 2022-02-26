import { IFigure, IDestination, IPositions, IEnPassantMoves } from "../../../interfaces";

const pawnValidity = (
  moveInfo: [IFigure, IDestination],
  positions: IPositions,
  enPassantMoves?: IEnPassantMoves
) => {
  const [figure, destination] = moveInfo;
  const player = figure.color;
  let i = player === "white" ? 1 : -1;
  if (
    enPassantMoves &&
    enPassantMoves[player]?.[0].includes(figure.xy) &&
    enPassantMoves[player]?.[1] === destination.xy
  )
    return true;
  if (!positions[destination.xy] && figure.x === destination.x) {
    if (figure.y + 1 * i === destination.y) return true;
    if (figure.y + 2 * i === destination.y && !positions[`${figure.x}${figure.y + 1 * i}`])
      if ((i === 1 && figure.y === 2) || (i === -1 && figure.y === 7)) return true;
  }
  if (positions[destination.xy] && figure.y + 1 * i === destination.y) {
    if (figure.x + 1 === destination.x || figure.x - 1 === destination.x) return true;
  }
  return false;
};

export default pawnValidity;
