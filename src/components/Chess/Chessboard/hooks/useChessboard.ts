import { useState } from "react";

const useChessboard = () => {
  const [rotateBoard, setRotateBoard] = useState(false);

  const rotateChessboard = () => {
    setRotateBoard((prevValue) => !prevValue);
  };

  return { rotateBoard, rotateChessboard };
};

export default useChessboard;
