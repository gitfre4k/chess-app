import Image from "next/image";

import styles from "../../styles/components/UserInfo.module.scss";
import { DocumentData } from "firebase/firestore";

interface IUserInfo {
  user: DocumentData;
}

const UserInfo: React.FC<IUserInfo> = ({ user }) => {
  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfo__img}>
        <Image src={user.photoURL} alt="user photo" layout="fill" />
      </div>
      <p>{user.name}</p>
    </div>
  );
};

export default UserInfo;
