import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode | string;
  background?: string;
  color?: string;
  iconBackground?: string;
  iconColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  background,
  color,
  iconBackground,
  iconColor,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${styles.container} ${props.className}`}
      style={{ background, color, ...props.style }}
    >
      {icon && (
        <span
          className={styles.iconContainer}
          style={{ color: iconColor, background: iconBackground }}
        >
          {icon}
        </span>
      )}

      {(text || !icon) && <span className={styles.content}>{text}</span>}
    </button>
  );
};
