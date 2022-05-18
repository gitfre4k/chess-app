import Image from "next/image";
import logo from "../../assets/images/logo.png";

import styles from "../../styles/components/Hero.module.scss";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroLogo}>
        <Image src={logo} alt="app logo" layout="fill" />
      </div>
      <div className={styles.heroText}>
        <span className={styles.heroText1}>Chess</span>
        <span className={styles.heroText2}>App</span>
      </div>
    </div>
  );
};

export default Hero;
