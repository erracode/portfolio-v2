"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import styles from "./index.module.css"
import { cn } from "@/lib/utils"

type PixelButtonVariant = "default" | "primary" | "success" | "error"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: PixelButtonVariant
  icon?: ReactNode
  iconPosition?: "left" | "right"
  className?: string
  size?: "small" | "medium" | "large"
}

export function PixelButton({
  children,
  variant = "default",
  icon,
  iconPosition = "left",
  className,
  size = "medium",
  ...props
}: PixelButtonProps) {
  const buttonClasses = cn(
    styles.pixelBtn,
    {
      [styles.default]: variant === "default",
      [styles.primary]: variant === "primary",
      [styles.success]: variant === "success",
      [styles.error]: variant === "error",
      [styles.small]: size === "small",
      [styles.medium]: size === "medium",
      [styles.large]: size === "large",
    },
    className,
  )

  return (
    <button className={buttonClasses} {...props}>
      {icon &&
        (children ? (
          <>
            {iconPosition === "left" && <span className={styles.iconLeft}>{icon}</span>}
            <span>{children}</span>
            {iconPosition === "right" && <span className={styles.iconRight}>{icon}</span>}
          </>
        ) : (
          <span className={styles.iconOnly}>{icon}</span>
        ))}
      {!icon && children && <span>{children}</span>}
    </button>
  )
}
