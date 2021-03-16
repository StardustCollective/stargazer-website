import React from "react";
import Image from "next/image";
import { Button } from "@components/scss/button";
import styles from "./index.module.scss";

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Image
          className={styles.logo}
          src="/images/logo.png"
          alt="logo"
          width="95"
          height="44"
        />
        <span className={styles.title}>Stargazer Network</span>
      </div>
      <div className={styles.right}>
        <a className={styles.navItem}>Tools & Analytics</a>
        <span className={styles.splitter} />
        <a className={styles.navItem}>Documentation</a>
        <span className={styles.splitter} />
        <a className={styles.navItem}>About</a>
      </div>
    </div>
  );
};
