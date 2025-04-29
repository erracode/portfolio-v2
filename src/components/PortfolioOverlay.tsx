import { useEffect, useState } from "react"
import { X, XIcon } from "lucide-react"
import { portfolioItems } from "../data/portfolioData"
import styles from './ui/PortfolioOverlay.module.css'
import { GameButton } from './ui/GameButton'
import { PixelButton } from "./ui/pixel-button"

interface PortfolioOverlayProps {
  projectId: string
  onClose: () => void
}

export default function PortfolioOverlay({ projectId, onClose }: PortfolioOverlayProps) {
  const [project, setProject] = useState<(typeof portfolioItems)[0] | null>(null)

  useEffect(() => {
    const foundProject = portfolioItems.find((item) => item.id === projectId)
    setProject(foundProject || null)
  }, [projectId])

  if (!project) return null

  return (
    <div className={styles.overlayBackground}>
      <div className={styles.overlayContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          <PixelButton icon={<XIcon/>} onClick={onClose} size='small' variant='error'/>

          {/* <GameButton type="button" onClick={onClose} className={styles.closeButton}>
            <X className="w-6 h-6" /> lol
          </GameButton> */}
        </div>
        <div className={styles.videoContainer}>
          <img src={project.image || '/placeholder.svg'} alt={project.title} />
        </div>
        <p className={styles.description}>{project.description}</p>
        <h3 className={styles.sectionTitle}>Technologies</h3>
        <ul className={styles.techList}>
          {project.technologies.map((tech) => {
            const iconSrc =
              tech === 'JavaScript'
                ? '/javascript-logo.png'
                : tech === 'React'
                ? '/react-logo.png'
                : ''
            return (
              <li key={tech} className={styles.techItem}>
                {iconSrc && (
                  <img
                    src={iconSrc}
                    alt={`${tech} logo`}
                    className={styles.techIcon}
                  />
                )}
                <span>{tech}</span>
              </li>
            )
          })}
        </ul>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            View Project
          </a>
        )}
      </div>
    </div>
  )
}
