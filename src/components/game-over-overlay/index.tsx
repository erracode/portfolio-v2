"use client"

import { RefreshCw } from "lucide-react"
import styles from "./game-over-overlay.module.css"
import { PixelButton } from "../ui/pixel-button"

interface GameOverOverlayProps {
  isOpen: boolean
  onRestart: () => void
  score?: number
}

export function GameOverOverlay({ isOpen, onRestart, score = 0 }: GameOverOverlayProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>GAME OVER</h1>
          <h2 className={styles.subtitle}>The enemies got you!</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.avatarContainer}>
            <img src="/talk-icon.png" alt="Game Over" className={styles.avatar} />
          </div>

          <p className={styles.message}>You fought bravely, but the enemies were too many.</p>

          <p className={styles.message}>Don&apos;t give up! </p>
          <p className={styles.retryDetermination}>The restart button fills you with determination </p>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Score:</span>
              <span className={styles.statValue}>{score}</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Enemies Defeated:</span>
              <span className={styles.statValue}>{Math.floor(score / 10)}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
            
            <PixelButton onClick={onRestart} icon={<RefreshCw size={14} className={styles.buttonIcon} />}  variant="success">
            Try Again 
          </PixelButton>

        </div>
      </div>
    </div>
  )
}
