import React from 'react'
import styles from './GameButton.module.css'

export interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function GameButton({ children, className = '', ...props }: GameButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${className}`.trim()}
    >
      {children}
    </button>
  )
} 