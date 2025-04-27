import React, { useState } from "react"
import { Html } from "@react-three/drei"
import styles from "./project-showcase.module.css"
import ProjectOverlay from "./ProjectOverlay"
import { portfolioItems } from "../../data/portfolioData"

export default function ProjectShowcaseHall() {
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[number] | null>(null)

  return (
    <>
      {portfolioItems.map((item) => (
        <Html
          key={item.id}
          position={[item.position.x, item.position.y, item.position.z]}
          center
          transform
          distanceFactor={1.5}
          occlude
        >
          <button
            type="button"
            className={`${styles.projectCard} ${
              selectedProject?.id === item.id ? styles.activeProject : ""
            }`}
            onClick={() => setSelectedProject(item)}
          >
            <div className={styles.projectCardInner}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.projectImage}
              />
              <div className={styles.projectCardTitle}>{item.title}</div>
            </div>
          </button>
        </Html>
      ))}
      <ProjectOverlay
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
} 