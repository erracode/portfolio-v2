"use client"
import { Html } from "@react-three/drei"
import type { SocialLink } from "@/data/socialLinks"
import { PixelCard } from "@/components/ui/pixel-card"
import styles from "./SocialLinkCard.module.css"

export interface SocialLinkCardProps {
  link: SocialLink
  position: [number, number, number]
  size?: number
}

export function SocialLinkCard({ link, position, size = 64 }: SocialLinkCardProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} style={{ pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
        className={styles.button}
      >
        <PixelCard className={styles.card}>
          <PixelCard.Content className={styles.cardContent}>
            <img src={link.icon} alt={link.title} className={styles.icon} style={{ width: size, height: size }} />
            <PixelCard.Title className={styles.title}>{link.title}</PixelCard.Title>
          </PixelCard.Content>
        </PixelCard>
      </button>
    </Html>
  )
}
