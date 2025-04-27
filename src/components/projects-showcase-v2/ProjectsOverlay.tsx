import React, { useEffect, useState } from 'react'
import { portfolioItems } from '../../data/portfolioData'
import { ProjectOverlay } from './ProjectOverlay'

export interface ProjectsOverlayProps {
  projectId: string
  onClose: () => void
}

export function ProjectsOverlay({ projectId, onClose }: ProjectsOverlayProps) {
  const [selectedProject, setSelectedProject] = useState(
    portfolioItems.find((item) => item.id === projectId) || null
  )

  useEffect(() => {
    const project = portfolioItems.find((item) => item.id === projectId)
    setSelectedProject(project || null)
  }, [projectId])

  return <ProjectOverlay project={selectedProject} onClose={onClose} />
} 