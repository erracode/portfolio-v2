import React, { useState, useCallback } from 'react'
import Game from './components/Game'
// import PortfolioOverlay from './components/PortfolioOverlay'
import { ExperienceOverlay } from './components/halls/experience-hall/experience-overlay'
import { portfolioItems } from './data/portfolioData'
import './index.css'
import appStyles from './components/ui/AppOverlay.module.css'
import MessageDialog from './components/ui/MessageDialog'
import { ContactOverlay } from './components/contact-overlay'
import { ProjectOverlay } from './components/halls/project-hall/project-overlay'

function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  // Manage dialog queue in state
  const [dialogQueue, setDialogQueue] = useState<string[]>([
    'Welcome to my portfolio website!',
    'Feel free to explore by clicking on objects.'
  ])
  const [dialogIndex, setDialogIndex] = useState(0)
  // Handler to enqueue dialog messages or open contact overlay on CONTACT_REQUEST
  const handleDialogTrigger = useCallback((msg: string) => {
    if (msg === 'CONTACT_REQUEST') {
      setContactOpen(true)
    } else {
      setDialogQueue((prev) => [...prev, msg])
    }
  }, [])
  console.log('portfolioItems', portfolioItems)
  
  return (
    <div className={appStyles.container}>
      {/* 3D world */}
      <Game
        onProjectActivate={setSelectedProject}
        onExperienceActivate={setSelectedExperience}
        onDialog={handleDialogTrigger}
      />

      {/* Show welcome/dialog messages, click to advance */}
      {dialogIndex < dialogQueue.length && (
        <MessageDialog
          message={dialogQueue[dialogIndex] ?? ''}
          onNext={() => setDialogIndex((i) => i + 1)}
        />
      )}
      {/* Contact overlay when Zeppelin is clicked */}
      {contactOpen && (
        // <ContactOverlay onClose={() => setContactOpen(false)} />
        <ContactOverlay isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      )}
      {/* Panel Overlay on left side */}
      {selectedProject && (
        <div className={appStyles.panel}>
          <ProjectOverlay
            project={portfolioItems.find((item) => item.id === selectedProject) ?? null}
            onClose={() => setSelectedProject(null)}
          />
        </div>
      )}
      {selectedExperience && (
        <div className={appStyles.panel}>
          <ExperienceOverlay
            experienceId={selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />
        </div>
      )}
    </div>
  )
}

export default App
