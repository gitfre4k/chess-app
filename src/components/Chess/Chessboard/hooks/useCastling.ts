import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

import { IFigure, IDestination } from "../interfaces";

const useCastling = () => {
  const [castling, setCastling] = useState({
    white: { short: true, long: true },
    black: { short: true, long: true },
  });
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomSnapshot] = useDocumentData(roomDocRef);

  useEffect(() => {
    if (roomSnapshot) setCastling(JSON.parse(roomSnapshot.castling));
  }, [roomSnapshot]);

  const updateCastlingStatus = (moveInfo: [IFigure, IDestination]) => {
    const [figure, destination] = moveInfo;
    const castlingFigures: { [key: string]: string } = {
      whiteKing: "51",
      blackKing: "58",
      whiteRookShort: "81",
      whiteRookLong: "11",
      blackRookShort: "88",
      blackRookLong: "18",
    };

    for (const defaultPosition in castlingFigures) {
      if ([figure.xy, destination.xy].includes(castlingFigures[defaultPosition])) {
        const newValue = { ...castling };
        switch (castlingFigures[defaultPosition]) {
          case "51":
            newValue.white.short = false;
            newValue.white.long = false;
            break;
          case "58":
            newValue.black.short = false;
            newValue.black.long = false;
            break;
          case "81":
            newValue.white.short = false;
            break;
          case "11":
            newValue.white.long = false;
            break;
          case "88":
            newValue.black.short = false;
            break;
          case "18":
            newValue.black.long = false;
            break;
        }
        updateDoc(roomDocRef, {
          castling: JSON.stringify(newValue),
        });
      }
    }
  };

  return { castling, updateCastlingStatus };
};

export default useCastling;
