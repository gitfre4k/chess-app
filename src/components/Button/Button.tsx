import styles from "../../styles/components/Button.module.scss";

interface IButtonProps {
  name: string;
  action: any;
  style: "light" | "dark";
}

const Button: React.FC<IButtonProps> = ({ name, action, style }) => {
  return (
    <button
      onClick={action}
      className={style === "light" ? styles.btn : styles.btn + " " + styles.btnDark}
    >
      {name}
    </button>
  );
};

export default Button;
