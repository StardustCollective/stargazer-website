import React from "react";

import { Layout } from "@components/common";
import {
  BuyDagForm,
  BuyDagFormStep1,
  BuyDagFormStep2,
} from "@components/uncommon/BuyDagForm";

import styles from "./index.module.scss";

const BuyDag: React.FC = () => {
  return (
    <Layout>
      <div className={styles.pageWrapper}>
        <BuyDagForm />
        <BuyDagFormStep1 />
        <BuyDagFormStep2 />
      </div>
    </Layout>
  );
};

export default BuyDag;
