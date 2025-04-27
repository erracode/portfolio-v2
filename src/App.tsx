import React, { useState, useCallback } from 'react'
import Game from './components/Game'
import PortfolioOverlay from './components/PortfolioOverlay'
import { ExperienceOverlay } from './components/ExperienceOverlay'
import { ProjectsOverlay } from './components/projects-showcase-v2/ProjectsOverlay'
import { portfolioItems } from './data/portfolioData'
import './index.css'
import appStyles from './components/ui/AppOverlay.module.css'
import MessageDialog from './components/ui/MessageDialog'
import ContactOverlay from './components/ContactOverlay'

function App() {
  const [activeId, setActiveId] = useState<string | null>(null)
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
  console.log('activeId', activeId)
  return (
    <div className={appStyles.container}>
      {/* 3D world */}
      <Game
        onProjectActivate={setActiveId}
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
        <ContactOverlay onClose={() => setContactOpen(false)} />
      )}
      {/* Panel Overlay on left side */}
      {activeId && (
        <div className={appStyles.panel}>
          {portfolioItems.some((item) => item.id === activeId) ? (
            <ProjectsOverlay
              projectId={activeId}
              onClose={() => setActiveId(null)}
            />
          ) : (
            <ExperienceOverlay
              experienceId={activeId}
              onClose={() => setActiveId(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
