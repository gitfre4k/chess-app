import isMoveValid from "../components/Chess/Chessboard/helpers/move-validity/isMoveValid";
import isKingSafe from "../components/Chess/Chessboard/helpers/move-validity/isKingSafe";
import {
  getFigureName,
  getFigureColor,
  getAxis,
  getFigureByXY,
} from "../components/Chess/Chessboard/helpers/figure-info";

import { IFigure, IDestination, IEnPassantMoves, ICastling, IPositions } from "../interfaces";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateCastlingStatus = (
  moveInfo: [IFigure, IDestination],
  castling: {
    white: {
      short: boolean;
      long: boolean;
    };
    black: {
      short: boolean;
      long: boolean;
    };
  }
) => {
  const newValue = { ...castling };
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
    }
  }

  return newValue;
};

export const checkForEnPassant = (
  enPassantMoves: IEnPassantMoves,
  moveInfo: string[],
  positions: IPositions
): IEnPassantMoves => {
  const newValue = { ...enPassantMoves };
  if (getFigureName(positions[moveInfo[1]]) === "pawn") {
    const [figure, destination] = getAxis(moveInfo);
    const player = getFigureColor(positions[moveInfo[1]]);
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

      i > 0 ? (newValue.black = enPassantValue) : (newValue.white = enPassantValue);
    }
  }
  return newValue;
};

export const preventEnPassant = (
  enPassantMoves: IEnPassantMoves,
  activePlayer: "white" | "black"
) => {
  const newValue = { ...enPassantMoves };
  activePlayer === "white" ? (newValue.black = []) : (newValue.white = []);
  return newValue;
};

export const getValidMoves = (
  figure: IFigure,
  positions: IPositions,
  enPassantMoves: IEnPassantMoves,
  castling: ICastling,
  promotion?: boolean
) => {
  if (promotion) {
    return [];
  }
  const allValidMoves: string[] = [];
  for (const [key] of Object.entries(positions)) {
    const moveInfo = [figure.xy, `${key}`];
    const moveInfo1: [IFigure, IDestination] = [
      figure,
      { x: Number(key.charAt(0)), y: Number(key.charAt(1)), xy: key },
    ];
    if (
      isMoveValid(moveInfo1, positions, enPassantMoves, castling) &&
      isKingSafe(moveInfo, positions)
    )
      allValidMoves.push(key);
  }
  return allValidMoves;
};

export const getNewPositions = (
  moveInfo: [IFigure, IDestination],
  activePlayer: "white" | "black",
  enPassantMoves: IEnPassantMoves,
  positions: {
    [key: string]: string | undefined;
  }
) => {
  const newPositions = { ...positions };
  const [figure, destination] = moveInfo;
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

  console.log(figure.name, destination.xy);

  return { ...newPositions };
};

const getFigureNotation = (figureName: string) => {
  switch (figureName) {
    case "king":
      return "K";
    case "queen":
      return "Q";
    case "bishop":
      return "B";
    case "knight":
      return "N";
    case "rook":
      return "R";
    default:
      return "";
  }
};

export const upgradePawn = (
  pawn: string,
  figure: string,
  positions: {
    [key: string]: string | undefined;
  }
) => {
  const newPositions = { ...positions };
  newPositions[pawn] = figure;

  return { ...newPositions };
};

export const getNewNotation = (
  moveInfo: [IFigure, IDestination],
  captured: boolean,
  check: boolean,
  mate: boolean
) => {
  const [figure, destination] = moveInfo;
  const figureNotation = getFigureNotation(figure.name);
  const x = ["", "a", "b", "c", "d", "e", "f", "g", "h"][destination.x];
  const file = ["", "a", "b", "c", "d", "e", "f", "g", "h"][figure.x];

  if (figure.name === "pawn" && (captured || figure.x !== destination.x))
    return `${file}x${x}${destination.y}${check ? "+" : ""}`;
  if (figure.name === "king" && figure.x === 5) {
    if (destination.x === 3) return "0-0-0";
    if (destination.x === 7) return "0-0";
  }

  return `${figureNotation}${captured ? "x" : ""}${x}${destination.y}${
    check ? (mate ? "#" : "+") : ""
  }`;
};

export const updateCheckStatus = (
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

export const checkForMate = (
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

export const uploadToFirebase = (type: string, value: any, roomID: string) => {
  let newState;
  switch (type) {
    case "activePlayer":
      newState = { activePlayer: value };
      break;
    case "positions":
      newState = { positions: JSON.stringify(value) };
      break;
    case "enPassantMoves":
      newState = { enPassantMoves: JSON.stringify(value) };
      break;
    case "notations":
      newState = { notations: value };
      break;
  }
  updateDoc(doc(db, "rooms", roomID), newState);
};
