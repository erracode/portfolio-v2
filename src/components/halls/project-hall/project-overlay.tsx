"use client"

import { useState, useCallback, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import type { PortfolioItem } from "@/data/portfolioData"
import styles from "./ProjectOverlay.module.css"
import { PixelButton } from "@/components/ui/pixel-button"
import { PixelOverlay } from "@/components/ui/pixel-overlay"

export interface ProjectOverlayProps {
  project: PortfolioItem | null
  onClose: () => void
}

// Image Carousel Component
function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, containScroll: "trimSnaps" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (images.length <= 1) {
    return (
      <div className={styles.projectImageContainer}>
        <img src={images[0] || "/placeholder.svg"} alt="Project" className={styles.projectDetailImage} />
      </div>
    )
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel} ref={emblaRef}>
        <div className={styles.carouselSlides}>
          {images.map((image, index) => (
            <div className={styles.carouselSlide} key={`image-${index}`}>
              <img
                src={image || "/placeholder.svg"}
                alt={`Project screenshot ${index + 1}`}
                className={styles.carouselImage}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.carouselButtons}>
        <button type="button" className={styles.carouselButton} onClick={scrollPrev} aria-label="Previous image">
          &lt;
        </button>

        <div className={styles.carouselDots}>
          {images.map((_, index) => (
            <button
              type="button"
              key={`dot-${index}`}
              className={`${styles.carouselDot} ${index === currentIndex ? styles.carouselDotSelected : ""}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button type="button" className={styles.carouselButton} onClick={scrollNext} aria-label="Next image">
          &gt;
        </button>
      </div>
    </div>
  )
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  if (!project) {
    return null
  }

  // Convert single image to array for carousel
  const projectImages = Array.isArray(project.image) ? project.image : [project.image]

  // Get the year from the project (assuming it has a date property)
  const projectYear = project.date ? new Date(project.date).getFullYear() : null

  return (
    <PixelOverlay isOpen={!!project} onClose={onClose} position="left" width={400}>
      <PixelOverlay.Header>
        <PixelOverlay.Title>{project.title}</PixelOverlay.Title>
        {projectYear && <PixelOverlay.Subtitle>{projectYear}</PixelOverlay.Subtitle>}
      </PixelOverlay.Header>

      <PixelOverlay.Content>
        <div className={styles.contentContainer}>
          <ImageCarousel images={projectImages} />

          <div className={styles.description}>{project.description}</div>

          <div className={styles.techSection}>
            <h3 className={styles.techTitle}>Technologies</h3>
            <div className={styles.techGrid}>
              {project.techStack.map((tech) => (
                <div key={tech.label} className={styles.techItem}>
                  {tech.logo && (
                    <img src={tech.logo || "/placeholder.svg"} alt={`${tech.label} logo`} className={styles.techLogo} />
                  )}
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PixelOverlay.Content>

      {project.link && (
        <PixelOverlay.Footer>
          <PixelButton
            variant="primary"
            size="small"
            icon={<ExternalLink size={14} />}
            onClick={() => window.open(project.link, "_blank", "noopener,noreferrer")}
          >
            Visit Project
          </PixelButton>
        </PixelOverlay.Footer>
      )}
    </PixelOverlay>
  )
}
