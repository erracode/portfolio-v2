export const portfolioItems = [
    {
      id: "project1",
      title: "E-Commerce Website",
      description:
        "A fully responsive e-commerce platform with product filtering, cart functionality, and secure checkout.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      position: { x: 0, y: 1, z: -10 },
      link: "https://example.com/project1",
    },
    {
      id: "project2",
      title: "Mobile Weather App",
      description: "A weather application that provides real-time forecasts, radar maps, and severe weather alerts.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["React Native", "Redux", "Weather API"],
      position: { x: 10, y: 1, z: 0 },
      link: "https://example.com/project2",
    },
    {
      id: "project3",
      title: "Task Management System",
      description: "A collaborative task management tool with real-time updates, file sharing, and progress tracking.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      position: { x: 0, y: 1, z: 10 },
      link: "https://example.com/project3",
    },
    {
      id: "project4",
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing projects, skills, and contact information.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
      position: { x: -10, y: 1, z: 0 },
      link: "https://example.com/project4",
    },
  ]
  
// Define the type for a portfolio item
export type PortfolioItem = typeof portfolioItems[number]
  