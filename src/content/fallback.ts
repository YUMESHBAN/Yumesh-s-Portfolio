import type {
  Article,
  Certification,
  Education,
  Experience,
  PersonProfile,
  Project,
  SiteSettings,
  Skill,
} from "@/types/content";

export const siteSettings: SiteSettings = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://yumeshban.com",
  title: "Yumesh Ban - Full Stack Developer in Kathmandu, Nepal",
  description:
    "Yumesh Ban is a full stack developer from Kathmandu, Nepal, building production web applications with Next.js, Sanity, React, Node.js, Django, and modern databases.",
  keywords: [
    "Yumesh Ban",
    "Who is Yumesh Ban",
    "Yumesh Ban portfolio",
    "Full Stack Developer Kathmandu",
    "Next.js developer Nepal",
  ],
  cvUrl: "/Yumesh-Ban-CV.pdf",
};

export const personProfile: PersonProfile = {
  name: "Yumesh Ban",
  headline:
    "Full Stack Developer | Node.js, Express, MongoDB, React | Next.js in Progress | Building Projects and Sharpening Real-World Skills",
  location: "Kathmandu, Nepal",
  email: "yumeshban365@gmail.com",
  phone: "+977-9863322903",
  image: "https://avatars.githubusercontent.com/u/173427000?v=4",
  shortBio:
    "I bring together frontend craft, reliable backend development, and practical SEO to create fast, useful experiences.",
  longBio: [
    "Yumesh Ban is a full stack developer from Kathmandu, Nepal. He builds web applications with Next.js, Sanity, React, Node.js, Express, MongoDB, Django, and practical UI systems.",
    "He recently completed BSc.CSIT from Tribhuvan University with 80%+ overall and 90.8% in the final semester. His work combines academic fundamentals, production delivery, and a design background from years of freelance graphic and video work.",
    "His portfolio highlights production-style projects, current developer experience at Niyalo Creatives, e-commerce builds, management systems, and academic projects that show his growth from student builder to professional developer.",
  ],
  degree: "Bachelor of Science in Computer Science and Information Technology",
  overallPercentage: "80%+",
  finalSemesterPercentage: "90.8%",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ban-yumesh" },
    { label: "GitHub", href: "https://github.com/YUMESHBAN" },
    { label: "X", href: "https://x.com/YumeshBan" },
  ],
};

export const projects: Project[] = [
  {
    title: "Merry Crochets",
    slug: "merry-crochets",
    type: "Company",
    association: "Niyalo Creatives",
    dateRange: "Dec 2025 - Jan 2026",
    summary:
      "A full-stack e-commerce platform for authentic Nepali crochet products, built with modern checkout, product filtering, admin management, and CMS-backed content.",
    role: "Full Stack Developer",
    techStack: ["Next.js", "TypeScript", "Sanity CMS", "Stripe", "Clerk", "Tailwind CSS", "Nodemailer"],
    features: [
      "Complete checkout flow with cart and wishlist",
      "Stripe payment integration with webhooks",
      "Automated order confirmation and status update emails",
      "Admin dashboard for order and product management",
      "Dark mode, responsive design, search, and category filtering",
      "CI/CD deployment on Vercel",
    ],
    impact: [
      "95+ Lighthouse performance score",
      "Type-safe codebase with TypeScript",
      "Scalable architecture with API routes",
      "Role-based admin access",
    ],
    liveUrl: "https://merry-crochets.vercel.app/",
    featured: true,
    order: 1,
  },
  {
    title: "KTM Cribs",
    slug: "ktm-cribs",
    type: "Company",
    association: "Niyalo Creatives",
    dateRange: "Nov 2025 - Dec 2025",
    summary:
      "A real-estate listing website built during internship work at Niyalo Creatives, focused on clean listing presentation and CMS-backed property content.",
    role: "Full Stack Developer",
    techStack: ["Next.js", "Sanity CMS", "TypeScript", "Responsive UI"],
    features: [
      "CMS-backed property listing pages",
      "Responsive listing layout",
      "Clean property browsing experience",
      "Production deployment workflow",
    ],
    impact: [
      "Implemented dynamic project content",
      "Improved property content management",
      "Deployed a production-ready website",
    ],
    liveUrl: "https://ktmcribs-yban.vercel.app/",
    featured: true,
    order: 2,
  },
  {
    title: "Hamro Futsal",
    slug: "hamro-futsal",
    type: "Academic",
    association: "Tribhuvan University",
    dateRange: "Jun 2025 - Aug 2025",
    summary:
      "A full-stack futsal management system for bookings, teams, friendly matches, results, and competitive ranking.",
    role: "Full Stack Developer",
    techStack: ["Django", "React", "TypeScript", "Tailwind CSS", "SQLite"],
    features: [
      "Futsal booking workflow",
      "Team creation and friendly match scheduling",
      "Result submission by futsal owners",
      "Competitive matchmaking and modified ELO ranking",
    ],
    impact: [
      "Designed a domain-specific algorithm workflow",
      "Connected frontend and backend responsibilities",
      "Created a complete management-system experience",
    ],
    repoUrl: "https://github.com/YUMESHBAN/Futsal-Management-System",
    featured: true,
    order: 3,
  },
  {
    title: "Rupali Beauty Point",
    slug: "rupali-beauty-point",
    type: "Academic",
    association: "Tribhuvan University",
    dateRange: "Jun 2024 - Aug 2024",
    summary:
      "A MERN e-commerce application for beauty and personal care products with customer browsing, cart, order placement, and admin management.",
    role: "Full Stack Developer",
    techStack: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Tailwind CSS"],
    features: [
      "Product browsing and search",
      "Cart and order placement",
      "Admin dashboard for inventory and orders",
      "JWT-based authentication",
    ],
    impact: [
      "Practiced RESTful API integration",
      "Built modular React frontend components",
      "Implemented secure backend flows",
    ],
    repoUrl: "https://github.com/YUMESHBAN/E-commerce-Website",
    featured: true,
    order: 4,
  },
  {
    title: "Advanced Java Quiz System",
    slug: "advanced-java-quiz-system",
    type: "Academic",
    association: "Tribhuvan University",
    dateRange: "2025",
    summary:
      "An offline quiz management system with an admin panel, student quiz flow, instant scoring, and saved results.",
    role: "Java Developer",
    techStack: ["Java", "Java Swing", "SQLite", "JDBC"],
    features: [
      "Admin panel for adding quiz questions",
      "Student interface for subject-wise quizzes",
      "Instant score feedback",
      "Saved and filterable student results",
    ],
    impact: [
      "Built a complete desktop application",
      "Practiced offline database connectivity",
      "Structured UI screens with Java Swing",
    ],
    repoUrl: "https://github.com/YUMESHBAN/Offline-Quiz-In-Java",
    featured: true,
    order: 5,
  },
  {
    title: "Sea Sky Cargo Website",
    slug: "sea-sky-cargo-website",
    type: "Freelance",
    association: "Sea Sky Cargo Service Pvt. Ltd.",
    dateRange: "Mar 2025 - Jun 2025",
    summary:
      "A responsive cargo and logistics frontend aligned with brand goals and designed to improve digital presence.",
    role: "Junior Frontend Developer",
    techStack: ["React", "TypeScript", "Vite", "Responsive UI", "UI Design"],
    features: [
      "Responsive company landing page",
      "Cargo and logistics service presentation",
      "Brand-aligned visual design",
      "User-friendly frontend structure",
    ],
    impact: [
      "Delivered on time during contract work",
      "Improved visual appeal and user experience",
      "Built practical frontend delivery experience",
    ],
    repoUrl: "https://github.com/YUMESHBAN/Seasky-Cargo-Landing-Page",
    featured: true,
    order: 6,
  },
];

export const experiences: Experience[] = [
  {
    company: "Niyalo Creatives",
    role: "Full Stack Developer",
    employmentType: "Internship",
    location: "Kathmandu, Nepal",
    workMode: "Hybrid",
    dateRange: "Dec 2025 - Present",
    current: true,
    summary:
      "Working on real-world web projects with Next.js, Sanity, e-commerce flows, dashboards, and production deployment practices.",
    achievements: [
      "Built and deployed full-stack projects including Merry Crochets and KTM Cribs",
      "Worked with Sanity CMS, Next.js, TypeScript, Stripe, Clerk, and Vercel",
      "Practiced production workflows, admin dashboards, emails, and CMS content modeling",
    ],
    skills: ["Next.js", "Sanity CMS", "TypeScript", "Stripe", "Clerk", "Vercel"],
  },
  {
    company: "Sea Sky Cargo Service Pvt. Ltd.",
    role: "Junior Frontend Developer",
    employmentType: "Contract",
    location: "Kathmandu District, Nepal",
    workMode: "Hybrid",
    dateRange: "Mar 2025 - Jun 2025",
    current: false,
    summary:
      "Delivered a responsive frontend for a logistics and cargo service brand, with attention to layout, usability, and brand consistency.",
    achievements: [
      "Delivered a user-friendly frontend aligned with brand goals",
      "Enhanced visual appeal and user experience",
      "Contributed to on-time project delivery as a collaborative team member",
    ],
    skills: ["React", "UI Design", "Responsive Frontend"],
  },
  {
    company: "Freelance",
    role: "Freelance Graphic Designer",
    employmentType: "Freelance",
    location: "Kathmandu, Nepal",
    workMode: "Hybrid",
    dateRange: "Feb 2021 - Present",
    current: true,
    summary:
      "Delivered digital design assets, graphics, branding, and video content for clients using Adobe Suite, Illustrator, Photoshop, and Figma.",
    achievements: [
      "Delivered 30+ digital assets",
      "Incorporated iterative feedback for timely delivery",
      "Built visual consistency tailored to client audiences",
    ],
    skills: ["Figma", "Photoshop", "Illustrator", "Brand Design"],
  },
  {
    company: "No Idea YouTube Channel",
    role: "Assistant Video Editor",
    employmentType: "Full-time",
    location: "Kathmandu, Nepal",
    workMode: "On-site",
    dateRange: "Mar 2019 - Jul 2020",
    current: false,
    summary:
      "Assisted with story-driven edits, audio synchronization, visual effects, and video quality control.",
    achievements: [
      "Edited and produced videos for stronger viewer engagement",
      "Worked alongside lead editors to shape rough cuts",
      "Managed project timelines while maintaining quality",
    ],
    skills: ["Offline Editing", "Audio Synchronization", "Video Editing"],
  },
];

export const education: Education[] = [
  {
    institution: "Tribhuvan University",
    degree: "BSc.CSIT",
    level: "Bachelor",
    dateRange: "May 2022 - Apr 2026",
    location: "Bhaktapur Multiple Campus, Bhaktapur",
    summary:
      "Completed Bachelor of Science in Computer Science and Information Technology with 80%+ overall and 90.8% in the final semester.",
    achievements: [
      "80%+ overall percentage",
      "90.8% in final semester",
      "Ranked 1st out of 72 students in 4th and 6th semesters",
    ],
    resultEntries: [
      {
        label: "Final Semester",
        percentage: 90.8,
        note: "Manual starting result. Add each semester from Studio to calculate the full bachelor average.",
        showOnWebsite: true,
      },
    ],
    showResultStats: true,
    showResultEntries: true,
    showOnWebsite: true,
  },
  {
    institution: "Nobel Academy",
    degree: "Higher Secondary Education, Science Stream",
    level: "+2",
    dateRange: "2018 - 2020",
    location: "Naya Baneshwor, Kathmandu",
    summary: "Completed higher secondary education with CGPA 3.36.",
    achievements: ["Science stream", "CGPA 3.36"],
    resultEntries: [],
    showResultStats: true,
    showResultEntries: true,
    showOnWebsite: true,
  },
  {
    institution: "Lyceum Paradise Academy",
    degree: "Secondary Education Examination",
    level: "Secondary",
    dateRange: "2018",
    location: "Kathmandu, Nepal",
    summary: "Completed SEE with GPA 3.70.",
    achievements: ["GPA 3.70", "Highest-scoring male student in the batch"],
    resultEntries: [],
    showResultStats: true,
    showResultEntries: true,
    showOnWebsite: true,
  },
];

export const skills: Skill[] = [
  { name: "Next.js", category: "Frontend", level: "Working", order: 1 },
  { name: "React", category: "Frontend", level: "Strong", order: 2 },
  { name: "TypeScript", category: "Frontend", level: "Working", order: 3 },
  { name: "Tailwind CSS", category: "Frontend", level: "Strong", order: 4 },
  { name: "Node.js", category: "Backend", level: "Working", order: 5 },
  { name: "Express.js", category: "Backend", level: "Working", order: 6 },
  { name: "Django", category: "Backend", level: "Working", order: 7 },
  { name: "Sanity CMS", category: "CMS", level: "Working", order: 8 },
  { name: "MongoDB", category: "Database", level: "Working", order: 9 },
  { name: "SQLite", category: "Database", level: "Working", order: 10 },
  { name: "MariaDB", category: "Database", level: "Learning", order: 11 },
  { name: "Git", category: "Tools", level: "Working", order: 12 },
  { name: "Figma", category: "Tools", level: "Working", order: 13 },
  { name: "Photoshop", category: "Tools", level: "Working", order: 14 },
  { name: "Communication", category: "Soft Skills", level: "Strong", order: 15 },
  { name: "Problem Solving", category: "Soft Skills", level: "Strong", order: 16 },
];

export const certifications: Certification[] = [
  {
    title: "Node.js, Express, MongoDB and More",
    issuer: "Udemy - Jonas Schmedtmann",
    date: "2025",
    description: "Backend development certification covering Node.js, Express, MongoDB, APIs, and server-side fundamentals.",
  },
  {
    title: "EF SET English Certificate",
    issuer: "EF SET",
    date: "Nov 2025",
    description: "C1 Advanced English level with a 70/100 EF SET score.",
  },
  {
    title: "Top 60 Learner - 60 Days of Learning",
    issuer: "Leapfrog Student Partnership Program",
    date: "2025",
    description: "Recognized as one of the Top 60 learners for consistency and curiosity in the learning challenge.",
  },
  {
    title: "Web Design for Web Developers",
    issuer: "Udemy",
    date: "2023",
    description: "Web design principles for better layouts, hierarchy, and user interfaces.",
  },
];

export const articles: Article[] = [
  {
    title: "Who is Yumesh Ban?",
    slug: "who-is-yumesh-ban",
    excerpt:
      "A short introduction to Yumesh Ban, a full stack developer from Kathmandu, Nepal, and recent BSc.CSIT graduate.",
    publishedAt: "2026-06-15",
    tags: ["Personal Brand", "Career", "Yumesh Ban"],
    body: [
      "Yumesh Ban is a full stack developer from Kathmandu, Nepal. He works with Next.js, Sanity, React, Node.js, Express, MongoDB, Django, and practical UI systems.",
      "He completed BSc.CSIT from Tribhuvan University with 80%+ overall and 90.8% in the final semester. His work is shaped by academic fundamentals, production project experience, and a creative background in design and video editing.",
      "This website is the official hub for his projects, writing, experience, and public developer identity.",
    ],
  },
  {
    title: "How I Built Merry Crochets with Next.js, Sanity, Stripe, and Clerk",
    slug: "merry-crochets-nextjs-sanity-stripe-clerk",
    excerpt:
      "A project story about building a full-stack e-commerce platform with checkout, CMS content, authentication, and admin management.",
    publishedAt: "2026-06-15",
    tags: ["Next.js", "Sanity", "E-commerce"],
    body: [
      "Merry Crochets is a full-stack e-commerce platform for authentic Nepali crochet products. The project combines product browsing, cart and wishlist flows, payments, admin management, email automation, and CMS-backed content.",
      "The core stack includes Next.js, TypeScript, Sanity CMS, Stripe, Clerk, Tailwind CSS, and Nodemailer. Each tool solves a different problem: Next.js renders the application, Sanity manages content, Stripe handles payments, and Clerk protects user/admin flows.",
      "The result is a production-style project that demonstrates full-stack thinking, not only frontend screens.",
    ],
  },
  {
    title: "My Journey from BSc.CSIT Student to Full Stack Developer",
    slug: "bsc-csit-student-to-full-stack-developer",
    excerpt:
      "A career story about moving from academic projects to production-oriented web development.",
    publishedAt: "2026-06-15",
    tags: ["BSc.CSIT", "Career", "Full Stack"],
    body: [
      "My development journey started with academic projects in C, C++, Java, data structures, and system design. Those fundamentals helped me understand how software behaves below the surface.",
      "Over time, I moved into web development with React, Node.js, Express, MongoDB, Django, Next.js, and Sanity. Projects like Hamro Futsal, Rupali Beauty Point, KTM Cribs, and Merry Crochets helped connect theory with real-world delivery.",
      "Completing BSc.CSIT with 80%+ overall and 90.8% in the final semester gave me a strong academic close, while company project work gave me practical confidence.",
    ],
  },
];
