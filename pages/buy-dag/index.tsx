import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@redux/reducers";
import { Layout } from "@components/common";
import {
  BuyDagForm,
  BuyDagFormStep1,
  // BuyDagFormStep2,
  TransactionReceipt,
} from "@components/uncommon/BuyDagForm";

import styles from "./index.module.scss";
import ConnectStargazer from "@components/uncommon/ConnectStargazer";

const BuyDag: React.FC = () => {
  const {
    usdValue,
    dagValue,
    cardName,
    cardNumber,
    expiryDate,
    cvv,
    email,
  } = useSelector((root: RootState) => root.buyDag);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [isConnected, setConnected] = useState<boolean>(false);
  const [isWalletInstalled, setWalletInstalled] = useState<boolean>(false);
  const [activeAccount, setActiveAccount] = useState<string>("");

  const markAsInstalledAndCheckConnected = () => {
    setWalletInstalled(true);

    window["stargazer"].isConnected().then((result) => setConnected(result));

    // window["stargazer"].on("accountChanged", (account: string) => {
    //   setActiveAccount(account);
    // });
  };

  React.useEffect(() => {
    if (window["stargazer"]) {
      markAsInstalledAndCheckConnected();
    } else {
      setTimeout(() => {
        if (window["stargazer"]) {
          markAsInstalledAndCheckConnected();
        }
      }, 3000);
    }
  }, []);

  const handleStargazerEnable = () => {
    window["ethereum"]
      .enable()
      .then((account) => {
        setActiveAccount(account);
        console.log("Successfully connected to Stargazer.", account);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEthSignMessage = (message) => {
    return window["ethereum"]
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => accounts[0])
      .then((currentAccount) => {
        return window["ethereum"]
          .request({
            method: "personal_sign",
            params: [message, currentAccount, ""],
          })
          .then((sig) => {
            sig = sig.startsWith("0x") ? sig.slice(2) : sig;
            console.log("SIG", sig);
            return { address: currentAccount, sig };
          });
      });
  };

  const handleDagSignMessage = (message) => {
    return window["stargazer"]
      .request({ method: "getAddress" })
      .then((currentAccount) => {
        return window["stargazer"]
          .request({
            method: "signMessage",
            params: [message, currentAccount],
          })
          .then((sig) => {
            console.log("SIG", sig);
            return { address: currentAccount, sig };
          });
      });
  };

  const handleSubmitRequest = () => {
    const statement = `I am buying ${dagValue} DAG for ${usdValue} USD`;
    handleDagSignMessage(statement).then(({ address, sig }) => {
      const body = {
        auth: { token: sig },
        order: {
          asset: "DAG",
          quantity: +dagValue,
          amountUSD: Math.floor(usdValue * 100),
          tokenAddress: address,
          statement,
        },
        customer: {
          email: email,
        },
        paymethod: {
          number: cardNumber,
          cvv: cvv,
          name: cardName,
          expYear: Number(`20${expiryDate.split("/")[1]}`),
          expMonth: Number(expiryDate.split("/")[0]),
        },
      };
      fetch("https://portal.stargazer.network/api/v1/buy-dag/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          const result = await res.json();
          console.log(result);
          setTransactionLoading(false);
        })
        .catch((err) => console.log(err));
    });
  };

  const renderForm = () => {
    if (!isConnected) {
      return (
        <ConnectStargazer
          installed={isWalletInstalled}
          onConnect={() => {
            setConnected(true);
          }}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <BuyDagForm
            nextStep={(usdValue, dagValue) => {
              console.log(usdValue, dagValue);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <BuyDagFormStep1
            nextStep={({ cardName, cardNumber, expiryDate, cvv }) => {
              console.log({ cardName, cardNumber, expiryDate, cvv });
              setStep(3);
              handleSubmitRequest();
              setTransactionLoading(true);
            }}
          />
        );
      case 3:
        <TransactionReceipt loading={transactionLoading} />;
    }
  };

  return (
    <Layout>
      <div>
        <span>isInstalled: {String(isWalletInstalled)}, </span>
        <span>isConnected: {String(isConnected)}, </span>
        <span>activeAccount: {String(activeAccount)}</span>
      </div>
      <div className={styles.pageWrapper}>
        {renderForm()}
        {/* {step === 3 && (
          <BuyDagFormStep2
            prevStep={() => setStep(2)}
            nextStep={({ country, address, city, postalCode }) => {
              console.log({ country, address, city, postalCode });
              handleSubmitRequest();
            }}
          />
        )} */}
      </div>
    </Layout>
  );
};

export default BuyDag;
