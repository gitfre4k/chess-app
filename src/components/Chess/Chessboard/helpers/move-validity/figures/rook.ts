import isPathFree from "../isPathFree";

import { IFigure, IDestination, IPositions } from "../../../../../../interfaces";

const rookValidity = (moveInfo: [IFigure, IDestination], positions: IPositions) => {
  const [figure, destination] = moveInfo;
  if (figure.x === destination.x || figure.y === destination.y)
    return isPathFree(moveInfo, positions);
  return false;
};

export default rookValidity;
