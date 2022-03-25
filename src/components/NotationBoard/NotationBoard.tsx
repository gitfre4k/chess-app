import styles from "../../styles/components/NotationBoard.module.scss";

interface INotationBoardProps {
  figures: ("pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "")[];
}

const NotationBoard: React.FC<INotationBoardProps> = ({ figures }) => {
  return (
    <div className={styles.container}>
      <div className={styles.notations}>
        {figures.map((figure, index) => (
          <p key={index} className={index % 2 === 0 ? styles.odd : ""}>
            {index + 1 + ". " + figure}
          </p>
        ))}
      </div>
    </div>
  );
};

export default NotationBoard;
