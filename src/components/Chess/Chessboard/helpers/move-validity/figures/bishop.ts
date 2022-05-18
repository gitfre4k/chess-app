import isPathFree from "../isPathFree";

import { IFigure, IDestination, IPositions } from "../../../../../../interfaces";

const bishopValidity = (moveInfo: [IFigure, IDestination], positions: IPositions) => {
  const [figure, destination] = moveInfo;
  const xGap = Math.abs(figure.x - destination.x);
  const yGap = Math.abs(figure.y - destination.y);
  if (xGap === yGap) return isPathFree(moveInfo, positions);
  return false;
};

export default bishopValidity;
