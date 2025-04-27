export const portfolioItems = [
    {
      id: "project1",
      title: "E-Commerce Website",
      description:
        "A fully responsive e-commerce platform with product filtering, cart functionality, and secure checkout.",
      image: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600&text=Product+Page",
        "/placeholder.svg?height=400&width=600&text=Checkout"
      ],
      techStack: [
        {
          label: "React",
          logo: "/react-logo.png",
        },
        {
          label: "Node.js",
          logo: "/nodejs-logo.png",
        },
        {
          label: "MongoDB",
          logo: "/mongodb-logo.png",
        },
        {
          label: "Stripe",
          logo: "/placeholder.svg?height=24&width=24&text=Stripe",
        }
      ],
      position: { x: 0, y: 1, z: -10 },
      link: "https://example.com/project1",
    },
    {
      id: "project2",
      title: "Mobile Weather App",
      description: "A weather application that provides real-time forecasts, radar maps, and severe weather alerts.",
      image: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600&text=Forecast",
        "/placeholder.svg?height=400&width=600&text=Radar"
      ],
      techStack: [
        {
          label: "React Native",
          logo: "/placeholder.svg?height=24&width=24&text=RN",
        },
        {
          label: "Redux",
          logo: "/redux-logo.png",
        },
        {
          label: "Weather API",
          logo: "/placeholder.svg?height=24&width=24&text=API",
        }
      ],
      position: { x: 10, y: 1, z: 0 },
      link: "https://example.com/project2",
    },
    {
      id: "project3",
      title: "Task Management System",
      description: "A collaborative task management tool with real-time updates, file sharing, and progress tracking.",
      image: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600&text=Task+List",
        "/placeholder.svg?height=400&width=600&text=Dashboard"
      ],
      techStack: [
        {
          label: "Vue.js",
          logo: "/placeholder.svg?height=24&width=24&text=Vue",
        },
        {
          label: "Firebase",
          logo: "/placeholder.svg?height=24&width=24&text=FB",
        },
        {
          label: "Tailwind CSS",
          logo: "/placeholder.svg?height=24&width=24&text=TW",
        }
      ],
      position: { x: 0, y: 1, z: 10 },
      link: "https://example.com/project3",
    },
    {
      id: "project4",
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing projects, skills, and contact information.",
      image: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600&text=About",
        "/placeholder.svg?height=400&width=600&text=Contact"
      ],
      techStack: [
        {
          label: "HTML",
          logo: "/html-logo.png",
        },
        {
          label: "CSS",
          logo: "/css-logo.png",
        },
        {
          label: "JavaScript",
          logo: "/javascript-logo.png",
        },
        {
          label: "GSAP",
          logo: "/placeholder.svg?height=24&width=24&text=GSAP",
        }
      ],
      position: { x: -10, y: 1, z: 0 },
      link: "https://example.com/project4",
    },
  ]
  
// Define the type for a portfolio item
export type PortfolioItem = typeof portfolioItems[number]
  