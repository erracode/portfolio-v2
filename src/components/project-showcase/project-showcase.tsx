"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import styles from "./project-showcase.module.css"

type Technology = {
  name: string
  icon: string
}

type Project = {
  id: string
  title: string
  description: string
  images: string[] // Changed from single image to array of images
  technologies: Technology[]
  demoUrl?: string
  repoUrl?: string
}

export default function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Sample projects data with multiple images
  const projects: Project[] = [
    {
      id: "1",
      title: "Website Backup Bot",
      description: "Automated tool for creating website backups with WBB Plugin integration",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Screenshot+1",
        "/placeholder.svg?height=150&width=150&text=Screenshot+2",
      ],
      technologies: [
        { name: "JavaScript", icon: "/placeholder.svg?height=24&width=24" },
        { name: "HTML5", icon: "/placeholder.svg?height=24&width=24" },
        { name: "CSS3", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "2",
      title: "E-Commerce Platform",
      description: "Full-featured online store with payment processing",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Product+Page",
        "/placeholder.svg?height=150&width=150&text=Checkout",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Node.js", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "3",
      title: "Task Management App",
      description: "Productivity tool for organizing tasks and projects",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Task+List",
        "/placeholder.svg?height=150&width=150&text=Calendar+View",
      ],
      technologies: [
        { name: "Vue.js", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Firebase", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "4",
      title: "Weather Dashboard",
      description: "Real-time weather information with forecasts",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Forecast",
        "/placeholder.svg?height=150&width=150&text=Radar",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "API", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "5",
      title: "Social Media App",
      description: "Connect with friends and share updates",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Profile",
        "/placeholder.svg?height=150&width=150&text=Feed",
      ],
      technologies: [
        { name: "React Native", icon: "/placeholder.svg?height=24&width=24" },
        { name: "GraphQL", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "6",
      title: "Portfolio Website",
      description: "Showcase of personal projects and skills",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=About",
        "/placeholder.svg?height=150&width=150&text=Contact",
      ],
      technologies: [
        { name: "Next.js", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Tailwind CSS", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "7",
      title: "Chat Application",
      description: "Real-time messaging platform with user authentication",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Chat+Room",
        "/placeholder.svg?height=150&width=150&text=User+List",
      ],
      technologies: [
        { name: "Socket.io", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Express", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "8",
      title: "Recipe Finder",
      description: "Search and save your favorite cooking recipes",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Recipe+Details",
        "/placeholder.svg?height=150&width=150&text=Search+Results",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "MongoDB", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "9",
      title: "Budget Tracker",
      description: "Personal finance management application",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Expenses",
        "/placeholder.svg?height=150&width=150&text=Reports",
      ],
      technologies: [
        { name: "Vue.js", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Chart.js", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "10",
      title: "Fitness Tracker",
      description: "Track your workouts and fitness progress",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Workout+Log",
        "/placeholder.svg?height=150&width=150&text=Progress+Charts",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Firebase", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "11",
      title: "Movie Database",
      description: "Search and discover information about movies",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Movie+Details",
        "/placeholder.svg?height=150&width=150&text=Actor+Profiles",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "API", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
    {
      id: "12",
      title: "Music Player",
      description: "Stream and play your favorite music",
      images: [
        "/placeholder.svg?height=150&width=150",
        "/placeholder.svg?height=150&width=150&text=Playlist",
        "/placeholder.svg?height=150&width=150&text=Equalizer",
      ],
      technologies: [
        { name: "React", icon: "/placeholder.svg?height=24&width=24" },
        { name: "Web Audio API", icon: "/placeholder.svg?height=24&width=24" },
      ],
    },
  ]

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const formatDate = () => {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  // Limit to 16 projects for the grid layout
  const displayProjects = projects.slice(0, 16)

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>PROJECT SHOWCASE</h1>

      <div className={styles.gridContainer}>
        {/* Center area for selected project */}
        <div className={styles.centerArea}>
          {selectedProject ? (
            <div className={styles.card}>
              <div className={styles.header}>
                <div className={styles.title}>{selectedProject.title}</div>
              </div>

              <div className={styles.timestamp}>{formatDate()}</div>

              {/* Image Carousel */}
              <ImageCarousel images={selectedProject.images} />

              <div className={styles.descriptionLine}>{selectedProject.description}</div>

              <div className={styles.sectionTitle}>TECHNOLOGIES</div>
              <ul className={styles.techList}>
                {selectedProject.technologies.map((tech, index) => (
                  <li key={index} className={styles.techItem}>
                    <img src={tech.icon || "/placeholder.svg"} alt={tech.name} className={styles.techIcon} />
                    <span>{tech.name}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.buttonContainer}>
                {selectedProject.demoUrl && (
                  <a href={selectedProject.demoUrl} className={styles.button} target="_blank" rel="noopener noreferrer">
                    DEMO
                  </a>
                )}
                {selectedProject.repoUrl && (
                  <a href={selectedProject.repoUrl} className={styles.button} target="_blank" rel="noopener noreferrer">
                    CODE
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <div className={styles.emptyStateText}>SELECT A PROJECT</div>
            </div>
          )}
        </div>

        {/* Projects arranged around the center */}
        <div className={styles.gridParent}>
          {displayProjects.map((project, index) => {
            // Skip rendering in the center positions (div1)
            if (index >= 0 && index < 16) {
              return (
                <button
                  key={project.id}
                  className={`${styles.projectCard} ${styles[`div${index + 2}`]} ${
                    selectedProject?.id === project.id ? styles.activeProject : ""
                  }`}
                  onClick={() => handleProjectClick(project)}
                  aria-label={`Select ${project.title} project`}
                >
                  <div className={styles.projectCardInner}>
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.title}
                      className={styles.projectImage}
                    />
                    <div className={styles.projectCardTitle}>{project.title}</div>
                    <div className={styles.projectCardTech}>
                      {project.technologies.slice(0, 2).map((tech, i) => (
                        <img
                          key={i}
                          src={tech.icon || "/placeholder.svg"}
                          alt={tech.name}
                          className={styles.miniTechIcon}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
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
            <div className={styles.carouselSlide} key={index}>
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
        <button className={styles.carouselButton} onClick={scrollPrev} aria-label="Previous image">
          &lt;
        </button>

        <div className={styles.carouselDots}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.carouselDot} ${index === currentIndex ? styles.carouselDotSelected : ""}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button className={styles.carouselButton} onClick={scrollNext} aria-label="Next image">
          &gt;
        </button>
      </div>
    </div>
  )
}
