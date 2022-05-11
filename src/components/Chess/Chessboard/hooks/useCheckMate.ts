import isKingSafe from "../helpers/move-validity/isKingSafe";
import isMoveValid from "../helpers/move-validity/isMoveValid";
import { getFigureByXY } from "../helpers/figure-info";

const updateCheckStatus = (
  activePlayer: "white" | "black",
  positions: {
    [key: string]: string | undefined;
  },
  check: {
    white: boolean;
    black: boolean;
  }
) => {
  const newValue = { ...check };
  newValue[activePlayer] = !isKingSafe(["CHECK", activePlayer], positions);
  activePlayer === "white" ? (newValue.black = false) : (newValue.white = false);
  return newValue;
};

const checkForMate = (
  activePlayer: "white" | "black",
  positions: { [key: string]: string | undefined }
) => {
  let isMate = true;
  for (let xy in positions) {
    const figure = getFigureByXY(xy, positions);
    if (!figure || figure.color !== activePlayer) continue;
    for (let ij in positions) {
      const destionation = { x: Number(ij.charAt(0)), y: Number(ij.charAt(1)), xy: ij };
      if (isMoveValid([figure, destionation], positions) && isKingSafe([xy, ij], positions))
        isMate = false;
    }
  }
  return isMate;
};

export { updateCheckStatus, checkForMate };
