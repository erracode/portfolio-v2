import { Html } from "@react-three/drei"
import styles from "./index.module.css"

interface SectionTitleProps {
  position: [number, number, number]
  title: string
  className?: string
}

export function SectionTitle({ position, title, className }: SectionTitleProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} occlude>
      <div className={`${styles.sectionTitle} ${className || ""}`}>{title}</div>
    </Html>
  )
}
