/**
 * @file fallbackData.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Fallback content displayed when API data is unavailable.
 */

export const heroLines = [
    'Software Engineering Technology Student.',
    'React and Node developer crafting modern web apps.',
    'Problem solver. Team player. Lifelong learner.'
];

export const fallbackEducation = [
    {
        program: 'Software Engineering Technology (Co-op)',
        school: 'Centennial College',
        period: '2025 — Present',
        location: 'Toronto, Canada',
        details: [
            'GPA 4.39 / 4.5 while building modern web applications using React and Node.js.',
            'Developed console-based games in C# applying object-oriented programming principles.',
            'Designed and implemented relational databases with SQL, ERDs, and normalized schemas.',
            'Created UML diagrams, Software Requirements Specifications, and detailed system models.',
            'Collaborated on Agile team projects, pairing clean code with strong documentation.',
            'Strengthened foundations in QA, version control, and DevOps concepts for real projects.'
        ]
    }
];

export const fallbackProjects = [
    {
        title: 'C# Hangman Game',
        description: 'A console-based word guessing game built in C# applying OOP basics.',
        tags: ['C#', 'OOP', 'Game'],
        image: '/assets/projects/project-hangman.webp',
        github: 'https://github.com/AlexKachur98/csharp-hangman-game'
    },
    {
        title: 'Prestige Exotics Website',
        description: 'Luxury car showcase using HTML, CSS, JavaScript and jQuery animations.',
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        image: '/assets/projects/project-exotics.webp',
        github: 'https://github.com/AlexKachur98/comp125-dealership-website',
        live: 'https://studentweb.cencol.ca/akachur/COMP125%20Assignment%2006/home.html'
    },
    {
        title: 'React + Express Portfolio',
        description:
            'This site – a full-stack portfolio with animated sections, contact form, and CMS-ready backend.',
        tags: ['React', 'Express', 'Node.js'],
        image: '/assets/projects/portfolio.webp',
        github: 'https://github.com/AlexKachur98/react-express-portfolio',
        live: 'https://AlexKachur.dev'
    }
];

export const fallbackServices = [
    {
        title: 'General Programming',
        description: 'Clean, readable problem solving across C#, Java, and Python.',
        icon: '/assets/icons/python-svgrepo-com.svg',
        iconLabel: 'Python icon'
    },
    {
        title: 'Web Development',
        description: 'Building responsive, accessible UIs with React, Node.js, and JavaScript.',
        icon: '/assets/icons/react-svgrepo-com.svg',
        iconLabel: 'React logo'
    },
    {
        title: 'Databases & SQL',
        description: 'Designing relational schemas, ERDs, and performant SQL queries.',
        icon: '/assets/icons/sql-database-generic-svgrepo-com.svg',
        iconLabel: 'Database icon'
    },
    {
        title: 'Version Control',
        description: 'Git & GitHub workflows, branching strategies, and collaboration support.',
        icon: '/assets/icons/github-142-svgrepo-com.svg',
        iconLabel: 'GitHub mark'
    },
    {
        title: 'Custom PCs',
        description:
            'Parts selection, builds, and optimisation from budget to water-cooled systems.',
        icon: '/assets/icons/pc-creator-svgrepo-com.svg',
        iconLabel: 'PC builder icon'
    },
    {
        title: 'Peer Mentorship',
        description: 'Code reviews, debugging support, and study plans that accelerate learning.',
        icon: '/assets/icons/team-svgrepo-com.svg',
        iconLabel: 'Team collaboration icon'
    }
];
