import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { startingPositions, emptyBoard } from "../../../../constants/positions";

import { IFigure, IEnPassantMoves, IDestination } from "../interfaces";

const usePositions = () => {
  const [positions, setPositions] = useState(startingPositions);
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomSnapshot] = useDocumentData(roomDocRef);

  useEffect(() => {
    if (roomSnapshot) {
      const newPositions = JSON.parse(roomSnapshot.positions);
      setPositions({ ...emptyBoard, ...newPositions });
    }
  }, [roomSnapshot]);

  const updatePositions = (
    moveInfo: [IFigure, IDestination],
    activePlayer: "white" | "black",
    enPassantMoves: IEnPassantMoves
  ) => {
    const [figure, destination] = moveInfo;

    const newPositions = { ...positions };
    if (
      enPassantMoves[activePlayer][0]?.includes(figure.xy) &&
      enPassantMoves[activePlayer][1] === destination.xy
    ) {
      const xAxis = destination.x.toString();
      const yAxis = destination.y - (activePlayer === "white" ? 1 : -1);
      newPositions[xAxis + `${yAxis}`] = undefined;
    }
    if (figure.name === "king" && Math.abs(figure.x - destination.x) === 2) {
      const xAxis = destination.x === 3 ? "4" : "6";
      const yAxis = figure.y;
      newPositions[xAxis + yAxis] = newPositions[(xAxis === "4" ? "1" : "8") + yAxis];
      newPositions[(xAxis === "4" ? "1" : "8") + yAxis] = undefined;
    }
    newPositions[destination.xy] = newPositions[figure.xy];
    newPositions[figure.xy] = undefined;

    updateDoc(roomDocRef, {
      positions: JSON.stringify(newPositions),
    });
  };

  const upgradePawn = (pawn: string, figure: string) => {
    const newPositions = { ...positions };
    newPositions[pawn] = figure;

    updateDoc(roomDocRef, {
      positions: JSON.stringify(newPositions),
    });
  };

  return { positions, updatePositions, upgradePawn };
};

export default usePositions;
