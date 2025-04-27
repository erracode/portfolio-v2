import React from 'react'
import { X } from 'lucide-react'
import type { PortfolioItem } from '../../data/portfolioData'
import styles from './ProjectOverlay.module.css'
import { GameButton } from '../ui/GameButton'

export interface ProjectOverlayProps {
  project: PortfolioItem | null
  onClose: () => void
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  // Debug logs
  console.log('ProjectOverlay rendering:', project ? project.title : 'none')
  
  if (!project) {
    console.log('No project selected')
    return null
  }

  return (
    <div className={styles.overlayBackground}>
      <div className={styles.overlayContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          <GameButton type="button" onClick={onClose} className={styles.closeButton}>
            <X className="w-6 h-6 text-black" />
          </GameButton>
        </div>
        
        <div className={styles.imageContainer}>
          <img src={project.image} alt={project.title} className={styles.projectImage} />
        </div>
        
        <div className={styles.descriptionLine}>{project.description}</div>
        
        <h3 className={styles.sectionTitle}>Technologies</h3>
        <div className={styles.techList}>
          {project.technologies.map((tech) => (
            <div key={tech} className={styles.techItem}>
              <span>{tech}</span>
            </div>
          ))}
        </div>
        
        {project.link && (
          <div className={styles.buttonContainer}>
            <a 
              href={project.link} 
              className={styles.button}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 