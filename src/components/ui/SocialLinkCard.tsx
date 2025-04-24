import React from 'react'
import { Html } from '@react-three/drei'
import type { SocialLink } from '../../data/socialLinks'
import styles from './SocialLinkCard.module.css'

export interface SocialLinkCardProps {
  link: SocialLink
  position: [number, number, number]
  size?: number
}

export function SocialLinkCard({ link, position, size = 64 }: SocialLinkCardProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: 'auto' }}>
      <button
        type="button"
        onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
        className={styles.button}
      >
        <div className={styles.card}>
          <img src="/react-logo.png" alt={link.title} className={styles.icon} style={{ width: size, height: size }} />
          <span className={styles.title}>{link.title}</span>
        </div>
      </button>
    </Html>
  )
} 