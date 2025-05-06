import { useState, useMemo } from "react"
import { portfolioItems } from "@/data/portfolioData"
import type { PortfolioItem } from "@/data/portfolioData"
import { SectionTitle } from "@/components/ui/section-title"
import { ProjectCard } from "./project-card"
import { ProjectOverlay } from "./project-overlay"

interface ProjectsHallProps {
  onProjectActivate?: (id: string) => void
  basePosition?: [number, number, number]
  columnSpacing?: number
  rowSpacing?: number
  depthSpacing?: number
}

export function ProjectsHall({ 
  onProjectActivate, 
  basePosition = [-10, 2, -10], 
  columnSpacing = 5,
  rowSpacing = 1,
  depthSpacing = 2
}: ProjectsHallProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)

  // Unpack base position
  const [baseX, baseY, baseZ] = basePosition

  // Group and sort projects
  const { groups, totalColumns } = useMemo(() => {
    const groupedProjects = portfolioItems.reduce((acc, project) => {
      const key = `${project.type}-${project.company}`;
      if (!acc[key]) {
        acc[key] = {
          projects: [],
          type: project.type,
          company: project.company
        };
      }
      acc[key].projects.push(project);
      return acc;
    }, {} as Record<string, { projects: PortfolioItem[], type: string, company: string }>);

    const groups = Object.values(groupedProjects);
    
    // Sort groups by type (company first, then freelance, then personal)
    groups.sort((a, b) => {
      const typeOrder = { company: 0, freelance: 1, personal: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    return {
      groups,
      totalColumns: groups.length
    };
  }, []);

  // Calculate center position for main title
  const centerX = baseX + ((totalColumns - 1) * columnSpacing) / 2;
  const titleY = baseY + 2;
  const titleZ = baseZ - (groups.reduce((max, group) => 
    Math.max(max, group.projects.length), 0) * depthSpacing) / 2;

  const handleProjectClick = (project: PortfolioItem) => {
    console.log("Project clicked:", project.title)

    if (onProjectActivate) {
      onProjectActivate(project.id)
    } else {
      setSelectedProject(project)
    }
  }

  const handleClose = () => {
    setSelectedProject(null)
  }

  return (
    <>
      {/* Main title centered above all projects */}
      <SectionTitle 
        position={[centerX, titleY, titleZ]} 
        title="Projects" 
      />

      {/* Render grouped projects in columns */}
      {groups.map((group, columnIndex) => {
        const groupTitle = group.type === 'company' 
          ? group.company 
          : group.type === 'freelance' 
            ? 'Freelance' 
            : 'Personal';
        
        // Position for the entire column
        const columnX = baseX + (columnIndex * columnSpacing);
        const columnZ = baseZ;

        return (
          <group key={`${group.type}-${group.company}`} position={[columnX, baseY, columnZ]}>
            {/* Projects in this column (stacked behind each other) */}
            {group.projects.map((project, rowIndex) => (
              <group key={project.id}>
                {/* Show title only for the first project in column */}
                {rowIndex === 0 && (
                  <SectionTitle 
                    position={[0, 1, -rowIndex * depthSpacing]} 
                    title={groupTitle} 
                  />
                )}
                <ProjectCard
                  project={project}
                  position={[0, 0, -rowIndex * depthSpacing]}
                  onClick={() => handleProjectClick(project)}
                />
              </group>
            ))}
          </group>
        );
      })}

      {/* Project overlay */}
      <ProjectOverlay project={selectedProject} onClose={handleClose} />
    </>
  )
}