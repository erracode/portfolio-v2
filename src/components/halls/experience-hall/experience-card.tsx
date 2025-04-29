"use client"

import type React from "react"
import { Html } from "@react-three/drei"
import { PixelCard } from "@/components/ui/pixel-card"
import styles from "./ExperienceCard.module.css"

interface ExperienceCardProps {
  position: [number, number, number]
  title: string
  description?: string
  startDate?: string
  endDate?: string
  logo?: string
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
}

export function ExperienceCard({
  position,
  title,
  description,
  startDate,
  endDate,
  logo,
  onClick,
  onKeyDown,
}: ExperienceCardProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{
          all: "unset",
          cursor: onClick ? "pointer" : "default",
          display: "inline-block",
          pointerEvents: "auto",
        }}
      >
        <PixelCard className={styles.card}>
          <PixelCard.Header className={styles.header}>
            {logo && <img src={logo || "/placeholder.svg"} alt="Company logo" className={styles.logo} />}
            <div className={styles.headerText}>
              <PixelCard.Title className={styles.title}>{title}</PixelCard.Title>
              {startDate && endDate && (
                <PixelCard.Subtitle className={styles.timestamp}>{`${startDate} - ${endDate}`}</PixelCard.Subtitle>
              )}
            </div>
          </PixelCard.Header>
          {description && <PixelCard.Content className={styles.content}>{description}</PixelCard.Content>}
        </PixelCard>
      </button>
    </Html>
  )
}
