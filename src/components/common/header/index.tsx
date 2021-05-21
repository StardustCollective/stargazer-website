import React, { useState } from "react";
import AppsSharpIcon from "@material-ui/icons/AppsSharp";
import { IconButton } from "@material-ui/core";
import styles from "./index.module.scss";

export const Header: React.FC = () => {
  let currentAccount;

  const [isConnected, setConnected] = useState<boolean>(false);

  React.useEffect(() => {
    if (window["ethereum"]) {
      setConnected(true);
    } else {
      setTimeout(() => {
        if (window["ethereum"]) {
          setConnected(true);
        }
      }, 3000);
    }
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <img
          className={styles.logo}
          src="/images/logo.png"
          alt="logo"
          width="95"
          height="44"
        />
        <span className={styles.title}>Stargazer Network</span>
      </div>
      <div className={styles.right}>
        {/*<a className={styles.navItem}>Tools & Analytics</a>*/}
        {/*<span className={styles.splitter} />*/}
        {/*<a className={styles.navItem}>Documentation</a>*/}
        {/*<span className={styles.splitter} />*/}
        {/*<a className={styles.navItem}>About</a>*/}
        {/* <Button
          type="button"
          theme="secondary"
          variant={styles.button}
          onClick={handleClick}
          disabled={false}
        >
          Connect Wallet
        </Button> */}
        <IconButton className={styles.iconButton}>
          <AppsSharpIcon />
        </IconButton>
      </div>
    </div>
  );
};
