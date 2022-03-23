import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase";

import styles from "../../styles/components/Navbar.module.scss";

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>Chess App</h2>
      {user ? (
        <div className={styles.userInfo}>
          <p>{user?.displayName}</p>
          <button onClick={() => auth.signOut()}>SignOut</button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
