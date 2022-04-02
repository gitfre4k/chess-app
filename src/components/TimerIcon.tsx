import timer from "../assets/images/timer.png";
import Image from "next/image";

const TimerIcon = () => {
  return <Image src={timer} objectFit="contain" alt="timer icon" />;
};

export default TimerIcon;
