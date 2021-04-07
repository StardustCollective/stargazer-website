import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import { setState } from "@redux/actions";
import { RootState } from "@redux/reducers";
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

interface BDFProp {
  nextStep: (usdValue, dagValue) => void;
}
export const BuyDagForm: React.FC<BDFProp> = ({ nextStep }: BDFProp) => {
  const conversionRate = 0.06; /// 1 DAG is 0.06 USD
  const dispatch = useDispatch();
  const { usdValue, dagValue } = useSelector((root: RootState) => root.buyDag);
  const setUsdValue = (value) => {
    dispatch(
      setState({
        usdValue: value,
      }),
    );
  };
  const setDagValue = (value) => {
    dispatch(
      setState({
        dagValue: value,
      }),
    );
  };
  const handleUsdValueChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || inputValue === "0") {
      setDagValue(0);
      setUsdValue(0);
    } else if (isFinite(inputValue)) {
      const nUsd = parseFloat(inputValue);
      setUsdValue(inputValue);
      setDagValue((nUsd / conversionRate).toFixed(6));
    }
  };

  const handleDagValueChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || inputValue === "0") {
      setDagValue(0);
      setUsdValue(0);
    } else if (isFinite(inputValue)) {
      const nDag = parseFloat(inputValue);
      setDagValue(inputValue);
      setUsdValue((nDag * conversionRate).toFixed(6));
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
          value={usdValue.toString()}
        />
        <FormItem
          label="Buy"
          logoUrl="/icons/dag.svg"
          currency="DAG"
          onValueChange={handleDagValueChange}
          value={dagValue.toString()}
        />
        <Card />
        <Button
          type="button"
          theme="primary"
          variant={styles.button}
          onClick={() => nextStep(usdValue, dagValue)}
          disabled={usdValue === 0 || dagValue === 0}
        >
          Buy DAG
        </Button>
      </div>
    </div>
  );
};

interface BDF1Prop {
  nextStep: ({ name, cardNumber, expiryDate, cvv }) => void;
}
export const BuyDagFormStep1: React.FC<BDF1Prop> = ({ nextStep }: BDF1Prop) => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Buy with Card</div>
      </div>
      <div className={styles.body}>
        <StepMarker currentStep={1} />
        <FormInput
          label="Name on Card"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormInput
          label="Card Number"
          visa={true}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <div className={styles.halfWrapper}>
          <FormInput
            label="Expiry Date"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <FormInput
            label="CVV"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
        <Button
          type="button"
          theme="primary"
          variant={styles.button}
          onClick={() => nextStep({ name, cardNumber, expiryDate, cvv })}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface BDF2Prop {
  prevStep: () => void;
  nextStep: ({ name, cardNumber, expiryDate, cvv }) => void;
}
export const BuyDagFormStep2: React.FC<BDF2Prop> = ({
  prevStep,
  nextStep,
}: BDF2Prop) => {
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
          <Button
            type="button"
            theme="darkgray"
            variant={styles.button}
            onClick={() => prevStep()}
          >
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
