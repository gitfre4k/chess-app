import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase";

import styles from "../../styles/components/Navbar.module.scss";

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <div className={styles.container}>
      <p>{user?.displayName}</p>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  );
};

export default Navbar;
