import Image from "next/image";

import styles from "../../styles/components/UserInfo.module.scss";
import { DocumentData } from "firebase/firestore";

interface IUserInfo {
  user: DocumentData;
}

const UserInfo: React.FC<IUserInfo> = ({ user }) => {
  return (
    <div className={styles.userInfo}>
      <Image src={user.photoURL} alt="user photo" height="50%" width="50%" objectFit="contain" />
      <p>{user.name}</p>
    </div>
  );
};

export default UserInfo;
