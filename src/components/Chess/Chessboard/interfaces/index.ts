export interface IPositions {
  [key: string]: string | undefined;
}

export interface IFigure {
  x: number;
  y: number;
  xy: string;
  name: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "black" | "white";
  piece: string;
}

export interface IDestination {
  x: number;
  y: number;
  xy: string;
}

export interface IEnPassantMoves {
  white: [string[], string] | undefined;
  black: [string[], string] | undefined;
}

export interface ICastling {
  white: {
    short: boolean;
    long: boolean;
  };
  black: {
    short: boolean;
    long: boolean;
  };
}
