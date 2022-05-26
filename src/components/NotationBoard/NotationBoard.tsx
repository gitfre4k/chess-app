import styles from "../../styles/components/NotationBoard.module.scss";

interface NotationBoardProps {
  notations: string[];
}

const NotationBoard: React.FC<NotationBoardProps> = ({ notations }) => {
  const groupedNotations = [];
  for (let i = 0; i < notations.length; i += 2) {
    groupedNotations.push([notations[i], notations[i + 1]]);
  }

  return (
    <div className={styles.notations}>
      {groupedNotations.map((notation, index) => (
        <p key={index} className={styles.notations__move}>
          {index + 1 + "."}
          <span>{notation[0]}</span>
          <span>{notation[1]}</span>
        </p>
      ))}
    </div>
  );
};

export default NotationBoard;
