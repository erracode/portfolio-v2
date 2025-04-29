
import { useState } from "react"
import { portfolioItems } from "@/data/portfolioData"
import type { PortfolioItem } from "@/data/portfolioData"
import { SectionTitle } from "@/components/ui/section-title"
import { ProjectCard } from "./project-card"
import { ProjectOverlay } from "./project-overlay"

interface ProjectsHallProps {
  onProjectActivate?: (id: string) => void
  basePosition?: [number, number, number]
  spacing?: number
}

export function ProjectsHall({ onProjectActivate, basePosition = [0, 2, -15], spacing = 2 }: ProjectsHallProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)

  // Unpack base position
  const [baseX, baseY, baseZ] = basePosition

  // Calculate center position for the title
  const titleX = ((portfolioItems.length - 1) * spacing) / 2
  const titleY = baseY + 1.5

  const handleProjectClick = (project: PortfolioItem) => {
    console.log("Project clicked:", project.title)

    // Use onProjectActivate if provided, otherwise handle locally
    if (onProjectActivate) {
      onProjectActivate(project.id)
    } else {
      setSelectedProject(project)
    }
  }

  // Handle closing the overlay
  const handleClose = () => {
    setSelectedProject(null)
  }

  return (
    <>
      {/* Title above the projects */}
      <SectionTitle position={[baseX, titleY, baseZ]} title="Projects" />

      {/* Projects arranged horizontally */}
      {portfolioItems.map((project, idx) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={[baseX - titleX + idx * spacing, baseY, baseZ]}
          onClick={() => handleProjectClick(project)}
        />
      ))}

      {/* Always render the overlay but it only displays when selectedProject is not null */}
      <ProjectOverlay project={selectedProject} onClose={handleClose} />
    </>
  )
}
