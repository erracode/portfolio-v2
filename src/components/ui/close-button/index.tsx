import { X } from "lucide-react";
import styles from "./index.module.css";

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
  return (
    <button type="button" {...props} className={styles.closeButton}>
      <X className={styles.closeButtonIcon} />
    </button>
  );
}