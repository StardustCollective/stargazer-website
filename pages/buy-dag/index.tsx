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
    handleEthSignMessage(statement).then(({ address, sig }) => {
      const body = {
        auth: { token: sig },
        order: {
          asset: "DAG",
          quantity: dagValue,
          amountUSD: usdValue,
          tokenAddress: address,
          statement,
        },
        customer: {
          email: email,
          firstName: "1",
          lastName: "1",
        },
        paymethod: {
          number: cardNumber,
          cvv: cvv,
          name: cardName,
          expYear: `20${expiryDate.split("/")[1]}`,
          expMonth: expiryDate.split("/")[0],
          zip: "",
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

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        {step === 1 && (
          <BuyDagForm
            nextStep={(usdValue, dagValue) => {
              console.log(usdValue, dagValue);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <BuyDagFormStep1
            nextStep={({ cardName, cardNumber, expiryDate, cvv }) => {
              console.log({ cardName, cardNumber, expiryDate, cvv });
              setStep(3);
              handleSubmitRequest();
              setTransactionLoading(true);
            }}
          />
        )}
        {step === 3 && <TransactionReceipt loading={transactionLoading} />}
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
