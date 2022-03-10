import Image from "next/image";
import knightImg from "../../assets/images/knight-index.png";

import styles from "../../styles/components/Card.module.scss";

interface ICardProps {
  name: string;
  onClick: () => void;
  first?: boolean;
}

const Card: React.FC<ICardProps> = ({ name, onClick, first }) => {
  return (
    <div className={styles.container} onClick={onClick} style={{}}>
      <Image
        src={knightImg}
        alt="image of the knight chess piece"
        layout="fill"
        objectFit="contain"
        className={first ? styles.flip : ""}
      />
      {<p className={styles.text}>{name}</p>}
    </div>
  );
};

export default Card;

// padding: 70px 20px;
// img {

// }
// img {

// }
