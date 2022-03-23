import Image from "next/image";
import wKnighh from "../../assets/images/wKnight.png";
import bKinght from "../../assets/images/bKnight.png";

import styles from "../../styles/components/Card.module.scss";

interface ICardProps {
  content: JSX.Element;
  onClick: () => void;
  first?: boolean;
}

const Card: React.FC<ICardProps> = ({ content, onClick, first }) => {
  return (
    <div className={styles.container} onClick={onClick} style={{}}>
      {content}
      <div className={styles.imageContainer}>
        <Image
          src={first ? wKnighh : bKinght}
          alt="image of the knight chess piece"
          layout="fill"
          objectFit="contain"
          className={first ? styles.flip : ""}
        />
      </div>
    </div>
  );
};

export default Card;
