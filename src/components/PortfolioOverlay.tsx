"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { portfolioItems } from "../data/portfolioData"

interface PortfolioOverlayProps {
  projectId: string
  onClose: () => void
}

const PortfolioOverlay = ({ projectId, onClose }: PortfolioOverlayProps) => {
  const [project, setProject] = useState<(typeof portfolioItems)[0] | null>(null)

  useEffect(() => {
    const foundProject = portfolioItems.find((item) => item.id === projectId)
    setProject(foundProject || null)
  }, [projectId])

  if (!project) return null

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-10">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="aspect-video bg-gray-200 mb-4 rounded-lg overflow-hidden">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{project.description}</p>

            <h3 className="text-xl font-semibold mt-4">Technologies</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            {project.link && (
              <div className="mt-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black text-white rounded-lg inline-block hover:bg-gray-800 transition-colors"
                >
                  View Project
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioOverlay
