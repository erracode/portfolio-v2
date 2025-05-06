export interface Experience {
  id: string
  company: string
  role: string
  type: string
  startDate: string
  endDate: string | 'Present'
  location: string
  logo?: string
  description: string[]
  techStack: {
    label: string
    logo: string
  }[]
  position: [number, number, number]
}

export const experiences: Experience[] = [
  {
    id: 'advanced-research-engineering',
    company: 'SunDevs Inc',
    role: 'Software Engineer Junior Advanced',
    type: 'Contract',
    startDate: 'Jan 2023',
    endDate: 'Present',
    location: 'Colombia',
    logo: '/sundevs-logo.png',
    description: [
      'Part of the team in charge of Cinemark Colombia website, building the frontend with Next.js and React, and contributing to backend microservices.',
    ],
    techStack: [
      {
        label: 'React',
        logo: '/react-logo.png',
      },
      {
        label: 'Next.js',
        logo: '/nextjs-logo.png',
      },
      {
        label: 'MongoDB',
        logo: '/mongodb-logo.png',
      },
      {
        label: 'Redux',
        logo: '/redux-logo.png',
      },
      {
        label: 'NestJS',
        logo: '/nestjs-logo.png',
      },
      {
        label: 'Node.js',
        logo: '/nodejs-logo.png',
      },
      {
        label: 'Express',
        logo: '/express-logo.png',
      },
    ],
    position: [5, 1.5, -3],
  },
  {
    id: 'awsh-seasonal',
    company: 'Awsh',
    role: 'Software Engineer',
    type: 'Seasonal',
    startDate: 'Feb 2021',
    endDate: 'Present',
    location: 'United States',
    logo: '/awsh-logo.jpg',
    description: [
      'Developed scalable web applications and automated testing tools for cloud services.',
    ],
    techStack: [
      {
        label: 'JavaScript',
        logo: '/javascript-logo.png',
      },
      {
        label: 'React.js',
        logo: '/react-logo.png',
      },
      {
        label: 'Selenium JS',
        logo: '/selenium-logo.png',
      },
      {
        label: 'Node.js',
        logo: '/nodejs-logo.png',
      },
      {
        label: 'Express.js',
        logo: '/express-logo.png',
      },
      {
        label: 'WordPress',
        logo: '/wordpress-logo.png',
      },
      {
        label: 'PHP',
        logo: '/php-logo.png',
      },
      {
        label: 'CodeIgniter 4',
        logo: '/codeigniter-logo.png',
      },
      {
        label: 'MongoDB',
        logo: '/mongodb-logo.png',
      },
      {
        label: 'MySQL',
        logo: '/mysql-logo.png',
      },
      {
        label: 'Next.js',
        logo: '/nextjs-logo.png',
      },
      {
        label: 'PostgresSQL',
        logo: '/postgres-logo.png',
      },
      {
        label: 'PayloadCMS',
        logo: '/payloadcms-logo.png',
      },
      {
        label: 'Supabase',
        logo: '/supabase-logo.png',
      },
      {
        label: 'Zustand',
        logo: '/zustand-logo.png',
      },
      {
        label: 'Jotai',
        logo: '/jotai-logo.png',
      },
      {
        label: 'tRPC',
        logo: '/trpc-logo.png',
      },
    ],
    position: [0, 1.5, -5],
  },
  {
    id: 'studioweb-coordinator',
    company: 'Studio73',
    role: 'Web Coordinator',
    type: 'Full-time',
    startDate: 'Jan 2021',
    endDate: 'Jan 2023',
    location: 'Panamá, Panama',
    logo: '/studio-logo.png',
    description: [
      'Coordinated development of marketing websites, landing pages, and e-commerce platforms for various clients.',
    ],
    techStack: [
      {
        label: 'JavaScript',
        logo: '/javascript-logo.png',
      },
      {
        label: 'HTML5',
        logo: '/html-logo.png',
      },
      {
        label: 'CSS3',
        logo: '/css-logo.png',
      },
      {
        label: 'WordPress',
        logo: '/wordpress-logo.png',
      },
      {
        label: 'WooCommerce',
        logo: '/woocommerce-logo.png',
      },
    ],
    position: [-5, 1.5, -3],
  },
  {
    id: 'freelance-wordpress',
    company: 'Everythingwebsites',
    role: 'WordPress Developer',
    type: 'Freelance',
    startDate: 'Sep 2022',
    endDate: 'Nov 2022',
    location: 'Sacramento, CA',
    logo: '/everythingwebsites-logo.png',
    description: [
      'Provided freelance WordPress development and support for various client websites.',
    ],
    techStack: [
      {
        label: 'WordPress',
        logo: '/wordpress-logo.png',
      },
      {
        label: 'JavaScript',
        logo: '/javascript-logo.png',
      },
    ],
    position: [5, 1.5, 0],
  },
  {
    id: 'educonsult-backend',
    company: 'Eduqueo | Educational Consulting',
    role: 'Back End Developer',
    type: 'Freelance',
    startDate: 'Apr 2022',
    endDate: 'Jun 2022',
    location: 'Argentina',
    logo: '/eduqueo-logo.png',
    description: [
      'Built API infrastructure integrating Tasker inputs with Airtable and analytics dashboards.',
    ],
    techStack: [
      {
        label: 'Node.js',
        logo: '/nodejs-logo.png',
      },
      {
        label: 'Express.js',
        logo: '/express-logo.png',
      },
      {
        label: 'MySQL',
        logo: '/mysql-logo.png',
      },
      {
        label: 'Airtable',
        logo: '/airtable-logo.png',
      },
    ],
    position: [-5, 1.5, 0],
  },
  {
    id: 'pos-python-django',
    company: 'Inverdata',
    role: 'Programming',
    type: 'Full-time',
    startDate: 'Feb 2020',
    endDate: 'Mar 2021',
    location: 'Maracaibo, Venezuela',
    logo: '/talk-icon.png',
    // logo: '/inverdata-logo.png',
    description: [
      'Developed a point-of-sale system in Java and a Django-based inventory web application.',
    ],
    techStack: [
      {
        label: 'Java',
        logo: '/java-logo.png',
      },
      {
        label: 'Python',
        logo: '/python-logo.png',
      },
      {
        label: 'Django',
        logo: '/django-logo.png',
      },
      {
        label: 'PostgreSQL',
        logo: '/postgres-logo.png',
      },
    ],
    position: [0, 1.5, 5],
  },
]