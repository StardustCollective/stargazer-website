import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import clm from "country-locale-map";

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
  nextStep: ({ cardName, cardNumber, expiryDate, cvv }) => void;
}
export const BuyDagFormStep1: React.FC<BDF1Prop> = ({ nextStep }: BDF1Prop) => {
  const dispatch = useDispatch();
  const { cardName, cardNumber, expiryDate, cvv } = useSelector(
    (root: RootState) => root.buyDag,
  );
  const validDate = (dValue) => {
    let result = false;
    const pattern = /^\d{2}$/;
    dValue = dValue.split("/");

    if (dValue[0] < 1 || dValue[0] > 12) result = true;

    if (!pattern.test(dValue[0]) || !pattern.test(dValue[1])) result = true;

    if (dValue[2]) result = true;
    return !result;
    // if (result) alert("Please enter a valid date in MM/YY format.");
  };
  const validateCVV = (cvv) => {
    return !!(cvv.length === 3 || cvv.length === 4);
  };
  const checkDisabled = () => {
    if (expiryDate && cvv && cardName && cardNumber) {
      if (!validDate(expiryDate)) {
        return true;
      }
      if (!validateCVV(cvv)) return true;
      return false;
    }
    return true;
  };
  return (
    <form
      className={styles.formWrapper}
      onSubmit={() => nextStep({ cardName, cardNumber, expiryDate, cvv })}
    >
      <div className={styles.header}>
        <div className={styles.title}>Buy with Card</div>
      </div>
      <div className={styles.body}>
        <StepMarker currentStep={1} />
        <FormInput
          label="Name on Card"
          value={cardName}
          onChange={(e) =>
            dispatch(
              setState({
                cardName: e.target.value,
              }),
            )
          }
        />
        <FormInput
          label="Card Number"
          visa={true}
          value={cardNumber}
          onChange={(e) =>
            dispatch(
              setState({
                cardNumber: e.target.value,
              }),
            )
          }
        />
        <div className={styles.halfWrapper}>
          <FormInput
            label="Expiry Date"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(event) => {
              const value = event.target.value
                .replace(
                  /^([1-9]\/|[2-9])$/g,
                  "0$1/", // 3 > 03/
                )
                .replace(
                  /^(0[1-9]|1[0-2])$/g,
                  "$1/", // 11 > 11/
                )
                .replace(
                  /^1([3-9])$/g,
                  "01/$1", // 13 > 01/3 //UPDATED by NAVNEET
                  // ).replace(
                  //   /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
                )
                .replace(
                  /^0\/|0+$/g,
                  "0", // 0/ > 0 and 00 > 0 //UPDATED by NAVNEET
                )
                .replace(
                  /[^\d|^/]*/g,
                  "", // To allow only digits and `/` //UPDATED by NAVNEET
                )
                .replace(
                  /\/\//g,
                  "/", // Prevent entering more than 1 `/`
                );
              dispatch(
                setState({
                  expiryDate: value,
                }),
              );
            }}
          />
          <FormInput
            label="CVV"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => {
              if (
                (e.nativeEvent.data > "0" && e.nativeEvent.data <= "9") ||
                e.nativeEvent.data === null
              ) {
                dispatch(
                  setState({
                    cvv: e.target.value,
                  }),
                );
              }
            }}
          />
        </div>
        <Button
          type="submit"
          theme="primary"
          variant={styles.button}
          disabled={checkDisabled()}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

interface BDF2Prop {
  prevStep: () => void;
  nextStep: ({ country, address, city, postalCode }) => void;
}
export const BuyDagFormStep2: React.FC<BDF2Prop> = ({
  prevStep,
  nextStep,
}: BDF2Prop) => {
  const dispatch = useDispatch();
  const { country, address, city, postalCode } = useSelector(
    (root: RootState) => root.buyDag,
  );
  const checkDisabled = () => {
    if (country && address && city && postalCode) {
      return false;
    }
    return true;
  };
  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Buy with Card</div>
      </div>
      <div className={styles.body}>
        <StepMarker currentStep={2} />
        <FormInput
          label="Country"
          country={true}
          onChange={(country) => {
            dispatch(
              setState({
                country: clm.getCountryByAlpha2(country).name,
              }),
            );
          }}
        />
        <FormInput
          label="Address"
          value={address}
          onChange={(e) =>
            dispatch(
              setState({
                address: e.target.value,
              }),
            )
          }
        />
        <div className={styles.halfWrapper}>
          <FormInput
            label="City"
            value={city}
            onChange={(e) =>
              dispatch(
                setState({
                  city: e.target.value,
                }),
              )
            }
          />
          <FormInput
            label="Postal Code"
            value={postalCode}
            onChange={(e) =>
              dispatch(
                setState({
                  postalCode: e.target.value,
                }),
              )
            }
          />
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
          <Button
            type="button"
            theme="success"
            variant={styles.button}
            onClick={() => nextStep({ country, address, city, postalCode })}
            disabled={checkDisabled()}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};
