import React, { useState } from 'react'
import { portfolioItems } from '../../data/portfolioData'
import type { PortfolioItem } from '../../data/portfolioData'
import { ProjectsHallTitle } from './ProjectsHallTitle'
import { ProjectCard } from './ProjectCard'
import { ProjectOverlay } from './ProjectOverlay'

interface ProjectsShowcaseV2Props {
  onProjectActivate?: (id: string) => void
}

export default function ProjectsShowcaseV2({ onProjectActivate }: ProjectsShowcaseV2Props) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
  
  // Position settings for the horizontal hall
  const baseY = 2
  const baseZ = 10 // Place it behind the main area
  const spacing = 4
  
  // Calculate center position for the title
  const titleX = ((portfolioItems.length - 1) * spacing) / 2
  const titleY = baseY + 1.5

  const handleProjectClick = (project: PortfolioItem) => {
    console.log('Project clicked:', project.title)
    
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
      <ProjectsHallTitle position={[0, titleY, baseZ]} />
      
      {/* Projects arranged horizontally */}
      {portfolioItems.map((project, idx) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={[(-titleX) + idx * spacing, baseY, baseZ]}
          onClick={() => handleProjectClick(project)}
        />
      ))}
      
      {/* Always render the overlay but it only displays when selectedProject is not null */}
      <ProjectOverlay 
        project={selectedProject} 
        onClose={handleClose}
      />
    </>
  )
} 