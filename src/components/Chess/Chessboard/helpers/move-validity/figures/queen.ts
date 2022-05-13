import rookValidity from "./rook";
import bishopValidity from "./bishop";

import { IFigure, IDestination, IPositions } from "../../../../../../interfaces";

const queenValidity = (moveInfo: [IFigure, IDestination], positions: IPositions) => {
  if (rookValidity(moveInfo, positions) || bishopValidity(moveInfo, positions)) return true;
  return false;
};

export default queenValidity;
