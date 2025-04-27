import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './project-showcase.module.css'
import overlayStyles from '../ui/ExperienceOverlay.module.css'
import { portfolioItems } from '../../data/portfolioData'

type ProjectType = typeof portfolioItems[number]

export default function ProjectOverlay({
  project,
  onClose,
}: {
  project: ProjectType | null
  onClose: () => void
}) {
  if (!project) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentIndex, setCurrentIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  const images = [project.image]
  const formatDate = () => {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div className={overlayStyles.overlayBackground}>
      <div className={overlayStyles.overlayContent}>
        <div className={overlayStyles.header}>
          <div className={overlayStyles.title}>{project.title}</div>
          <button
            type="button"
            className={overlayStyles.closeButton}
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className={overlayStyles.timestamp}>{formatDate()}</div>

        <div className={styles.carouselContainer}>
          <div className={styles.carousel} ref={emblaRef}>
            <div className={styles.carouselSlides}>
              {images.map((src, idx) => (
                <div className={styles.carouselSlide} key={src}>
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className={styles.carouselImage}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.carouselButtons}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={scrollPrev}
              aria-label="Previous image"
            >
              &lt;
            </button>
            <div className={styles.carouselDots}>
              {images.map((src, idx) => (
                <button
                  type="button"
                  key={src}
                  className={`${styles.carouselDot} ${
                    idx === currentIndex ? styles.carouselDotSelected : ''
                  }`}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={scrollNext}
              aria-label="Next image"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className={overlayStyles.descriptionLine}>{project.description}</div>
        <div className={overlayStyles.sectionTitle}>Technologies</div>
        <ul className={overlayStyles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech} className={overlayStyles.techItem}>
              <span>{tech}</span>
            </li>
          ))}
        </ul>

        <div className={styles.buttonContainer}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Visit Project
          </a>
        </div>
      </div>
    </div>
  )
} 