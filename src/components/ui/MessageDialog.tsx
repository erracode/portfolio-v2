import PixelBalloon from '../pixelated-balloon/pixelated-balloon'
import styles from './MessageDialog.module.css'
import React, { useState, useEffect, useRef } from 'react'

export interface MessageDialogProps {
  message: string
  iconSrc?: string
  onNext?: () => void
}

export default function MessageDialog({ message, iconSrc = '/react-logo.png', onNext }: MessageDialogProps) {
  const [displayText, setDisplayText] = useState('')
  const prevMessageRef = useRef<string>('')
  useEffect(() => {
    // Skip duplicate runs (StrictMode mount/unmount)
    if (prevMessageRef.current === message) return
    prevMessageRef.current = message
    // Reset text and start typing
    setDisplayText('')
    let idx = 0
    const interval = setInterval(() => {
      idx += 1
      setDisplayText(message.substring(0, idx))
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