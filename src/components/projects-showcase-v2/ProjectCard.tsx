import React from 'react'
import { Html } from '@react-three/drei'
import styles from './ProjectsHall.module.css'
import type { PortfolioItem } from '../../data/portfolioData'

interface ProjectCardProps {
  position: [number, number, number]
  project: PortfolioItem
  onClick: () => void
}

export function ProjectCard({ position, project, onClick }: ProjectCardProps) {
  // Debug handling of click
  const handleClick = () => {
    console.log('Card clicked:', project.title);
    onClick();
  };

  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: 'auto' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-block',
          pointerEvents: 'auto',
        }}
      >
        <div className={styles.projectCard}>
          <img src={project.image} alt={project.title} className={styles.projectImage} />
          <div className={styles.projectTitle}>{project.title}</div>
        </div>
      </button>
    </Html>
  )
} 