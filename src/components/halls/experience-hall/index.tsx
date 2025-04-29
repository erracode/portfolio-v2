import { experiences } from "@/data/experienceData"
import { ExperienceCard } from "./experience-card"
import { SectionTitle } from "@/components/ui/section-title"

interface ExperienceHallProps {
  basePosition?: [number, number, number]
  spacing?: number
  onExperienceActivate: (id: string) => void
}

export function ExperienceHall({ basePosition = [8, 2, -5], spacing = 2, onExperienceActivate }: ExperienceHallProps) {
  const [baseX, baseY, baseZ] = basePosition
  const titleX = baseX + ((experiences.length - 1) * spacing) / 2
  const titleY = baseY + 1.5

  return (
    <>
      <SectionTitle position={[titleX, titleY, baseZ]} title="Work Experience" />
      {experiences.map((exp, idx) => (
        <ExperienceCard
          key={exp.id}
          position={[baseX + idx * spacing, baseY, baseZ]}
          title={`${exp.role} @ ${exp.company}`}
          description={exp.description.join(" ")}
          startDate={exp.startDate}
          endDate={exp.endDate}
          logo={exp.logo}
          onClick={() => onExperienceActivate(exp.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onExperienceActivate(exp.id)
          }}
        />
      ))}
    </>
  )
}
