
import { useState } from "react"
import Game from "./components/Game"
import PortfolioOverlay from "./components/PortfolioOverlay"

function App() {
  const [activeProject, setActiveProject] = useState<string | null>(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Game onProjectActivate={setActiveProject} />
      {activeProject && <PortfolioOverlay projectId={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  )
}

export default App
