import Image from "next/image";
import { getSquareClass, getFigure } from "./helpers";
import { one2a } from "../../../constants/square-notation";

import styles from "../../../styles/components/Square.module.scss";
import { ISquareProps } from "./interfaces";

const Square: React.FC<ISquareProps> = ({
  x,
  y,
  piece,
  onClick,
  selectedFigure,
  validMoves,
  check,
  rotated,
}) => {
  const squareClass = getSquareClass(x, y, validMoves, check, piece);
  const figure = getFigure(x, y, piece);

  return (
    <div
      className={squareClass}
      style={
        selectedFigure?.x === x && selectedFigure.y === y ? { background: "green" } : undefined
      }
      onClick={() => onClick(x, y, figure)}
    >
      {piece && <Image src={piece} alt="Chess figure" width="70px" height="70px" />}
      {y === (rotated ? 8 : 1) ? (
        <p className={styles.notationX}>{one2a(x).toUpperCase()}</p>
      ) : null}
      {x === (rotated ? 8 : 1) ? <p className={styles.notationY}>{y}</p> : null}
    </div>
  );
};

export default Square;
