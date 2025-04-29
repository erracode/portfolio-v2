import { socialLinks } from "@/data/socialLinks"
import { SectionTitle } from "@/components/ui/section-title"
import { SocialLinkCard } from "./social-link-card"

interface SocialLinksHallProps {
  basePosition?: [number, number, number]
  spacing?: number
}

export function SocialLinksHall({ basePosition = [-8, 2, -5], spacing = 2 }: SocialLinksHallProps) {
  const [baseX, baseY, baseZ] = basePosition
  const titleX = baseX + ((socialLinks.length - 1) * spacing) / 2
  const titleY = baseY + 1.5

  return (
    <>
      <SectionTitle position={[titleX, titleY, baseZ]} title="Social Links" />
      {socialLinks.map((link, idx) => (
        <SocialLinkCard key={link.id} link={link} position={[baseX + idx * spacing, baseY, baseZ]} size={120} />
      ))}
    </>
  )
}
