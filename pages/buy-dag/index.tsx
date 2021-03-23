import React from "react";
import classnames from "classnames";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import { Layout } from "@components/common";
import styles from "./index.module.scss";

interface IProps {
  label: string;
  expandable?: boolean;
  logoUrl: string;
  currency: string;
}

const FormItem: React.FC<IProps> = ({
  label,
  expandable,
  logoUrl,
  currency,
}: IProps) => {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>
      <input placeholder="0.0" />
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

const BuyDag: React.FC = () => {
  return (
    <Layout>
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
          />
          <FormItem label="Buy" logoUrl="/icons/dag.svg" currency="DAG" />
          <Card />
        </div>
      </div>
    </Layout>
  );
};

export default BuyDag;
