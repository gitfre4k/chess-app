import useCountdown from "./useCountdown";

const Clock: React.FC = () => {
  const endTime = new Date().getTime() + 60000 * 2; // 2 min
  const { timeLeft, setTimeLeft } = useCountdown(endTime);

  const minutes = Math.floor(timeLeft / 60000) % 60;
  const seconds = Math.floor(timeLeft / 1000) % 60;

  return <p>{`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}</p>;
};

export default Clock;
