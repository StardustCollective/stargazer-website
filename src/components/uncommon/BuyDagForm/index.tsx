import React, { useState } from "react";
import classnames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import { Button } from "@components/common";
import { StepMarker } from "./StepMarker";
import { FormInput } from "./FormInput";

import styles from "./index.module.scss";

interface IProps {
  label: string;
  expandable?: boolean;
  logoUrl: string;
  currency: string;
  onValueChange: (e) => void;
  value?: string;
}

interface FIWProps {
  children: any;
  label: string;
}
export const FormItemWrapper: React.FC<FIWProps> = ({
  children,
  label,
}: FIWProps) => {
  return (
    <div>
      <span>{label}</span>
      {children}
    </div>
  );
};

export const FormItem: React.FC<IProps> = ({
  label,
  expandable,
  logoUrl,
  currency,
  onValueChange,
  value,
}: IProps) => {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>
      <input placeholder="0.0" onChange={onValueChange} value={value} />
      <span className={styles.splitter}></span>
      <div className={styles.currencySelector}>
        <img className={styles.logo} src={logoUrl} />
        <span className={styles.currency}>{currency}</span>
        {expandable && <ExpandMoreIcon />}
      </div>
    </div>
  );
};

export const Card: React.FC = () => {
  return (
    <div className={classnames(styles.item, styles.credit)}>
      <CreditCardIcon />
      <span className={classnames(styles.label, styles.credit)}>New Card</span>
      <img src="/icons/master-card.svg" />
      <img src="/icons/visa-card.svg" />
    </div>
  );
};

export const BuyDagForm: React.FC = () => {
  const [usdValue, setUsdValue] = useState("");
  const [dagValue, setDagValue] = useState("");
  const conversionRate = 0.06; /// 1 DAG is 0.06 USD

  const handleUsdValueChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setDagValue("");
      setUsdValue("");
    } else if (isFinite(inputValue)) {
      const nUsd = parseFloat(inputValue);
      setUsdValue(inputValue);
      setDagValue(`${(nUsd / conversionRate).toFixed(6)}`);
    }
  };

  const handleDagValueChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setDagValue("");
      setUsdValue("");
    } else if (isFinite(inputValue)) {
      const nDag = parseFloat(inputValue);
      setDagValue(inputValue);
      setUsdValue(`${(nDag * conversionRate).toFixed(6)}`);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Buy Dag</div>
      </div>
      <div className={styles.body}>
        <FormItem
          label="Spend"
          expandable={true}
          logoUrl="/icons/usd.svg"
          currency="USD"
          onValueChange={handleUsdValueChange}
          value={usdValue}
        />
        <FormItem
          label="Buy"
          logoUrl="/icons/dag.svg"
          currency="DAG"
          onValueChange={handleDagValueChange}
          value={dagValue}
        />
        <Card />
        <Button
          type="button"
          theme="primary"
          variant={styles.button}
          onClick={() => {
            console.log("onClick");
          }}
          disabled={usdValue === "" || dagValue === ""}
        >
          Buy DAG
        </Button>
      </div>
    </div>
  );
};

export const BuyDagFormStep1: React.FC = () => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Buy with Card</div>
      </div>
      <div className={styles.body}>
        <StepMarker currentStep={1} />
        <FormInput label="Name on Card" />
        <FormInput label="Card Number" visa={true} />
        <div className={styles.halfWrapper}>
          <FormInput label="Expiry Date" placeholder="MM/YY" />
          <FormInput label="CVV" placeholder="CVV" />
        </div>
        <Button type="button" theme="primary" variant={styles.button}>
          Next
        </Button>
      </div>
    </div>
  );
};

export const BuyDagFormStep2: React.FC = () => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Buy with Card</div>
      </div>
      <div className={styles.body}>
        <StepMarker currentStep={2} />
        <FormInput label="Country" country={true} />
        <FormInput label="Address" />
        <div className={styles.halfWrapper}>
          <FormInput label="City" />
          <FormInput label="Postal Code" />
        </div>
        <div className={classnames(styles.actionGroup, styles.halfWrapper)}>
          <Button type="button" theme="darkgray" variant={styles.button}>
            Previous
          </Button>
          <Button type="button" theme="success" variant={styles.button}>
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};
