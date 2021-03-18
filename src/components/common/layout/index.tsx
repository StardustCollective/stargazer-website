import { Header, Sidebar } from "@components/common";
import styles from "./index.module.scss";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.bodyWrapper}>
        <Sidebar />
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </>
  );
};
