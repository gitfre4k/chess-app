import { IFigure } from "../../Chessboard/interfaces";

export interface ISquareProps {
  squareColor: string;
  x: number;
  y: number;
  notation: string;
  piece?: string;
  onClick: (x: number, y: number, figure?: IFigure) => void;
  selectedFigure?: IFigure;
  validMoves: string[];
  check: {
    white: boolean;
    black: boolean;
  };
}

export interface ICheck {
  white: boolean;
  black: boolean;
}
