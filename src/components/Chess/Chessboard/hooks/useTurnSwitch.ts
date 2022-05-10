import { useState } from "react";

const useTurnSwitch = () => {
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");

  const changePlayer = () => {
    setActivePlayer((prevValue) => (prevValue === "white" ? "black" : "white"));
  };

  return { activePlayer, changePlayer };
};

export default useTurnSwitch;
