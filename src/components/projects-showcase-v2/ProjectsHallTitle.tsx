import React from 'react'
import { Html } from '@react-three/drei'
import styles from './ProjectsHall.module.css'

interface ProjectsHallTitleProps {
  position: [number, number, number]
}

export function ProjectsHallTitle({ position }: ProjectsHallTitleProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} occlude>
      <div className={styles.sectionTitle}>Projects</div>
    </Html>
  )
} 