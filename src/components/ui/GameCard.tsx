import React from 'react'
import type { MouseEventHandler, KeyboardEventHandler } from 'react'
import { Html } from '@react-three/drei'
import styles from './GameCard.module.css'

export interface GameCardProps {
  position: [number, number, number]
  title: string
  description?: string
  startDate?: string
  endDate?: string
  /** Handler when card is clicked */
  onClick?: MouseEventHandler
  /** Handler for keyboard activation (Enter/Space) */
  onKeyDown?: KeyboardEventHandler
  className?: string
}

export function GameCard({ position, title, description, startDate, endDate, onClick, onKeyDown, className }: GameCardProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: 'auto' }}>
      {/* Use a reset button for accessibility */}
      <button
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{
          all: 'unset',
          cursor: onClick ? 'pointer' : 'default',
          display: 'inline-block',
          pointerEvents: 'auto',
        }}
      >
        <div className={`${styles.card} ${className ?? ''}`.trim()}>
          {startDate && endDate && (
            <div className={styles.timestamp}>{`${startDate} - ${endDate}`}</div>
          )}
          <div className={styles.header}>{title}</div>
          {description && <div className={styles.content}>{description}</div>}
        </div>
      </button>
    </Html>
  )
} 