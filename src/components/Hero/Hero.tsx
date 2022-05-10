import Image from "next/image";
import logo from "../../assets/images/logo.png";

import styles from "../../styles/components/Hero.module.scss";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <span>Chess</span>
      <div className={styles.heroLogo}>
        <Image src={logo} alt="app logo" layout="fill" />
      </div>
      <span>App</span>
    </div>
  );
};

export default Hero;
