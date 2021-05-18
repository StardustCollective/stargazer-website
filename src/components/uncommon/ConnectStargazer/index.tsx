import { Button } from "@components/common";
import React, { FC } from "react";

import styles from "./index.module.scss";

interface IConnectStargazer {
  installed?: boolean;
  onConnect: () => void;
}

const ConnectStargazer: FC<IConnectStargazer> = ({
  installed = false,
  onConnect,
}) => {
  const handleClick = () => {
    //handleEthEnable();
    handleStargazerEnable();
  };

  const handleStargazerEnable = () => {
    window["stargazer"]
      .enable()
      .then((account) => {
        console.log("Successfully connected to Stargazer.", account);
        onConnect();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Connect with Stargazer Wallet</div>
      </div>
      <div className={styles.body}>
        <img src="/images/logo.svg" width="160" />
        <label>
          To buy DAG with your credit card, click on the button below.
        </label>
        {!installed && (
          <span>
            No wallet detected. Install{" "}
            <a
              target="_blank"
              href="https://chrome.google.com/webstore/detail/stargazer-wallet/pgiaagfkgcbnmiiolekcfmljdagdhlcm"
            >
              here
            </a>
            .
          </span>
        )}
        <Button
          type="button"
          theme="primary"
          variant={styles.button}
          disabled={!installed}
          onClick={handleClick}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default ConnectStargazer;
