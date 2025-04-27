import React, { useState, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import type { PortfolioItem } from '../../data/portfolioData'
import styles from './ProjectOverlay.module.css'

export interface ProjectOverlayProps {
  project: PortfolioItem | null
  onClose: () => void
}

// Image Carousel Component
function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesInView, setSlidesInView] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
    setSlidesInView(emblaApi.slidesInView())
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
            <div className={styles.carouselSlide} key={`image-${image}-${index}`}>
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
          {images.map((image, index) => (
            <button
              type="button"
              key={`dot-${image}-${index}`}
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
  // Debug logs
  console.log('ProjectOverlay rendering:', project ? project.title : 'none')
  
  if (!project) {
    console.log('No project selected')
    return null
  }

  // Convert single image to array for carousel
  const projectImages = Array.isArray(project.image) ? project.image : [project.image];

  return (
    <div className={styles.overlayBackground}>
      <div className={styles.overlayContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          <button type="button" onClick={onClose} className={styles.closeButtonV2}>
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
        
        <ImageCarousel images={projectImages} />
        
        <div className={styles.descriptionLine}>{project.description}</div>
        
        <h3 className={styles.sectionTitle}>Technologies</h3>
        <div className={styles.techList}>
          {project.techStack.map((tech) => (
            <div key={tech.label} className={styles.techItem}>
              {tech.logo && (
                <img src={tech.logo} alt={`${tech.label} logo`} className={styles.techIcon} />
              )}
              <span>{tech.label}</span>
            </div>
          ))}
        </div>
        
        {project.link && (
          <div className={styles.buttonContainer}>
            <a 
              href={project.link} 
              className={styles.button}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 