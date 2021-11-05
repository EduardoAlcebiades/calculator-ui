import { InputHTMLAttributes, useState } from "react";

import { MdClose } from "react-icons/md";

import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  canClear?: boolean;
  preLoaded?: boolean;
  background?: string;
  icon?: React.ReactNode;
  onClearClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  canClear = false,
  background = "white",
  preLoaded = false,
  icon,
  onClearClick,
  disabled,
  ...props
}) => {
  const [isClearButtonShow, setIsClearButtonShow] = useState<boolean>(false);

  function showClearButton() {
    setIsClearButtonShow(true);
  }

  function hideClearButton() {
    setIsClearButtonShow(false);
  }

  return (
    <div
      className={`${styles.container} ${preLoaded ? styles.preLoaded : ""} ${
        disabled ? styles.disabled : ""
      }`}
      style={{ background }}
      onFocus={showClearButton}
      onMouseEnter={showClearButton}
      onBlur={hideClearButton}
      onMouseLeave={hideClearButton}
    >
      {icon && <span className={styles.iconContainer}>{icon}</span>}

      <input
        {...props}
        className={`${styles.inputContent} ${props.className}`}
        style={props.style}
        disabled={disabled}
      />

      <button
        className={styles.closeButton}
        type="button"
        style={{
          visibility: canClear ? "visible" : "hidden",
          opacity: isClearButtonShow ? 1 : 0,
        }}
        onClick={onClearClick}
      >
        <MdClose />
      </button>
    </div>
  );
};
