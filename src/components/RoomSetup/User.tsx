import UserInfo from "../UserInfo/UserInfo";
import Image from "next/image";
import wKnight from "../../assets/images/wKnight.png";
import bKnight from "../../assets/images/bKnight.png";

import styles from "../../styles/components/User.module.scss";

interface IUserProps {
  user:
    | {
        [key: string]: string;
      }
    | undefined;
  toggleColor: boolean;
  rotate?: boolean;
}

const User: React.FC<IUserProps> = ({ user, toggleColor, rotate }) => {
  return (
    <div className={styles.container}>
      <UserInfo user={user} />
      <div className={styles.img + " " + (rotate ? styles.rotate : "")}>
        <Image
          src={toggleColor ? bKnight : wKnight}
          alt="chess piece"
          objectFit="contain"
          layout="fill"
        />
      </div>
    </div>
  );
};

export default User;
