import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { getFigureName, getFigureColor, getAxis } from "../helpers/figure-info";

import { IEnPassantMoves, IPositions } from "../interfaces";

const useEnPassant = () => {
  const [enPassantMoves, setEnPassantMoves] = useState<IEnPassantMoves>({
    white: [],
    black: [],
  });
  const router = useRouter();
  const roomDoc = doc(db, "rooms", `${router.query.id}`);
  const [roomSnapshot] = useDocumentData(roomDoc);
  const enPassantMovesRef = useRef(enPassantMoves);
  const roomDocRef = useRef(roomDoc);

  useEffect(() => {
    if (roomSnapshot)
      setEnPassantMoves((prevValue) => {
        const newValue = JSON.parse(roomSnapshot.enPassant);
        enPassantMovesRef.current = { ...prevValue, ...newValue };
        return { ...prevValue, ...newValue };
      });
  }, [roomSnapshot]);

  const checkForEnPassant = (moveInfo: string[], positions: IPositions) => {
    if (getFigureName(positions[moveInfo[0]]) === "pawn") {
      const [figure, destination] = getAxis(moveInfo);
      const player = getFigureColor(positions[moveInfo[0]]);
      let i = player === "white" ? 1 : -1;
      let enPassantFigures: string[] = [];
      if (figure.y + 2 * i === destination.y) {
        const possibilities = [
          `${destination.x + 1}${destination.y}`,
          `${destination.x - 1}${destination.y}`,
        ];
        for (let pos of possibilities) {
          if (
            positions[pos] &&
            getFigureName(positions[pos]) === "pawn" &&
            getFigureColor(positions[pos]) !== player
          ) {
            enPassantFigures.push(pos);
          }
        }
        const enPassantValue: [string[], string] = [
          enPassantFigures,
          `${figure.x}${figure.y + 1 * i}`,
        ];

        const newValue = { ...enPassantMoves };
        i > 0 ? (newValue.black = enPassantValue) : (newValue.white = enPassantValue);
        updateDoc(roomDoc, { enPassant: JSON.stringify(newValue) });
      }
    }
  };

  const preventEnPassant = useCallback((activePlayer: "white" | "black") => {
    const newValue = { ...enPassantMovesRef.current };
    activePlayer === "white" ? (newValue.black = []) : (newValue.white = []);
    updateDoc(roomDocRef.current, { enPassant: JSON.stringify(newValue) });
  }, []);

  return { enPassantMoves, checkForEnPassant, preventEnPassant };
};

export default useEnPassant;
