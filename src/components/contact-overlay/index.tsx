"use client"

import { Mail } from "lucide-react"
import { PixelOverlay } from "../ui/pixel-overlay"
import { PixelButton } from "../ui/pixel-button"
import styles from "./styles.module.css"

export interface ContactOverlayProps {
  isOpen: boolean
  onClose: () => void
  email?: string
}

export function ContactOverlay({ isOpen, onClose, email = "myemail@gmail.com" }: ContactOverlayProps) {
  const handleContactClick = () => {
    window.location.href = `mailto:${email}?subject=Portfolio%20Inquiry`
  }

  return (
    <PixelOverlay isOpen={isOpen} onClose={onClose} position="right" width={400}>
      <PixelOverlay.Header>
        <PixelOverlay.Title>Contact Me</PixelOverlay.Title>
        <PixelOverlay.Subtitle>Let's work together!</PixelOverlay.Subtitle>
      </PixelOverlay.Header>

      <PixelOverlay.Content>
        <div className={styles.contactContent}>
          <div className={styles.avatarContainer}>
            <img src="/placeholder.svg?height=120&width=120" alt="Avatar" className={styles.avatar} />
          </div>

          <p className={styles.message}>
            Thanks for exploring my portfolio! I'm always interested in new opportunities and collaborations.
          </p>

          <p className={styles.message}>
            If you'd like to discuss a project, have questions, or just want to say hello, feel free to reach out.
          </p>

          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{email}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Based in:</span>
              <span className={styles.infoValue}>Pixel City, Digital World</span>
            </div>
          </div>
        </div>
      </PixelOverlay.Content>

      <PixelOverlay.Footer>
        <PixelButton variant="primary" size="small" icon={<Mail size={14} />} onClick={handleContactClick}>
          Send Email
        </PixelButton>
      </PixelOverlay.Footer>
    </PixelOverlay>
  )
}
