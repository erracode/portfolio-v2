import React from 'react'
import { Html } from '@react-three/drei'
import styles from './ExperienceHall.module.css'

interface SocialHallTitleProps {
  position: [number, number, number]
}

export function SocialHallTitle({ position }: SocialHallTitleProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} occlude>
      <div className={styles.sectionTitle}>Social Links</div>
    </Html>
  )
} 