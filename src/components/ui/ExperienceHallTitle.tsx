import React from 'react'
import { Html } from '@react-three/drei'
import styles from './ExperienceHall.module.css'

interface ExperienceHallTitleProps {
  position: [number, number, number]
}

export function ExperienceHallTitle({ position }: ExperienceHallTitleProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} occlude>
      <div className={styles.sectionTitle}>Work experience</div>
    </Html>
  )
} 