import { IFigure, IDestination } from "../interfaces";

const updateCastlingStatus = (
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

export { updateCastlingStatus };
