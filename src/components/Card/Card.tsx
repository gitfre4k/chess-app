import styles from "../../styles/components/Card.module.scss";

interface ICardProps {
  name: string;
  onClick: () => void;
}

const Card: React.FC<ICardProps> = ({ name, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      {name}
    </div>
  );
};

export default Card;
