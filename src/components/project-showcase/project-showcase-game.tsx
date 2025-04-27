import { Html } from '@react-three/drei'
import ProjectShowcase from './project-showcase'

interface ProjectShowcaseGameProps {
  position: [number, number, number]
}

export function ProjectShowcaseGame({ position }: ProjectShowcaseGameProps) {
  return (
    <Html position={position} center transform distanceFactor={1.5} occlude>
      <ProjectShowcase/>
    </Html>
  )
} 