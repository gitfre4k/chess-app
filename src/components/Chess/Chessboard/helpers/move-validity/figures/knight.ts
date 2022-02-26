import { IFigure, IDestination } from "../../../interfaces";

const knightValidity = (moveInfo: [IFigure, IDestination]) => {
  const [figure, destination] = moveInfo;
  const xGap = Math.abs(figure.x - destination.x);
  const yGap = Math.abs(figure.y - destination.y);
  if ((xGap === 1 && yGap === 2) || (xGap === 2 && yGap === 1)) return true;
  return false;
};

export default knightValidity;
