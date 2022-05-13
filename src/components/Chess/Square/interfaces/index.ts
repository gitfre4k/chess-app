import { IFigure } from "../../../../interfaces";

export interface ISquareProps {
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
  rotated: boolean;
}

export interface ICheck {
  white: boolean;
  black: boolean;
}
