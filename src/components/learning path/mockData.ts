// export const industries = ["All Industries", "Technology", "Education", "Health", "Marketing", "Design & Creative"];
// export const growthRates = ["All Growth Rates", "High Growth", "Medium Growth", "Stable Growth"];

// export const learningPaths = [
//   {
//     id: "ux-ui-designer",
//     title: "UX/UI Designer",
//     industry: "Design & Creative",
//     growth: "High Growth",
//     courses: 4,
//     hours: 24,
//     progress: 33,
//     image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
//     levels: [
//       {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 2,
//         color: "bg-[#22C55E]", // Green
//         courses: [
//           {
//             title: "Introduction to UX Design",
//             description: "Learn the fundamentals of user experience design including research methods, wireframing, and prototyping.",
//             hours: 8,
//             status: "Complete",
//             image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=200&q=80"
//           },
//           {
//             title: "Figma for Beginners",
//             description: "Master Figma, the industry-standard design tool for creating user interfaces and prototypes.",
//             hours: 8,
//             status: "Incomplete",
//             image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=200&q=80"
//           }
//         ]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 1,
//         color: "bg-[#4A5DF9]", // Blue
//         courses: [
//           {
//             title: "User Research & Personas",
//             description: "Deep dive into conducting user interviews and synthesizing data into actionable user personas.",
//             hours: 4,
//             status: "Incomplete",
//             image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&q=80"
//           }
//         ]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]", // Purple
//         courses: [
//           {
//             title: "Advanced Prototyping & Micro-interactions",
//             description: "Learn to create high-fidelity prototypes with complex animations and micro-interactions.",
//             hours: 4,
//             status: "Incomplete",
//             image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=200&q=80"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: "data-scientist",
//     title: "Data Scientists",
//     industry: "Technology",
//     growth: "High Growth",
//     courses: 5,
//     hours: 60,
//     progress: 0,
//     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
//     levels: [
//       {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 2,
//         color: "bg-[#22C55E]",
//         courses: [
//           { title: "Python for Data Science", description: "Learn Python fundamentals tailored for data manipulation.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" },
//           { title: "Statistics 101", description: "Core statistical concepts needed for data analysis.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" }
//         ]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 2,
//         color: "bg-[#4A5DF9]",
//         courses: [
//           { title: "Machine Learning Basics", description: "Introduction to scikit-learn and predictive modeling.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" },
//           { title: "Data Visualization", description: "Creating dashboards with Tableau and PowerBI.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" }
//         ]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]",
//         courses: [
//           { title: "Deep Learning & Neural Networks", description: "Advanced predictive modeling using TensorFlow.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" }
//         ]
//       }
//     ]
//   },
//   {
//     id: "marketing-manager",
//     title: "Digital Marketing Manager",
//     industry: "Marketing",
//     growth: "Medium Growth",
//     courses: 3,
//     hours: 30,
//     progress: 0,
//     image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
//     levels: [
//       {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 1,
//         color: "bg-[#22C55E]",
//         courses: [{ title: "SEO Fundamentals", description: "Basics of search engine optimization.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 1,
//         color: "bg-[#4A5DF9]",
//         courses: [{ title: "Paid Advertising (PPC)", description: "Managing Google and Facebook ads.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]",
//         courses: [{ title: "Marketing Analytics", description: "Using Google Analytics to drive ROI.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=200&q=80" }]
//       }
//     ]
//   },
//   {
//     id: "health-informatics",
//     title: "Health Informatics Specialist",
//     industry: "Health",
//     growth: "Stable Growth",
//     courses: 3,
//     hours: 45,
//     progress: 0,
//     image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
//     levels: [
//       {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 1,
//         color: "bg-[#22C55E]",
//         courses: [{ title: "Intro to Healthcare Systems", description: "Overview of modern healthcare infrastructure.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 1,
//         color: "bg-[#4A5DF9]",
//         courses: [{ title: "Electronic Health Records (EHR)", description: "Managing and securing patient data.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]",
//         courses: [{ title: "Healthcare Data Analytics", description: "Applying data science to improve patient outcomes.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80" }]
//       }
//     ]
//   },
//   {
//     id: "instructional-designer",
//     title: "Instructional Designer",
//     industry: "Education",
//     growth: "Medium Growth",
//     courses: 3,
//     hours: 35,
//     progress: 0,
//     image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
//     levels: [
//       {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 1,
//         color: "bg-[#22C55E]",
//         courses: [{ title: "Learning Theories", description: "How adults learn and retain information.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 1,
//         color: "bg-[#4A5DF9]",
//         courses: [{ title: "Curriculum Development", description: "Structuring effective course modules.", hours: 15, status: "Incomplete", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]",
//         courses: [{ title: "E-Learning Authoring Tools", description: "Building interactive courses with Articulate Storyline.", hours: 10, status: "Incomplete", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&q=80" }]
//       }
//     ]
//   },
//   {
//     id: "software-engineer",
//     title: "Software Engineering",
//     industry: "Technology",
//     growth: "High Growth",
//     courses: 4,
//     hours: 80,
//     progress: 0,
//     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
//     levels: [
//        {
//         id: "beginner",
//         title: "Beginner",
//         courseCount: 2,
//         color: "bg-[#22C55E]",
//         courses: [
//           { title: "Intro to Computer Science", description: "Basic programming constructs.", hours: 20, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80" },
//           { title: "Data Structures", description: "Arrays, lists, and trees.", hours: 20, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80" }
//         ]
//       },
//       {
//         id: "intermediate",
//         title: "Intermediate",
//         courseCount: 1,
//         color: "bg-[#4A5DF9]",
//         courses: [{ title: "Algorithms", description: "Sorting and searching algorithms.", hours: 20, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80" }]
//       },
//       {
//         id: "advanced",
//         title: "Advanced",
//         courseCount: 1,
//         color: "bg-[#A855F7]",
//         courses: [{ title: "System Design", description: "Architecting large scale applications.", hours: 20, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80" }]
//       }
//     ]
//   }
// ];

export const industries = ["All Industries", "Technology", "Education", "Health", "Marketing", "Design & Creative"];
export const growthRates = ["All Growth Rates", "High Growth", "Medium Growth", "Stable Growth"];

export const learningPaths = [
  {
    id: "ux-ui-designer",
    title: "UX/UI Designer",
    industry: "Design & Creative",
    growth: "High Growth",
    courses: 4,
    hours: 24,
    progress: 33,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          {
            id: "ux-intro",
            title: "Introduction to UX Design",
            description: "Learn the fundamentals of user experience design including research methods, wireframing, and prototyping.",
            hours: 8,
            lessonsCount: 4,
            completedLessonsCount: 1,
            progress: 25,
            status: "Incomplete",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
            skills: ["UX/UI Design", "Wireframing", "User Research"],
            outcomes: [
              "Understand the basics of UX design",
              "Recognize user needs and problems",
              "Use basic user research techniques",
              "Create user personas to represent target users",
              "Design low-fidelity wireframes to structure user interfaces",
              "Build basic prototypes to demonstrate user flows and interactions",
              "Conduct usability testing to identify design issues",
              "Iterate designs based on user feedback and test results"
            ],
            lessons: [
              { id: "l1", title: "1. What is UX/UI Design ?", duration: "45 minutes", completed: true },
              { id: "l2", title: "2. Understanding User Needs", duration: "60 minutes", completed: true },
              { id: "l3", title: "3. User Research Methods", duration: "50 minutes", completed: false },
              { id: "l4", title: "4. Creating User Personas", duration: "55 minutes", completed: false },
              { id: "l5", title: "5. Wireframing Basics", duration: "45 minutes", completed: false },
              { id: "l6", title: "6. Prototyping Fundamentals", duration: "60 minutes", completed: false },
              { id: "l7", title: "7. Usability Testing", duration: "50 minutes", completed: false },
              { id: "l8", title: "8. Design Iteration Process", duration: "40 minutes", completed: false }
            ]
          },
          {
            id: "figma-basics",
            title: "Figma for Beginners",
            description: "Master Figma, the industry-standard design tool for creating user interfaces and prototypes.",
            hours: 6,
            lessonsCount: 0,
            completedLessonsCount: 0,
            progress: 100,
            status: "Complete",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
            skills: ["UX/UI Design", "Wireframing", "User Research"],
            outcomes: [
              "Use Figma tools for frames, components, and layers",
              "Design basic UI screens and wireframes",
              "Prototype simple user interactions"
            ],
            lessons: [] // Empty to trigger the "No lessons available" state from your mockup
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 1,
        color: "bg-[#4A5DF9]",
        courses: [
          {
            id: "user-research",
            title: "User Research & Personas",
            description: "Deep dive into conducting user interviews and synthesizing data into actionable user personas.",
            hours: 4,
            lessonsCount: 3,
            completedLessonsCount: 0,
            progress: 0,
            status: "Incomplete",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
            skills: ["Research Planning", "Interviewing", "Data Synthesis"],
            outcomes: ["Plan a research study", "Conduct effective interviews", "Create empathy maps"],
            lessons: [
              { id: "l1", title: "1. Research Planning", duration: "45 minutes", completed: false },
              { id: "l2", title: "2. Interview Techniques", duration: "60 minutes", completed: false },
              { id: "l3", title: "3. Synthesis & Empathy Maps", duration: "50 minutes", completed: false }
            ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          {
            id: "advanced-prototyping",
            title: "Advanced Prototyping & Micro-interactions",
            description: "Learn to create high-fidelity prototypes with complex animations and micro-interactions.",
            hours: 4,
            lessonsCount: 2,
            completedLessonsCount: 0,
            progress: 0,
            status: "Incomplete",
            image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
            skills: ["Advanced Figma", "Animation", "Interaction Design"],
            outcomes: ["Master smart animate", "Build complex component states", "Export assets for developers"],
            lessons: [
              { id: "l1", title: "1. Smart Animate Mastery", duration: "90 minutes", completed: false },
              { id: "l2", title: "2. Interactive Components", duration: "90 minutes", completed: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientists",
    industry: "Technology",
    growth: "High Growth",
    courses: 5,
    hours: 60,
    progress: 0,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          { 
            id: "py-data", title: "Python for Data Science", description: "Learn Python fundamentals tailored for data manipulation.", hours: 15, lessonsCount: 5, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            skills: ["Python", "Pandas", "NumPy"], outcomes: ["Write Python scripts", "Clean data with Pandas"], lessons: [ { id: "l1", title: "Intro to Python", duration: "60 minutes", completed: false } ]
          },
          { 
            id: "stat-101", title: "Statistics 101", description: "Core statistical concepts needed for data analysis.", hours: 10, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            skills: ["Probability", "Hypothesis Testing"], outcomes: ["Understand distributions", "Perform A/B testing"], lessons: [ { id: "l1", title: "Probability Basics", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 2,
        color: "bg-[#4A5DF9]",
        courses: [
          { 
            id: "ml-basics", title: "Machine Learning Basics", description: "Introduction to scikit-learn and predictive modeling.", hours: 15, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            skills: ["Scikit-Learn", "Modeling"], outcomes: ["Build regression models", "Evaluate model accuracy"], lessons: [ { id: "l1", title: "Linear Regression", duration: "60 minutes", completed: false } ]
          },
          { 
            id: "data-viz", title: "Data Visualization", description: "Creating dashboards with Tableau and PowerBI.", hours: 10, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            skills: ["Tableau", "Data Storytelling"], outcomes: ["Build interactive dashboards"], lessons: [ { id: "l1", title: "Intro to Tableau", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          { 
            id: "dl-nn", title: "Deep Learning & Neural Networks", description: "Advanced predictive modeling using TensorFlow.", hours: 10, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            skills: ["TensorFlow", "Neural Networks"], outcomes: ["Build deep learning models"], lessons: [ { id: "l1", title: "Intro to Neural Networks", duration: "60 minutes", completed: false } ]
          }
        ]
      }
    ]
  },
  {
    id: "project-manager",
    title: "Project Manager",
    industry: "Technology",
    growth: "High Growth",
    courses: 4,
    hours: 30,
    progress: 0,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          { 
            id: "agile-101", title: "Agile Fundamentals", description: "Learn the core concepts of Agile and Scrum.", hours: 8, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            skills: ["Agile", "Scrum", "Sprint Planning"], outcomes: ["Understand Agile mindset", "Run effective sprints"], lessons: [ { id: "l1", title: "What is Agile?", duration: "45 minutes", completed: false } ]
          },
          { 
            id: "pm-tools", title: "Project Management Tools", description: "Master Jira, Asana, and Trello.", hours: 6, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            skills: ["Jira", "Trello", "Workflow Setup"], outcomes: ["Setup Jira boards", "Manage task states"], lessons: [ { id: "l1", title: "Intro to Jira", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 1,
        color: "bg-[#4A5DF9]",
        courses: [
          { 
            id: "stakeholder-mgmt", title: "Stakeholder Management", description: "Learn how to communicate and manage expectations.", hours: 8, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            skills: ["Communication", "Risk Management"], outcomes: ["Identify key stakeholders", "Mitigate project risks"], lessons: [ { id: "l1", title: "Identifying Stakeholders", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          { 
            id: "scaled-agile", title: "Scaled Agile Framework (SAFe)", description: "Scaling agile methodologies for enterprise teams.", hours: 8, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            skills: ["SAFe", "Enterprise Agile"], outcomes: ["Coordinate multiple Scrum teams"], lessons: [ { id: "l1", title: "Intro to SAFe", duration: "60 minutes", completed: false } ]
          }
        ]
      }
    ]
  },
  {
    id: "software-engineer",
    title: "Software Engineering",
    industry: "Technology",
    growth: "High Growth",
    courses: 4,
    hours: 80,
    progress: 0,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    levels: [
       {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          { 
            id: "intro-cs", title: "Intro to Computer Science", description: "Basic programming constructs.", hours: 20, lessonsCount: 5, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            skills: ["Programming Basics", "Logic"], outcomes: ["Write basic algorithms"], lessons: [ { id: "l1", title: "Variables & Loops", duration: "60 minutes", completed: false } ]
          },
          { 
            id: "data-structures", title: "Data Structures", description: "Arrays, lists, and trees.", hours: 20, lessonsCount: 5, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            skills: ["Data Structures", "Memory Management"], outcomes: ["Implement Linked Lists", "Understand Big O"], lessons: [ { id: "l1", title: "Arrays vs Lists", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 1,
        color: "bg-[#4A5DF9]",
        courses: [
          { 
            id: "algorithms", title: "Algorithms", description: "Sorting and searching algorithms.", hours: 20, lessonsCount: 5, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            skills: ["Algorithm Design", "Optimization"], outcomes: ["Implement Quicksort"], lessons: [ { id: "l1", title: "Sorting Algorithms", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          { 
            id: "system-design", title: "System Design", description: "Architecting large scale applications.", hours: 20, lessonsCount: 5, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            skills: ["Architecture", "Scalability"], outcomes: ["Design distributed systems"], lessons: [ { id: "l1", title: "Microservices", duration: "60 minutes", completed: false } ]
          }
        ]
      }
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    industry: "Technology",
    growth: "High Growth",
    courses: 4,
    hours: 24,
    progress: 0,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          { 
            id: "network-sec", title: "Network Security Basics", description: "Fundamentals of securing networks and endpoints.", hours: 8, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            skills: ["Networking", "Firewalls"], outcomes: ["Configure basic firewalls"], lessons: [ { id: "l1", title: "OSI Model Review", duration: "45 minutes", completed: false } ]
          },
          { 
            id: "threat-intel", title: "Threat Intelligence", description: "Identifying and analyzing cyber threats.", hours: 6, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            skills: ["Threat Modeling", "OSINT"], outcomes: ["Analyze threat vectors"], lessons: [ { id: "l1", title: "What is OSINT?", duration: "45 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 1,
        color: "bg-[#4A5DF9]",
        courses: [
          { 
            id: "ethical-hacking", title: "Ethical Hacking", description: "Penetration testing and vulnerability assessment.", hours: 6, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            skills: ["Pen Testing", "Kali Linux"], outcomes: ["Perform vulnerability scans"], lessons: [ { id: "l1", title: "Intro to Kali", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          { 
            id: "incident-response", title: "Incident Response", description: "Handling and mitigating live security breaches.", hours: 4, lessonsCount: 2, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            skills: ["Forensics", "Mitigation"], outcomes: ["Create incident reports"], lessons: [ { id: "l1", title: "First Response Protocols", duration: "60 minutes", completed: false } ]
          }
        ]
      }
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    industry: "Technology",
    growth: "Medium Growth",
    courses: 4,
    hours: 24,
    progress: 0,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        courseCount: 2,
        color: "bg-[#22C55E]",
        courses: [
          { 
            id: "linux-admin", title: "Linux Administration", description: "Command line, scripting, and system management.", hours: 6, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
            skills: ["Linux", "Bash"], outcomes: ["Navigate CLI", "Write bash scripts"], lessons: [ { id: "l1", title: "CLI Navigation", duration: "45 minutes", completed: false } ]
          },
          { 
            id: "git-version", title: "Version Control with Git", description: "Branching, merging, and collaboration.", hours: 4, lessonsCount: 2, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
            skills: ["Git", "GitHub"], outcomes: ["Manage branches"], lessons: [ { id: "l1", title: "Git Basics", duration: "45 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        courseCount: 1,
        color: "bg-[#4A5DF9]",
        courses: [
          { 
            id: "docker-ci", title: "Docker & CI/CD", description: "Containerization and automated pipelines.", hours: 8, lessonsCount: 4, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
            skills: ["Docker", "Jenkins"], outcomes: ["Build Docker images", "Setup CI pipelines"], lessons: [ { id: "l1", title: "Intro to Containers", duration: "60 minutes", completed: false } ]
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced",
        courseCount: 1,
        color: "bg-[#A855F7]",
        courses: [
          { 
            id: "kubernetes", title: "Kubernetes Orchestration", description: "Deploying and scaling containerized applications.", hours: 6, lessonsCount: 3, completedLessonsCount: 0, progress: 0, status: "Incomplete", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
            skills: ["Kubernetes", "Scaling"], outcomes: ["Deploy K8s clusters"], lessons: [ { id: "l1", title: "K8s Architecture", duration: "60 minutes", completed: false } ]
          }
        ]
      }
    ]
  }
];