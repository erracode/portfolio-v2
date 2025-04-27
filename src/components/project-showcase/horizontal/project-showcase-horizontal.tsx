import React, { useState } from 'react'
import { Html } from '@react-three/drei'
import styles from './project-showcase-horizontal.module.css'
import ProjectOverlay from '../ProjectOverlay'
import { portfolioItems } from '../../../data/portfolioData'

export default function ProjectShowcaseHorizontal() {
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[number] | null>(null)
  const baseY = 2
  const baseZ = 0
  const spacing = 4

  return (
    <>
      <Html center position={[0, baseY + 1.5, baseZ]} transform occlude distanceFactor={1.5}>
        <div style={{ color: 'white', fontFamily: 'Press Start 2P', fontSize: '1rem' }}>
          Projects
        </div>
      </Html>

      {portfolioItems.map((item, idx) => (
        <Html
          key={item.id}
          position={[(-((portfolioItems.length - 1) * spacing) / 2) + idx * spacing, baseY, baseZ]}
          center
          transform
          occlude
          distanceFactor={1.5}
        >
          <button
            type="button"
            className={`${styles.projectCard} ${
              selectedProject?.id === item.id ? styles.activeProject : ''
            }`}
            onClick={() => setSelectedProject(item)}
          >
            <div className={styles.projectCardInner}>
              <img src={item.image} alt={item.title} className={styles.projectImage} />
              <div className={styles.projectCardTitle}>{item.title}</div>
            </div>
          </button>
        </Html>
      ))}

      <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
} 