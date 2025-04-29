import React, { useEffect, useState } from 'react'
import { X, XIcon } from 'lucide-react'
import { experiences } from '../data/experienceData'
import type { Experience } from '../data/experienceData'
import styles from './ui/ExperienceOverlay.module.css'
import { GameButton } from './ui/GameButton'
import { CloseButton } from './ui/close-button'
import { PixelButton } from './ui/pixel-button'

export interface ExperienceOverlayProps {
  experienceId: string
  onClose: () => void
}

export function ExperienceOverlay({ experienceId, onClose }: ExperienceOverlayProps) {
  const [exp, setExp] = useState<Experience | null>(null)

  useEffect(() => {
    const found = experiences.find((e) => e.id === experienceId) || null
    setExp(found)
  }, [experienceId])

  if (!exp) return null

  return (
    <div className={styles.overlayBackground}>
      <div className={styles.overlayContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{`${exp.role} @ ${exp.company}`}</h2>
          {/* <CloseButton onClick={onClose} /> */}
          <PixelButton icon={<XIcon/>} onClick={onClose} size='small' variant='error'/>
        </div>
        {exp.startDate && exp.endDate && (
          <div className={styles.timestamp}>{`${exp.startDate} - ${exp.endDate}`}</div>
        )}
        {exp.description.map((line) => (
          <div key={line} className={styles.descriptionLine}>
            {line}
          </div>
        ))}
        {exp.techStack && exp.techStack.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Technologies</h3>
            <div className={styles.techList}>
              {exp.techStack.map((tech) => (
                <div key={tech.label} className={styles.techItem}>
                  {tech.logo && (
                    <img src={tech.logo} alt={`${tech.label} logo`} className={styles.techIcon} />
                  )}
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}