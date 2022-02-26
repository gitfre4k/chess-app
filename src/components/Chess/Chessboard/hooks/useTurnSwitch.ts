import { useState } from "react";

const useTurnSwitch = () => {
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");

  const changePlayer = () => {
    setActivePlayer((prevValue) => {
      if (prevValue === "white") return "black";
      return "white";
    });
  };

  return { activePlayer, changePlayer };
};

export default useTurnSwitch;
