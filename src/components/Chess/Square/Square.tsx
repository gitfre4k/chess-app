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
      {piece && <Image src={piece} alt="Chess figure" width={90} height={90} />}
      {y === (rotated ? 8 : 1) ? (
        <div className={styles.notationX}>
          <p>{one2a(x).toUpperCase()}</p>
        </div>
      ) : null}
      {x === (rotated ? 8 : 1) ? (
        <div className={styles.notationY}>
          <p>{y}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Square;
