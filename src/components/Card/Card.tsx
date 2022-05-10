import styles from "../../styles/components/Card.module.scss";

interface ICardProps {
  name: string;
  action: () => void;
}

const Card: React.FC<ICardProps> = ({ name, action }) => {
  return (
    <div onClick={action} className={styles.container}>
      <p>{name}</p>
    </div>
  );
};

export default Card;
