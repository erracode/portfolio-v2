import PixelBalloon from '../pixelated-balloon/pixelated-balloon'
import styles from './MessageDialog.module.css'
import React, { useState, useEffect } from 'react'

export interface MessageDialogProps {
  message: string
  iconSrc?: string
  onNext?: () => void
}

export default function MessageDialog({ message, iconSrc = '/react-logo.png', onNext }: MessageDialogProps) {
  // Initialize with first character to avoid blank on mount
  const [displayText, setDisplayText] = useState(() => message.charAt(0) || '')
  useEffect(() => {
    // Pre-show first character
    setDisplayText(message.charAt(0) || '')
    let idx = 1
    const interval = setInterval(() => {
      setDisplayText(message.substring(0, idx + 1))
      idx += 1
      if (idx >= message.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [message])

  // Handler: skip or advance
  const handleNext = () => {
    if (displayText.length < message.length) {
      // finish typing immediately
      setDisplayText(message)
    } else {
      onNext?.()
    }
  }

  return (
    <div
      className={styles.dialogContainer}
      role={onNext ? 'button' : undefined}
      tabIndex={onNext ? 0 : undefined}
      onClick={handleNext}
      onKeyDown={(e) => {
        if (onNext && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleNext()
        }
      }}
      style={{ cursor: onNext ? 'pointer' : 'default' }}
    >
      <img src={iconSrc} alt="Icon" className={styles.icon} />
      <PixelBalloon>{displayText}</PixelBalloon>
    </div>
  )
} 