import { useState, useCallback } from "react";

import isKingSafe from "../helpers/move-validity/isKingSafe";
import isMoveValid from "../helpers/move-validity/isMoveValid";
import { getFigureByXY } from "../helpers/figure-info";

const useCheckMate = () => {
  const [check, setCheck] = useState({ white: false, black: false });
  const [mate, setMate] = useState(false);

  const updateCheckStatus = useCallback(
    (
      activePlayer: "white" | "black",
      positions: {
        [key: string]: string | undefined;
      }
    ) =>
      setCheck((prevValue) => {
        const newValue = { ...prevValue };
        newValue[activePlayer] = !isKingSafe(["CHECK", activePlayer], positions);
        activePlayer === "white" ? (newValue.black = false) : (newValue.white = false);
        return newValue;
      }),
    []
  );

  const checkForMate = useCallback(
    (activePlayer: "white" | "black", positions: { [key: string]: string | undefined }) => {
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
      isMate && setMate(true);
    },
    []
  );

  return { check, mate, updateCheckStatus, checkForMate };
};

export default useCheckMate;
