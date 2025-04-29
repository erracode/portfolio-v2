"use client"

import { useEffect, useState } from "react"
import { experiences } from "@/data/experienceData"
import type { Experience } from "@/data/experienceData"
import styles from "./ExperienceOverlay.module.css"
import { PixelButton } from "@/components/ui/pixel-button"
import { PixelOverlay } from "@/components/ui/pixel-overlay"

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
    <PixelOverlay isOpen={!!exp} onClose={onClose} position="left" width={400}>
      <PixelOverlay.Header>
        <div className={styles.titleContainer}>
          {exp.logo && (
            <img src={exp.logo || "/placeholder.svg"} alt={`${exp.company} logo`} className={styles.companyLogo} />
          )}
          <div>
            <PixelOverlay.Title>{exp.role}</PixelOverlay.Title>
            <PixelOverlay.Subtitle>@ {exp.company}</PixelOverlay.Subtitle>
          </div>
        </div>
      </PixelOverlay.Header>

      <PixelOverlay.Content>
        <div className={styles.contentContainer}>
          {exp.startDate && exp.endDate && (
            <div className={styles.dateRange}>{`${exp.startDate} - ${exp.endDate}`}</div>
          )}

          <div className={styles.description}>
            {exp.description.map((line, index) => (
              <p key={index} className={styles.descriptionLine}>
                {line}
              </p>
            ))}
          </div>

          {exp.techStack && exp.techStack.length > 0 && (
            <div className={styles.techSection}>
              <h3 className={styles.techTitle}>Technologies</h3>
              <div className={styles.techGrid}>
                {exp.techStack.map((tech) => (
                  <div key={tech.label} className={styles.techItem}>
                    {tech.logo && (
                      <img
                        src={tech.logo || "/placeholder.svg"}
                        alt={`${tech.label} logo`}
                        className={styles.techLogo}
                      />
                    )}
                    <span>{tech.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PixelOverlay.Content>

      {exp.link && (
        <PixelOverlay.Footer>
          <PixelButton
            variant="primary"
            size="small"
            onClick={() => window.open(exp.link, "_blank", "noopener,noreferrer")}
          >
            Visit Company
          </PixelButton>
        </PixelOverlay.Footer>
      )}
    </PixelOverlay>
  )
}
