import React from 'react'
import { X } from 'lucide-react'
import styles from './ui/ContactOverlay.module.css'
import { GameButton } from './ui/GameButton'

interface ContactOverlayProps {
  onClose: () => void
}

export default function ContactOverlay({ onClose }: ContactOverlayProps) {
  return (
    <div className={styles.overlayBackground}>
      <div className={styles.overlayContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>Let's Work Together</h2>
          <GameButton type="button" onClick={onClose} className={styles.closeButton}>
            <X className="w-6 h-6 text-black" />
          </GameButton>
        </div>
        <p className={styles.bodyText}>
          Do you want to work with me or develop a project together? I'd love to hear from you!
        </p>
        <GameButton
          type="button"
          onClick={() => { window.location.href = 'mailto:example@example.com'; }}
          className={styles.contactButton}
        >
          Contact Me
        </GameButton>
      </div>
    </div>
  )
} 