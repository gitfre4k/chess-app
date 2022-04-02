import { useState, useEffect } from "react";

import { updateDoc } from "firebase/firestore";
import { one2a } from "../constants/square-notation";

import { IFigure } from "../components/Chess/Chessboard/interfaces";
import { DocumentReference } from "firebase/firestore";

const useNotationBoard = (notations: any, roomDocRef: DocumentReference) => {
  const [notation, setNotation] = useState<any[]>([]);

  useEffect(() => {
    if (notations) {
      setNotation(notations);
    }
  }, [notations]);

  const figureNotation = (figure: IFigure) => {
    switch (figure.name) {
      case "bishop":
        return "B";
      case "knight":
        return "N";
      case "rook":
        return "R";
      case "queen":
        return "Q";
      case "king":
        return "K";
      default:
        return "";
    }
  };

  const updateNotationBoard = (figure: IFigure, x: number, y: number, captured: boolean) => {
    if (figure.name === "king" && Math.abs(figure.x - x) === 2) {
      setNotation((prevValue) => [...prevValue, x === 7 ? "0-0" : "0-0-0"]);
      return;
    }
    const figureName =
      captured && figure.name === "pawn" ? one2a(figure.x) : figureNotation(figure);
    const squareNotation = `${one2a(x)}${y}`;

    const move = figureName + (captured ? "x" : "") + squareNotation;
    setNotation((prevValue) => {
      if (figure.color === "white") {
        updateDoc(roomDocRef, {
          notation: [...prevValue, move],
        });
        return [...prevValue, move];
      }
      const newValue = [...prevValue];
      newValue[newValue.length - 1] = newValue[newValue.length - 1] + " " + move;
      updateDoc(roomDocRef, {
        notation: newValue,
      });
      return newValue;
    });
  };

  return { notation, updateNotationBoard };
};

export default useNotationBoard;
