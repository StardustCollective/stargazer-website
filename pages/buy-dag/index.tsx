import React, { useDebugValue, useState } from "react";
import classnames from "classnames";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import { Layout, Button } from "@components/common";
import styles from "./index.module.scss";

interface IProps {
  label: string;
  expandable?: boolean;
  logoUrl: string;
  currency: string;
  onValueChange: (e) => void;
  value?: string;
}

const FormItem: React.FC<IProps> = ({
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

const Card: React.FC = () => {
  return (
    <div className={classnames(styles.item, styles.credit)}>
      <CreditCardIcon />
      <span className={classnames(styles.label, styles.credit)}>New Card</span>
      <img src="/icons/master-card.svg" />
      <img src="/icons/visa-card.svg" />
    </div>
  );
};

const BuyDagForm: React.FC = () => {
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
          Buy Dag
        </Button>
      </div>
    </div>
  );
};

const BuyDag: React.FC = () => {
  return (
    <Layout>
      <BuyDagForm />
    </Layout>
  );
};

export default BuyDag;
