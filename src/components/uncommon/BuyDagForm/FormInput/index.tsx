import React from "react";
import styles from "./index.module.scss";

interface IProps {
  label: string;
  placeholder?: string;
  visa?: boolean;
  country?: boolean;
}

export const FormInput: React.FC<IProps> = ({
  placeholder,
  label,
  visa,
}: IProps) => {
  return (
    <div className={styles.formInput}>
      <span>{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className={visa ? styles.creditCard : ""}
      />
      {visa && (
        <>
          <img className={styles.mastercard} src="/icons/master-card.svg" />
          <img className={styles.visacard} src="/icons/visa-card.svg" />
        </>
      )}
    </div>
  );
};
