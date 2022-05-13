import { IFigure } from "../../../../interfaces";

const getFigureColor = (figure: string | undefined) => {
  if (!figure) return undefined;
  if (figure.includes("White")) return "white";
  return "black";
};

const getFigureName = (piece: string | undefined) => {
  if (!piece) return undefined;
  const pieces = ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"];
  for (let i = 0; i < 6; i++) {
    if (piece.includes(pieces[i])) {
      switch (i) {
        case 0:
          return "pawn";
        case 1:
          return "rook";
        case 2:
          return "knight";
        case 3:
          return "bishop";
        case 4:
          return "queen";
        case 5:
          return "king";
      }
    }
  }
  return undefined;
};

const getFigureByXY = (xy: string, positions: { [key: string]: string | undefined }) => {
  const x = Number(xy.charAt(0));
  const y = Number(xy.charAt(1));
  const name = getFigureName(positions[xy]);
  const color = getFigureColor(positions[xy]);
  const piece = positions[xy];
  if (!name || !color || !piece) return undefined;
  const figure: IFigure = { x, y, xy, name, color, piece };
  return figure;
};

const getAxis = (moveInfo: string[]) => {
  const figure = {
    x: Number(moveInfo[0].charAt(0)),
    y: Number(moveInfo[0].charAt(1)),
  };
  const destination = {
    x: Number(moveInfo[1].charAt(0)),
    y: Number(moveInfo[1].charAt(1)),
  };
  return [figure, destination];
};

export { getFigureColor, getFigureName, getFigureByXY, getAxis };
