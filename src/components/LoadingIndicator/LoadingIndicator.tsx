import styles from "../../styles/components/LoadingIndicator.module.scss";

interface ILoadingIndicatorProps {
  pulse?: boolean;
}

const LoadingIndicator: React.FC<ILoadingIndicatorProps> = ({ pulse }) => {
  if (pulse) return <div className={styles.loadingPulse}></div>;
  return <div className={styles.loading}></div>;
};

export default LoadingIndicator;
