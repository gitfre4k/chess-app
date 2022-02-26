import Image from "next/image";
import { getSquareClass, getFigure } from "./helpers";

import { ISquareProps } from "./interfaces";

const Square: React.FC<ISquareProps> = ({
  squareColor,
  x,
  y,
  piece,
  onClick,
  selectedFigure,
  validMoves,
  check,
}) => {
  const squareClass = getSquareClass(x, y, validMoves, check, piece);
  const figure = getFigure(x, y, piece);

  return (
    <div
      className={squareClass}
      style={
        selectedFigure?.x === x && selectedFigure.y === y
          ? { background: "green" }
          : { background: squareColor }
      }
      onClick={() => onClick(x, y, figure)}
    >
      {piece && <Image src={piece} alt="Chess figure" width="70px" height="70px" />}
    </div>
  );
};

export default Square;
