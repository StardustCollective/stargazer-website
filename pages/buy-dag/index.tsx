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
    country,
    address,
    city,
    postalCode,
  } = useSelector((root: RootState) => root.buyDag);

  const handleSubmitRequest = () => {
    const body = {
      order: { token: "DAG", quantity: dagValue, amountUSD: usdValue },
      customer: {
        email: "1",
        firstName: "1",
        lastName: "1",
        address: {
          name: "1",
          line1: "1",
          city: city,
          state: country,
          zip: postalCode,
        },
      },
      paymethod: {
        number: cardNumber,
        cvv: cvv,
        name: cardName,
        expYear: `20${expiryDate.split("/")[1]}`,
        expMonth: expiryDate.split("/")[0],
        zip: postalCode,
      },
    };
    fetch("https://www.stargazer.network/api/v1/buy-dag/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        console.log(await res.json());
      })
      .catch((err) => console.log(err));
  };

  const [step, setStep] = useState(1);
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
            }}
          />
        )}
        {step === 3 && <TransactionReceipt loading={true} />}
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
