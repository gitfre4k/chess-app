import Image from "next/image";

import styles from "../../styles/components/UserInfo.module.scss";

interface IUserInfo {
  user:
    | {
        [key: string]: string;
      }
    | undefined;
}

const UserInfo: React.FC<IUserInfo> = ({ user }) => {
  return (
    <div className={styles.userInfo}>
      {user?.photoURL ? (
        <Image src={user.photoURL} alt="user photo" height="50%" width="50%" objectFit="contain" />
      ) : null}
      <p>{user?.name}</p>
    </div>
  );
};

export default UserInfo;
