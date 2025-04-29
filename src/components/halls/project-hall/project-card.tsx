"use client"
import { Html } from "@react-three/drei"
import type { PortfolioItem } from "@/data/portfolioData"
import { PixelCard } from "@/components/ui/pixel-card"
import styles from "./projectCard.module.css"

interface ProjectCardProps {
  position: [number, number, number]
  project: PortfolioItem
  onClick: () => void
}

export function ProjectCard({ position, project, onClick }: ProjectCardProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-block",
          pointerEvents: "auto",
        }}
      >
        <PixelCard className={styles.projectCard}>
          <PixelCard.Content className={styles.cardContent}>
            <img src={project.image || "/placeholder.svg"} alt={project.title} className={styles.projectImage} />
            <PixelCard.Title className={styles.projectTitle}>{project.title}</PixelCard.Title>
          </PixelCard.Content>
        </PixelCard>
      </button>
    </Html>
  )
}
