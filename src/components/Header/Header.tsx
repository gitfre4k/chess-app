import { signOut, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

import Hero from "../Hero/Hero";
import Button from "../Button/Button";
import Image from "next/image";

import styles from "../../styles/components/Header.module.scss";

interface HeaderProps {
  user: User | null | undefined;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const signOutHandler = () => {
    signOut(auth);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__leftSide}>
        <Hero />
      </div>
      {user ? (
        <div className={styles.headerRightSide}>
          <div className={styles.headerRightSideUserInfo}>
            {user.photoURL ? (
              <div className={styles.userPhoto}>
                <Image src={user.photoURL} layout="fill" alt="user picture" />
              </div>
            ) : null}
            <p>{user.displayName}</p>
            <Button name="Sign Out" style="light" action={signOutHandler} />
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
