import { IFigure, IDestination, IPositions } from "../../../../../interfaces";

const isPathFree = (moveInfo: [IFigure, IDestination], positions: IPositions) => {
  const [figure, destination] = moveInfo;

  if (figure.x === destination.x) {
    for (let i = 1; i < Math.abs(figure.y - destination.y); i++) {
      if (positions[`${figure.x}${Math.min(figure.y, destination.y) + i}`]) return false;
    }
  }
  if (figure.y === destination.y) {
    for (let i = 1; i < Math.abs(figure.x - destination.x); i++) {
      if (positions[`${Math.min(figure.x, destination.x) + i}${figure.y}`]) return false;
    }
  }

  if (Math.abs(figure.x - destination.x) === Math.abs(figure.y - destination.y)) {
    for (let i = 1; i < Math.abs(figure.x - destination.x); i++) {
      if (
        (figure.x > destination.x && figure.y > destination.y) ||
        (figure.x < destination.x && figure.y < destination.y)
      ) {
        if (
          positions[
            `${Math.min(figure.x, destination.x) + i}${Math.min(figure.y, destination.y) + i}`
          ]
        )
          return false;
      }
      if (figure.x > destination.x && figure.y < destination.y) {
        if (positions[`${figure.x - i}${figure.y + i}`]) return false;
      }
      if (figure.x < destination.x && figure.y > destination.y) {
        if (positions[`${figure.x + i}${figure.y - i}`]) return false;
      }
    }
  }
  return true;
};

export default isPathFree;
