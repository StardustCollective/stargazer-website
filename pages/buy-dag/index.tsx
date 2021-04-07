import React, { useState } from "react";

import { Layout } from "@components/common";
import {
  BuyDagForm,
  BuyDagFormStep1,
  BuyDagFormStep2,
} from "@components/uncommon/BuyDagForm";

import styles from "./index.module.scss";

const BuyDag: React.FC = () => {
  const exampleJson = {
    order: { token: "DAG", quantity: 1, amountUSD: 1 },
    customer: {
      email: "1",
      firstName: "1",
      lastName: "1",
      address: { name: "1", line1: "1", city: "1", state: "1", zip: 1 },
    },
    paymethod: {
      number: 1,
      cvv: "123",
      name: "1",
      expYear: "1234",
      expMonth: "12",
      zip: 1,
    },
  };

  const [step, setStep] = useState(1);
  const [usdValue, setUsdValue] = useState(0);
  const [dagValue, setDagValue] = useState(0);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  return (
    <Layout>
      <div className={styles.pageWrapper}>
        {step === 1 && (
          <BuyDagForm
            nextStep={(usdValue, dagValue) => {
              setUsdValue(usdValue);
              setDagValue(dagValue);
              console.log(usdValue, dagValue);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <BuyDagFormStep1
            nextStep={({ cardName, cardNumber, expiryDate, cvv }) => {
              setName(cardName);
              setCardNumber(cardNumber);
              setExpiryDate(expiryDate);
              setCvv(cvv);
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <BuyDagFormStep2
            prevStep={() => setStep(2)}
            nextStep={() => setStep(1)}
          />
        )}
      </div>
    </Layout>
  );
};

export default BuyDag;
