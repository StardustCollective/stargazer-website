import React, { useEffect, useState, useRef } from "react";
import ReactFlagsSelect from "react-flags-select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import styles from "./index.module.scss";

interface IProps {
  label: string;
  placeholder?: string;
  visa?: boolean;
  country?: boolean;
  value?: string;
  onChange?: (e) => void;
}

export const FormInput: React.FC<IProps> = ({
  placeholder,
  label,
  visa,
  country,
  value,
  onChange,
}: IProps) => {
  const [selected, setSelected] = useState("");
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const handleDropdown = () => {
    setDropdownStatus((status) => !status);
  };
  useEffect(() => {
    if (country) {
      const el = document.getElementById("rfs-btn");
      if (el) {
        el.addEventListener("click", handleDropdown);
      }
    }
  }, []);
  return (
    <div className={styles.formInput}>
      <span className={styles.label}>{label}</span>
      {country ? (
        <>
          <ReactFlagsSelect
            selected={selected}
            onSelect={(code) => {
              console.log(code);
              setSelected(code);
              onChange(code);
            }}
            className={styles.countrySelector}
          />
          {dropdownStatus ? (
            <ExpandLessIcon className={styles.expandMore} />
          ) : (
            <ExpandMoreIcon className={styles.expandMore} />
          )}
        </>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className={visa ? styles.creditCard : ""}
          onChange={onChange}
          value={value}
        />
      )}
      {visa && (
        <>
          <img className={styles.mastercard} src="/icons/master-card.svg" />
          <img className={styles.visacard} src="/icons/visa-card.svg" />
        </>
      )}
    </div>
  );
};
