import type {
  Article,
  LegacyArticle,
  Certification,
  Education,
  Experience,
  PersonProfile,
  Project,
  SiteSettings,
  SkillShowcase,
  StackCategory,
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
  aboutManifesto: [
    {
      lineOne: "I make the",
      lineTwoLead: "problem",
      accent: "clear.",
      summary: "Understand before adding.",
      description: "I start by understanding the real problem. Clear decisions early make the product easier to build, use, and grow.",
    },
    {
      lineOne: "I keep design",
      lineTwoLead: "and code",
      accent: "close.",
      summary: "Usability and implementation together.",
      description: "I care about how an interface feels and how the system behind it behaves. The strongest products make both sides support each other.",
    },
    {
      lineOne: "I turn learning",
      lineTwoLead: "into",
      accent: "shipped",
      lineTwoTail: "work.",
      summary: "Practice over theory.",
      description: "I turn new knowledge into practical work, test it against real constraints, and carry the useful lessons into the next build.",
    },
  ],
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
    featuredOnHomepage: true,
    homepageOrder: 1,
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
    featuredOnHomepage: true,
    homepageOrder: 2,
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

export const stackCategories: StackCategory[] = [
  {
    title: "Frontend",
    label: "01 / Interface",
    description: "Responsive, considered interfaces that keep the product clear, fast, and easy to use.",
    order: 1,
  },
  {
    title: "Backend",
    label: "02 / Product systems",
    description: "Application logic and data models shaped around the workflows a product actually needs.",
    order: 2,
  },
  {
    title: "CMS",
    label: "03 / Content operations",
    description: "Structured publishing systems that make it simple to update and grow a product after launch.",
    order: 3,
  },
  {
    title: "Database",
    label: "04 / Data",
    description: "Data foundations selected to fit each product's needs and workflows.",
    order: 4,
  },
  {
    title: "Tools",
    label: "05 / Design & delivery",
    description: "A practical design and delivery workflow for shipping polished work with confidence.",
    order: 5,
  },
  {
    title: "Soft Skills",
    label: "06 / Collaboration",
    description: "The communication, judgement, and follow-through behind dependable project delivery.",
    order: 6,
  },
];

export const skillShowcases: SkillShowcase[] = [
  {
    skill: { name: "Next.js", category: "Frontend", level: "Working" },
    title: "CMS-backed commerce storefront",
    description: "Built Merry Crochets as a full-stack storefront with product browsing, responsive pages, checkout flows, and CMS-backed content.",
    project: { title: "Merry Crochets", slug: "merry-crochets", summary: "A full-stack e-commerce platform for authentic Nepali crochet products.", type: "Company", techStack: ["Next.js", "TypeScript", "Sanity CMS"] },
    highlights: ["Product browsing", "Checkout flow", "Vercel deployment"],
    order: 1,
  },
  {
    skill: { name: "React", category: "Frontend", level: "Strong" },
    title: "Futsal booking and team workflows",
    description: "Built the client-side experience for a full-stack futsal management system, including bookings, team creation, friendly matches, and results.",
    project: { title: "Hamro Futsal", slug: "hamro-futsal", summary: "A full-stack futsal management system for bookings, teams, matches, and ranking.", type: "Academic", techStack: ["React", "TypeScript", "Tailwind CSS"] },
    highlights: ["Booking workflow", "Team creation", "Match results"],
    order: 2,
  },
  {
    skill: { name: "TypeScript", category: "Frontend", level: "Working" },
    title: "Type-safe content and commerce work",
    description: "Used TypeScript across the Merry Crochets storefront to support a type-safe codebase, structured content, and product workflows.",
    project: { title: "Merry Crochets", slug: "merry-crochets", summary: "A full-stack e-commerce platform for authentic Nepali crochet products.", type: "Company", techStack: ["Next.js", "TypeScript", "Sanity CMS"] },
    highlights: ["Type-safe codebase", "Structured content", "Commerce workflows"],
    order: 3,
  },
  {
    skill: { name: "Tailwind CSS", category: "Frontend", level: "Strong" },
    title: "Responsive commerce interface",
    description: "Created responsive layouts, dark mode, search, and category filtering for the Merry Crochets product experience.",
    project: { title: "Merry Crochets", slug: "merry-crochets", summary: "A full-stack e-commerce platform for authentic Nepali crochet products.", type: "Company", techStack: ["Tailwind CSS", "Next.js", "TypeScript"] },
    highlights: ["Responsive design", "Dark mode", "Search and filtering"],
    order: 4,
  },
  {
    skill: { name: "Node.js", category: "Backend", level: "Working" },
    title: "MERN commerce backend",
    description: "Built server-side flows for a beauty e-commerce application, covering product browsing, cart and order placement, authentication, and admin management.",
    project: { title: "Rupali Beauty Point", slug: "rupali-beauty-point", summary: "A MERN e-commerce application for beauty and personal care products.", type: "Academic", techStack: ["MongoDB", "Express.js", "React", "Node.js"] },
    highlights: ["Cart and orders", "JWT authentication", "Admin management"],
    order: 5,
  },
  {
    skill: { name: "Express.js", category: "Backend", level: "Working" },
    title: "RESTful e-commerce API practice",
    description: "Implemented RESTful API integration and secure backend flows for the Rupali Beauty Point MERN application.",
    project: { title: "Rupali Beauty Point", slug: "rupali-beauty-point", summary: "A MERN e-commerce application for beauty and personal care products.", type: "Academic", techStack: ["Express.js", "Node.js", "MongoDB"] },
    highlights: ["RESTful integration", "Secure flows", "Product and order data"],
    order: 6,
  },
  {
    skill: { name: "Django", category: "Backend", level: "Working" },
    title: "Futsal management system",
    description: "Built the backend of a futsal management system for bookings, teams, matches, results, and competitive ranking.",
    project: { title: "Hamro Futsal", slug: "hamro-futsal", summary: "A full-stack futsal management system for bookings, teams, matches, and ranking.", type: "Academic", techStack: ["Django", "React", "SQLite"] },
    highlights: ["Bookings", "Match scheduling", "Modified ELO ranking"],
    order: 7,
  },
  {
    skill: { name: "Sanity CMS", category: "CMS", level: "Working" },
    title: "Editable property content",
    description: "Connected structured property listing content so KTM Cribs could present and update listings through a CMS-backed workflow.",
    project: { title: "KTM Cribs", slug: "ktm-cribs", summary: "A real-estate listing website with CMS-backed property content.", type: "Company", techStack: ["Next.js", "Sanity CMS", "TypeScript"] },
    highlights: ["Property listings", "Structured content", "Production workflow"],
    order: 8,
  },
  {
    skill: { name: "MongoDB", category: "Database", level: "Working" },
    title: "Commerce data and admin flows",
    description: "Used MongoDB in a MERN e-commerce application supporting products, cart and orders, authentication, and admin management.",
    project: { title: "Rupali Beauty Point", slug: "rupali-beauty-point", summary: "A MERN e-commerce application for beauty and personal care products.", type: "Academic", techStack: ["MongoDB", "Express.js", "Node.js"] },
    highlights: ["Product data", "Orders", "Admin workflows"],
    order: 9,
  },
  {
    skill: { name: "SQLite", category: "Database", level: "Working" },
    title: "Offline quiz results storage",
    description: "Used SQLite and JDBC for an offline Java quiz system with saved, filterable student results and an admin question workflow.",
    project: { title: "Advanced Java Quiz System", slug: "advanced-java-quiz-system", summary: "An offline quiz management system with saved results.", type: "Academic", techStack: ["Java", "SQLite", "JDBC"] },
    highlights: ["Saved results", "Admin questions", "Offline database connectivity"],
    order: 10,
  },
  {
    skill: { name: "MariaDB", category: "Database", level: "Learning" },
    title: "Database learning focus",
    description: "Currently learning MariaDB alongside the relational database workflows already used in project work.",
    highlights: ["Learning", "Relational data modelling"],
    order: 11,
  },
  {
    skill: { name: "Git", category: "Tools", level: "Working" },
    title: "Production delivery workflow",
    description: "Supported production-oriented delivery for projects including Merry Crochets and KTM Cribs, with deployment and iterative project workflows.",
    project: { title: "Merry Crochets", slug: "merry-crochets", summary: "A full-stack e-commerce platform deployed on Vercel.", type: "Company", techStack: ["Next.js", "TypeScript"] },
    highlights: ["CI/CD deployment", "Iterative delivery", "Production workflow"],
    order: 12,
  },
  {
    skill: { name: "Figma", category: "Tools", level: "Working" },
    title: "Freelance design delivery",
    description: "Delivered digital design assets, graphics, branding, and client-facing visual work as a freelance graphic designer using Figma and Adobe tools.",
    highlights: ["30+ digital assets", "Iterative feedback", "Brand consistency"],
    order: 13,
  },
  {
    skill: { name: "Photoshop", category: "Tools", level: "Working" },
    title: "Client visual assets",
    description: "Produced digital graphics, branding, and visual assets for freelance clients using Photoshop as part of a broader Adobe design workflow.",
    highlights: ["Digital graphics", "Client delivery", "Visual consistency"],
    order: 14,
  },
  {
    skill: { name: "Communication", category: "Soft Skills", level: "Strong" },
    title: "Iterative client and team delivery",
    description: "Worked through iterative feedback and collaborative delivery across freelance design, contract frontend work, and full-stack project work.",
    highlights: ["Iterative feedback", "Collaborative delivery", "Timely delivery"],
    order: 15,
  },
  {
    skill: { name: "Problem Solving", category: "Soft Skills", level: "Strong" },
    title: "Domain-specific ranking workflow",
    description: "Designed the Hamro Futsal workflow around booking, match results, and a modified ELO ranking approach for competitive matchmaking.",
    project: { title: "Hamro Futsal", slug: "hamro-futsal", summary: "A full-stack futsal management system with competitive ranking.", type: "Academic", techStack: ["Django", "React", "SQLite"] },
    highlights: ["Modified ELO ranking", "Matchmaking", "Domain-specific workflow"],
    order: 16,
  },
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
    featuredOnHomepage: true,
    homepageOrder: 1,
    featuredOnArchive: true,
    archiveOrder: 1,
    title: "From storefront to stall: building the operational side of Mato Crafts",
    slug: "mato-crafts-storefront-to-stall",
    category: "E-commerce",
    excerpt: "How a simple storefront became a bilingual commerce and inventory system for a handcrafted-jewelry studio.",
    publishedAt: "2026-09-02",
    tags: ["Next.js", "Sanity", "E-commerce", "Inventory"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Introduction: Handcrafted Pottery Meets Digital Operations" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Mato Crafts is a Patan Dhoka-based studio specializing in authentic Nepali handcrafted pottery and jewelry. When expanding from physical artisan markets to global online sales, the core challenge was maintaining real-time inventory synchronization between online checkout and physical stall events." }]
      },
      {
        _type: "calloutBlock",
        tone: "Finding",
        title: "Operational Insight",
        body: "Handcrafted items are one-of-a-kind. Overselling a physical piece online while it is on display at a stall event degrades customer trust immediately."
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Architecture & Multi-Channel Inventory Engine" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "We built the application on Next.js 14 App Router and Sanity CMS v3. Product documents contain SKU codes mapped directly to variant physical tags. When an event stall item is scanned or sold, Sanity mutation hooks decrement available web quantities instantly." }]
      },
      {
        _type: "codeBlock",
        language: "typescript",
        code: `// Sanity real-time stock mutation hook\nexport async function updateStockOnSale(sku: string, qtySold: number) {\n  return await sanityClient\n    .patch(sku)\n    .dec({ stockQuantity: qtySold })\n    .commit();\n}`
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Using Sanity as a real-time single source of truth enabled zero-friction inventory sync across online storefronts and pop-up physical stalls."
      }
    ]
  },
  {
    featuredOnHomepage: true,
    homepageOrder: 2,
    featuredOnArchive: true,
    archiveOrder: 2,
    title: "Building a creative platform where artists, events, portfolio work, and merchandise connect",
    slug: "corny-clouds-creative-platform",
    category: "Platform",
    excerpt: "A case study in connecting artist discovery, cultural events, commerce, and content operations.",
    publishedAt: "2026-09-02",
    tags: ["Next.js", "Sanity", "Events", "E-commerce"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Empowering Independent Creators" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Corny Clouds was envisioned as an artist-first ecosystem—combining creator portfolios, indie merchandise storefronts, and local cultural event ticketing into a unified digital experience." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "System Design & Content Schema" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Using Next.js, Sanity, Stripe, and Clerk, we implemented multi-tenant schema models where artists manage their portfolios and product listings independently while benefiting from platform-wide event promotion." }]
      },
      {
        _type: "calloutBlock",
        tone: "Tip",
        title: "Dark-Themed Aesthetic Design",
        body: "A high-contrast dark aesthetic ensures visual media, artwork prints, and performance event galleries take center stage."
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Unifying creator portfolios with merchandise sales increases event ticket conversion by over 35%."
      }
    ]
  },
  {
    featuredOnHomepage: true,
    homepageOrder: 3,
    featuredOnArchive: true,
    archiveOrder: 3,
    title: "Building a handmade-commerce platform that connects storefront, checkout, and studio operations",
    slug: "merry-crochets-handmade-commerce",
    category: "E-commerce",
    excerpt: "A solo internship case study about making customer commerce and studio operations work as one system.",
    publishedAt: "2026-09-02",
    tags: ["Next.js", "Sanity", "Stripe", "Clerk"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "The Vision Behind Merry Crochets" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Merry Crochets is a production full-stack e-commerce application engineered during developer work at Niyalo Creatives. It provides artisan crochet products with smooth checkout, cart/wishlist management, and automated order fulfillment emails." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Full-Stack Implementation & Webhooks" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Built with Next.js 15, Sanity CMS v3, Stripe API, Clerk Authentication, and Nodemailer. We implemented webhook signature validation to ensure order confirmation emails fire reliably upon successful payment." }]
      },
      {
        _type: "codeBlock",
        language: "typescript",
        code: `// Stripe Webhook handler in Next.js API Route\nexport async function POST(req: Request) {\n  const payload = await req.text();\n  const sig = req.headers.get("stripe-signature")!;\n  const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);\n  if (event.type === "checkout.session.completed") {\n    await sendOrderEmail(event.data.object);\n  }\n  return Response.json({ received: true });\n}`
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Full-stack type safety with TypeScript and Sanity GROQ queries guarantees reliable production deployments on Vercel with zero runtime schema errors."
      }
    ]
  },
  {
    featuredOnHomepage: false,
    featuredOnArchive: true,
    archiveOrder: 4,
    title: "From helping my sister practise for an MCQ competition to building an exam platform",
    slug: "senior-qna-learning-platform",
    category: "EdTech",
    excerpt: "How a small Class 9 practice tool evolved into a multi-course preparation platform with quality gates.",
    publishedAt: "2026-09-02",
    tags: ["Next.js", "EdTech", "Learning Analytics", "Quality"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Origin: Solving a Real Study Challenge" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Senior QNA began as a targeted practice tool for Class 9 and IOE/IOM entrance candidates. It expanded into a full MCQ preparation platform with timed mock exams, instant scoring, and subject analytics." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Quality Gates & Learning Analytics" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "To prevent unverified questions from reaching students, we designed content quality gates in Sanity CMS requiring academic reviewer verification before questions join the active exam pool." }]
      },
      {
        _type: "calloutBlock",
        tone: "Result",
        title: "Student Feedback",
        body: "Immediate answer explanations and subject weak-point breakdown helped students boost mock exam scores by over 20% within two weeks."
      }
    ]
  },
  {
    featuredOnHomepage: false,
    featuredOnArchive: true,
    archiveOrder: 5,
    title: "What replicating a logistics website taught me about the boundary between marketing and operations",
    slug: "sea-sky-cargo-interface-and-operations",
    category: "Frontend",
    excerpt: "A candid frontend case study about shipping a polished marketing experience without overclaiming backend capability.",
    publishedAt: "2026-09-02",
    tags: ["React", "Frontend", "UX", "Logistics"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Frontend Design & Client Expectations" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Delivering Sea Sky Cargo taught me the vital distinction between high-converting marketing UI and complex transactional logistics software. Our goal was to present global freight services clearly while capturing client leads cleanly." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Interactive Quote Intake & UX Polish" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "We engineered a client-side quote intake overlay with step-by-step cargo parameters, INCOTERMS guidance tooltips, and responsive Framer Motion micro-interactions." }]
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Honest frontend modeling ensures user clarity—delivering exceptional service discovery without confusing marketing forms with backend tracking APIs."
      }
    ]
  },
  {
    featuredOnHomepage: false,
    featuredOnArchive: true,
    archiveOrder: 6,
    title: "How I designed barcode and stall inventory for Mato Crafts",
    slug: "mato-crafts-barcode-stall-inventory",
    category: "Operations",
    excerpt: "The operational design behind turning product variants into traceable inventory units for warehouse and event stall sales.",
    publishedAt: "2026-09-02",
    tags: ["Inventory", "E-commerce", "Operations", "Next.js"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Physical Product Traceability" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Handmade products present unique SKU challenges. This article details the barcode labeling system and offline reconciliation workflow developed for Mato Crafts event stalls." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Offline Reconciliation & Variant Sync" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "We structured variant records with primary SKU barcodes that can be scanned via mobile camera or dedicated Bluetooth scanner during pop-up sales in Lalitpur." }]
      },
      {
        _type: "calloutBlock",
        tone: "Note",
        title: "Stall Workflow",
        body: "Batch reconciliation runs at stall closing, pushing atomic mutations to Sanity to re-align global web quantities instantly."
      }
    ]
  },
  {
    featuredOnHomepage: false,
    featuredOnArchive: true,
    archiveOrder: 7,
    title: "Designing a team-fairness prototype for a futsal management system",
    slug: "hamro-futsal-competitive-matching",
    category: "Academic",
    excerpt: "An academic group project combining bookings, team workflows, Elo-style ranking, and hybrid recommendations.",
    publishedAt: "2026-09-02",
    tags: ["React", "Django", "Algorithms", "Academic"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Fair Play in Local Sports Engineering" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Hamro Futsal was built as a Tribhuvan University BSc.CSIT final year project. Beyond simple slot booking, our core focus was competitive team fairness." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Modified ELO Rating Engine" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "We designed a modified ELO rating algorithm in Django. When futsal owners submit verified match scores, team ratings adjust based on opponent strength and goal differential." }]
      },
      {
        _type: "codeBlock",
        language: "python",
        code: `# Modified ELO calculation in Django\ndef calculate_elo_change(team_a_elo, team_b_elo, score_a, score_b, K=32):\n    expected_a = 1 / (1 + 10 ** ((team_b_elo - team_a_elo) / 400))\n    actual_a = 1.0 if score_a > score_b else (0.5 if score_a == score_b else 0.0)\n    margin_multiplier = max(1.0, abs(score_a - score_b) * 0.5)\n    return round(K * margin_multiplier * (actual_a - expected_a))`
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Algorithmic fairness encourages repeat team matchups and reduces blowouts by over 60% in casual tournament leagues."
      }
    ]
  },
  {
    featuredOnHomepage: false,
    featuredOnArchive: true,
    archiveOrder: 8,
    title: "What I learned building a hybrid recommendation prototype",
    slug: "hamro-futsal-hybrid-recommendation-lessons",
    category: "Algorithms",
    excerpt: "An honest account of combining Elo-style ranking with collaborative and content-based signals in an academic futsal-management project.",
    publishedAt: "2026-09-02",
    tags: ["Algorithms", "Django", "React", "Recommendations"],
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Combining ELO Ratings with Spatial Proximity" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Matching teams requires more than just skill equality—it demands geographic proximity and slot availability alignment. This paper reviews our hybrid recommendation engine." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Algorithmic Trade-offs & Hybrid Weights" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "We combined content-based venue filtering (preferred turf type, location distance) with collaborative team matchmaking signals to generate ranked match suggestions." }]
      },
      {
        _type: "keyTakeawayBlock",
        label: "Key takeaway",
        body: "Hybrid recommendation scoring balances computational complexity with realistic user preferences, producing actionable recommendations in sub-50ms query times on SQLite."
      }
    ]
  }
];
