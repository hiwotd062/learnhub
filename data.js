/**
 * LearnHub - Sample Educational Course Dataset
 * Comprehensive mock data with curriculum, instructors, video embeds, and quizzes.
 */

const COURSES_DATA = [
  {
    id: "web-dev-masterclass",
    title: "Full-Stack Web Development Bootcamp: React, Node & TypeScript",
    slug: "full-stack-web-development-bootcamp",
    category: "Development",
    level: "Beginner",
    rating: 4.9,
    reviewsCount: 3840,
    studentsCount: 18450,
    duration: "28 hours",
    totalLessons: 12,
    price: 49.99,
    originalPrice: 119.99,
    badge: "Bestseller",
    thumbnail: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "Sarah Jenkins",
      role: "Senior Full-Stack Architect @ Ex-Stripe",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      bio: "12+ years of software engineering experience. Passionate about teaching modern JavaScript, scalable server architectures, and clean software design."
    },
    shortDescription: "Master HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL by building 4 production-ready web apps from scratch.",
    description: `Become a professional full-stack web developer. This comprehensive, project-driven course takes you from beginner fundamentals to building full-scale, scalable web applications with React, Node.js, Express, and modern databases.
    
    You'll learn modern frontend component design with React hooks, robust backend REST APIs with Node and Express, database schema architecture, user authentication with JWT, and modern cloud deployment strategies.`,
    highlights: [
      "Build 4 real-world full-stack web applications for your portfolio",
      "Master React 18, React Router, Hooks, and modern state patterns",
      "Build secure RESTful APIs using Node.js, Express, and middleware",
      "Work with SQL databases and ORMs for relational data modeling",
      "Implement secure JWT authentication, password hashing, and cookies",
      "Deploy your frontend and backend to production cloud platforms"
    ],
    requirements: [
      "A computer (Mac, Windows, or Linux) with an internet connection",
      "No prior coding experience required — we start from the very beginning!"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: Modern Web Foundations",
        lessons: [
          {
            id: "wd-101",
            title: "Welcome & How the Web Actually Works",
            duration: "14:20",
            videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
            summary: "Learn the core concepts of client-server architecture, HTTP request-response cycles, DNS, and browser rendering engines.",
            resources: [
              { name: "Web Architecture Overview (PDF)", url: "#" },
              { name: "HTTP Reference Cheatsheet", url: "#" }
            ]
          },
          {
            id: "wd-102",
            title: "Semantic HTML5 & Modern CSS Layouts (Flexbox & Grid)",
            duration: "28:45",
            videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc",
            summary: "Structure clean accessible web documents with semantic tags and master responsive layout styling using modern CSS Grid and Flexbox.",
            resources: [
              { name: "Flexbox Cheat Sheet", url: "#" },
              { name: "CSS Grid Starter Template", url: "#" }
            ]
          },
          {
            id: "wd-103",
            title: "JavaScript ES6+ Essentials for Modern Developers",
            duration: "34:10",
            videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg",
            summary: "Deep dive into arrow functions, destructuring, modules, promises, async/await, and practical DOM manipulation.",
            resources: [
              { name: "ES6 Methods Guide", url: "#" }
            ]
          }
        ]
      },
      {
        sectionTitle: "Section 2: Mastering Frontend with React",
        lessons: [
          {
            id: "wd-201",
            title: "React Fundamentals: JSX, Props & State",
            duration: "25:30",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            summary: "Understand how the virtual DOM operates, declare declarative components, and manage reactive state.",
            resources: [
              { name: "React Starter Code (ZIP)", url: "#" }
            ]
          },
          {
            id: "wd-202",
            title: "Hooks Deep Dive: useState, useEffect & Custom Hooks",
            duration: "31:15",
            videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
            summary: "Tackle component lifecycles, synchronization with external APIs, side effects, and reusability through custom hooks.",
            resources: [
              { name: "Custom Hooks Snippets", url: "#" }
            ]
          },
          {
            id: "wd-203",
            title: "Building an Interactive E-Commerce Storefront",
            duration: "45:00",
            videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
            summary: "Put everything together: cart management, filtering, dynamic checkout modals, and local storage state persistence.",
            resources: [
              { name: "Project Source Code on GitHub", url: "#" }
            ]
          }
        ]
      },
      {
        sectionTitle: "Section 3: Backend REST APIs & Databases",
        lessons: [
          {
            id: "wd-301",
            title: "Introduction to Node.js & Express Server Architecture",
            duration: "22:40",
            videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
            summary: "Build an Express server, configure routing, structure modular controllers, and handle JSON requests.",
            resources: [
              { name: "Express Boilerplate Template", url: "#" }
            ]
          },
          {
            id: "wd-302",
            title: "Database Modeling & CRUD Operations with PostgreSQL",
            duration: "38:15",
            videoUrl: "https://www.youtube.com/embed/qw--VYLpxG4",
            summary: "Design relational database schemas, write SQL queries, and connect your Express backend safely with an ORM.",
            resources: [
              { name: "SQL Query Cheatsheet", url: "#" }
            ]
          },
          {
            id: "wd-303",
            title: "Authentication, JWT Tokens & Password Hashing",
            duration: "29:50",
            videoUrl: "https://www.youtube.com/embed/mbsmsi7l3r4",
            summary: "Implement bcrypt password hashing, sign and verify JWT tokens, and safeguard protected API routes.",
            resources: [
              { name: "Auth Security Checklist", url: "#" }
            ]
          }
        ]
      },
      {
        sectionTitle: "Section 4: Deployment & Production DevOps",
        lessons: [
          {
            id: "wd-401",
            title: "Environment Variables, Security Headers & CORS",
            duration: "18:20",
            videoUrl: "https://www.youtube.com/embed/7r4xVDI2vho",
            summary: "Harden your application for production: security headers, rate limiting, and CORS configuration.",
            resources: [
              { name: "Production Checklist", url: "#" }
            ]
          },
          {
            id: "wd-402",
            title: "Automated Testing with Jest & Supertest",
            duration: "27:10",
            videoUrl: "https://www.youtube.com/embed/FgnxCc9lq8w",
            summary: "Write unit tests for utility logic and integration tests for API endpoints to prevent regressions.",
            resources: [
              { name: "Testing Cheatsheet", url: "#" }
            ]
          },
          {
            id: "wd-403",
            title: "Continuous Cloud Deployment to Vercel and Render",
            duration: "21:00",
            videoUrl: "https://www.youtube.com/embed/22RkWbzbhng",
            summary: "Connect GitHub repositories, configure automated build pipelines, and monitor production logs.",
            resources: [
              { name: "Deployment Guide (Markdown)", url: "#" }
            ]
          }
        ]
      }
    ],
    quiz: {
      title: "Full-Stack Web Development Certification Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "Which React Hook should be used to run side effects like data fetching or DOM subscriptions?",
          options: ["useReducer", "useEffect", "useMemo", "useCallback"],
          correctAnswer: 1,
          explanation: "useEffect is designed specifically for side effects that synchronize components with external systems."
        },
        {
          id: 2,
          question: "What is the primary role of JSON Web Tokens (JWT) in modern web applications?",
          options: [
            "Encrypt database storage files",
            "Transmitting secure, stateless authenticated session claims between client and server",
            "Compressing image assets before browser render",
            "Translating TypeScript into JavaScript"
          ],
          correctAnswer: 1,
          explanation: "JWTs provide a compact, self-contained way for securely transmitting claims between parties as a JSON object."
        },
        {
          id: 3,
          question: "In CSS Grid, which property creates columns that automatically fit and wrap based on available width?",
          options: [
            "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
            "grid-columns: flex-wrap",
            "grid-auto-flow: wrap-columns",
            "display: inline-grid-columns"
          ],
          correctAnswer: 0,
          explanation: "repeat(auto-fit, minmax(250px, 1fr)) allows columns to automatically wrap gracefully without hardcoded media queries."
        },
        {
          id: 4,
          question: "Which HTTP status code signifies that a requested resource was created successfully?",
          options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
          correctAnswer: 1,
          explanation: "HTTP 201 Created indicates that the request has succeeded and has led to the creation of a resource."
        },
        {
          id: 5,
          question: "Why should passwords never be stored in plain text in a database?",
          options: [
            "Databases can only store numeric values",
            "To prevent unauthorized exposure if database credentials or dumps are compromised",
            "Plain text passwords slow down SQL queries",
            "Plain text passwords cannot be indexed"
          ],
          correctAnswer: 1,
          explanation: "Cryptographic one-way hashing (like bcrypt with salt) protects passwords even in the event of a database breach."
        }
      ]
    }
  },
  {
    id: "ui-ux-design-pro",
    title: "UI/UX Design Masterclass: Wireframing, Figma & Design Systems",
    slug: "ui-ux-design-masterclass",
    category: "Design",
    level: "Beginner",
    rating: 4.8,
    reviewsCount: 2410,
    studentsCount: 14200,
    duration: "18 hours",
    totalLessons: 10,
    price: 39.99,
    originalPrice: 89.99,
    badge: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "Marcus Vance",
      role: "Lead Product Designer @ FinTech Lab",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      bio: "10+ years crafting digital products used by millions. Mentor for emerging designers across Apple Design Award nominated apps."
    },
    shortDescription: "Learn user research, wireframing, high-fidelity UI design in Figma, design tokens, micro-interactions, and handoff.",
    description: `Design interfaces people love using. This course guides you through the full UX research pipeline and the visual craft of modern UI design. You'll master Figma from scratch, build comprehensive design systems with auto-layout and components, and run usability tests to validate product decisions.`,
    highlights: [
      "Master Figma from zero to advanced auto-layout and component variants",
      "Conduct user interviews, persona mapping, and journey maps",
      "Build a scalable design system with typography, color tokens, and components",
      "Create high-fidelity clickable mobile & desktop prototypes",
      "Prepare design specs for seamless developer handoff"
    ],
    requirements: [
      "No previous design experience required",
      "Free Figma account and a web browser"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: UX Research & Product Foundations",
        lessons: [
          {
            id: "ux-101",
            title: "UX Fundamentals & Design Thinking Process",
            duration: "19:40",
            videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
            summary: "Learn the 5 stages of design thinking: Empathize, Define, Ideate, Prototype, and Test.",
            resources: [{ name: "Design Thinking Worksheet", url: "#" }]
          },
          {
            id: "ux-102",
            title: "User Personas & Journey Mapping",
            duration: "23:15",
            videoUrl: "https://www.youtube.com/embed/mSxpVRo3BLg",
            summary: "Identify user pain points, synthesize interview feedback, and map emotional user journeys.",
            resources: [{ name: "Figma Persona Templates", url: "#" }]
          }
        ]
      },
      {
        sectionTitle: "Section 2: Figma Mastery & Visual Craft",
        lessons: [
          {
            id: "ux-201",
            title: "Figma Fundamentals: Frames, Vectors & Constraints",
            duration: "27:00",
            videoUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8",
            summary: "Get comfortable with Figma's canvas, layers, frames, and responsiveness constraints.",
            resources: [{ name: "Figma Keyboard Shortcuts Cheatsheet", url: "#" }]
          },
          {
            id: "ux-202",
            title: "Auto-Layout & Responsive Component Variants",
            duration: "35:40",
            videoUrl: "https://www.youtube.com/embed/NhhdpKj4iL0",
            summary: "Build flexible, modular UI components that adapt dynamically to any content and screen dimension.",
            resources: [{ name: "Auto Layout Playground File", url: "#" }]
          },
          {
            id: "ux-203",
            title: "Typography, Color Harmonies & Visual Hierarchy",
            duration: "30:20",
            videoUrl: "https://www.youtube.com/embed/9EPTM91TBDM",
            summary: "Master contrast, 8pt spatial grids, modular typographic scales, and accessibility compliance (WCAG).",
            resources: [{ name: "Color Palette Generator Guide", url: "#" }]
          }
        ]
      },
      {
        sectionTitle: "Section 3: Design Systems & Prototyping",
        lessons: [
          {
            id: "ux-301",
            title: "Constructing an Enterprise Design System",
            duration: "42:10",
            videoUrl: "https://www.youtube.com/embed/k749U1yO1_4",
            summary: "Organize buttons, inputs, modals, alerts, and tokens into a unified, version-controlled library.",
            resources: [{ name: "Starter UI Kit (.fig)", url: "#" }]
          },
          {
            id: "ux-302",
            title: "Interactive Smart Animate Prototyping",
            duration: "33:00",
            videoUrl: "https://www.youtube.com/embed/2_9A2yP2c18",
            summary: "Bring screens to life with smooth page transitions, micro-animations, and drag interactions.",
            resources: [{ name: "Prototype Playground File", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      title: "UI/UX Design Certification Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "What is the primary benefit of using Figma's Auto-Layout feature?",
          options: [
            "It automatically writes React code for you",
            "It allows frames and components to resize automatically as content or constraints change",
            "It compresses large image assets",
            "It prevents other team members from editing your file"
          ],
          correctAnswer: 1,
          explanation: "Auto-layout replicates CSS flexbox behavior, enabling dynamic buttons, responsive cards, and adaptive menus."
        },
        {
          id: 2,
          question: "In visual hierarchy, which element characteristic draws the strongest immediate eye focus?",
          options: ["High contrast and visual weight", "Italic text formatting", "Lowercase letters", "Dotted borders"],
          correctAnswer: 0,
          explanation: "Contrast, scale, and visual weight immediately signal priority to human visual perception."
        },
        {
          id: 3,
          question: "What does WCAG accessibility contrast ratio recommend for standard text?",
          options: ["At least 4.5:1", "At least 1.5:1", "Exactly 10:1", "At least 20:1"],
          correctAnswer: 0,
          explanation: "WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text."
        }
      ]
    }
  },
  {
    id: "python-data-science",
    title: "Data Science, Machine Learning & AI Bootcamp with Python",
    slug: "python-data-science-machine-learning",
    category: "Data Science",
    level: "Intermediate",
    rating: 4.9,
    reviewsCount: 4120,
    studentsCount: 22100,
    duration: "34 hours",
    totalLessons: 14,
    price: 54.99,
    originalPrice: 129.99,
    badge: "Trending",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "Dr. Alex Rivera",
      role: "AI Research Scientist & Data Consultant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      bio: "Ph.D. in Computer Science. Former data scientist at CERN. Authored 3 textbooks on predictive modeling and neural networks."
    },
    shortDescription: "Master Python, Pandas, NumPy, Data Visualization, Scikit-Learn, and Deep Neural Networks with real datasets.",
    description: `Step into high-paying data science and machine learning roles. This course teaches you how to collect, clean, visualize, and extract predictive insights from messy real-world data using Python and standard industry libraries.`,
    highlights: [
      "Master NumPy for numerical matrix computing and linear algebra",
      "Perform high-performance data wrangling and cleaning with Pandas",
      "Build stunning data visualizations with Matplotlib & Seaborn",
      "Train classification, regression, and clustering algorithms with Scikit-Learn",
      "Deploy machine learning prediction endpoints as web microservices"
    ],
    requirements: [
      "Basic understanding of programming fundamentals",
      "Free installation of Anaconda or Jupyter Notebooks"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: Python for Data Analysis",
        lessons: [
          {
            id: "ds-101",
            title: "Setting up Jupyter Lab & Scientific Python Environment",
            duration: "16:30",
            videoUrl: "https://www.youtube.com/embed/HW29067qVWk",
            summary: "Configure Python environments, conda packages, and notebook workflow efficiency.",
            resources: [{ name: "Jupyter Shortcuts Cheat Sheet", url: "#" }]
          },
          {
            id: "ds-102",
            title: "NumPy Arrays, Vectorization & Matrix Math",
            duration: "32:10",
            videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI",
            summary: "Learn vectorized operations, slicing, broadcasting, and why NumPy outperforms Python loops by 50x.",
            resources: [{ name: "NumPy Quick Reference", url: "#" }]
          },
          {
            id: "ds-103",
            title: "Pandas DataFrames: Cleaning, Filtering & Grouping",
            duration: "41:50",
            videoUrl: "https://www.youtube.com/embed/vmEHCJofslg",
            summary: "Read CSV/SQL datasets, handle missing values, reshape columns, and compute grouped aggregates.",
            resources: [{ name: "Pandas 100-Exercises Notebook", url: "#" }]
          }
        ]
      },
      {
        sectionTitle: "Section 2: Machine Learning Algorithms",
        lessons: [
          {
            id: "ds-201",
            title: "Supervised Learning: Linear & Logistic Regression",
            duration: "36:20",
            videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
            summary: "Understand cost functions, gradient descent, model evaluation metrics, and ROC-AUC curves.",
            resources: [{ name: "Regression Notebook (.ipynb)", url: "#" }]
          },
          {
            id: "ds-202",
            title: "Decision Trees, Random Forests & Ensemble Boosting",
            duration: "40:15",
            videoUrl: "https://www.youtube.com/embed/J4Wdy0Wc_xQ",
            summary: "Build high-accuracy classification ensembles and prevent overfitting with cross-validation.",
            resources: [{ name: "Ensemble Models Project", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      title: "Data Science & Machine Learning Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "Which Pandas method is used to inspect summary statistics (mean, std, min, max) of numeric columns?",
          options: ["df.summary()", "df.describe()", "df.info()", "df.stats()"],
          correctAnswer: 1,
          explanation: "df.describe() outputs central tendency, dispersion, and shape of a dataset's distribution."
        },
        {
          id: 2,
          question: "What problem occurs when a model performs exceptionally well on training data but poorly on unseen test data?",
          options: ["Underfitting", "Overfitting", "Gradient vanish", "Data leakage"],
          correctAnswer: 1,
          explanation: "Overfitting occurs when the model memorizes noise and patterns specific only to the training set."
        }
      ]
    }
  },
  {
    id: "flutter-mobile-apps",
    title: "Mobile App Development with Flutter & Dart: iOS & Android",
    slug: "flutter-dart-mobile-development",
    category: "Mobile",
    level: "Intermediate",
    rating: 4.7,
    reviewsCount: 1680,
    studentsCount: 9800,
    duration: "22 hours",
    totalLessons: 11,
    price: 44.99,
    originalPrice: 99.99,
    badge: "Hot",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "David Chen",
      role: "Cross-Platform Mobile Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      bio: "Built cross-platform apps with 5M+ downloads across the App Store and Google Play Store. Google Developer Expert in Flutter."
    },
    shortDescription: "Build beautiful, natively compiled cross-platform mobile apps for iOS and Android from a single codebase with Flutter.",
    description: `Build and launch production-grade iOS and Android apps using Flutter 3 and Dart. You'll master widget trees, state management with Riverpod, native device camera & geolocation access, REST API synchronization, and publishing to app stores.`,
    highlights: [
      "Single codebase for native iOS and Android apps",
      "Master Dart language fundamentals and object-oriented paradigms",
      "Build reactive layouts with Flutter Widget Tree and animations",
      "State management using Riverpod and Bloc patterns",
      "Integrate device hardware APIs (Camera, GPS, Notifications)"
    ],
    requirements: [
      "Basic programming experience in any language",
      "Computer capable of running Android Studio or Xcode simulator"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: Flutter & Dart Fundamentals",
        lessons: [
          {
            id: "fl-101",
            title: "Flutter Architecture & Dart Primer",
            duration: "21:30",
            videoUrl: "https://www.youtube.com/embed/1ukSR1SXdB8",
            summary: "Learn how the Flutter rendering pipeline creates native 60fps UIs on iOS and Android.",
            resources: [{ name: "Dart Syntax Primer", url: "#" }]
          },
          {
            id: "fl-102",
            title: "Stateless vs Stateful Widgets & Layout Trees",
            duration: "29:10",
            videoUrl: "https://www.youtube.com/embed/x0uinJvhNxI",
            summary: "Compose nested columns, rows, stacks, containers, and responsive media queries.",
            resources: [{ name: "Widget Cheat Sheet", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      title: "Flutter Development Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "What language does Flutter use for building applications?",
          options: ["Kotlin", "Swift", "Dart", "TypeScript"],
          correctAnswer: 2,
          explanation: "Flutter is powered by Dart, which enables fast Ahead-Of-Time (AOT) native compilation and Just-In-Time (JIT) hot reloading."
        }
      ]
    }
  },
  {
    id: "generative-ai-engineering",
    title: "Applied Generative AI & Large Language Model Engineering",
    slug: "applied-generative-ai-llm-engineering",
    category: "AI & Tech",
    level: "Advanced",
    rating: 5.0,
    reviewsCount: 1950,
    studentsCount: 11200,
    duration: "19 hours",
    totalLessons: 9,
    price: 69.99,
    originalPrice: 149.99,
    badge: "Highest Rated",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "Elena Rostova",
      role: "Lead AI Engineer & LLM Practitioner",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      bio: "Ex-DeepMind contributor. Specializes in building RAG systems, model evaluation pipelines, and fine-tuning open-weights models."
    },
    shortDescription: "Build production AI apps with LangChain, LlamaIndex, Retrieval-Augmented Generation (RAG), vector databases, and agent loops.",
    description: `Move beyond toy chatbot prompts. This advanced course teaches software engineers how to architect reliable, production-ready AI applications using modern vector databases, hybrid search RAG pipelines, structured JSON outputs, and autonomous multi-step agent frameworks.`,
    highlights: [
      "Design enterprise RAG architectures with hybrid semantic and keyword search",
      "Embeddings, chunking strategies, and vector databases (Pinecone, ChromaDB)",
      "Multi-agent orchestration and function calling tools",
      "Fine-tuning open models with LoRA and PEFT techniques",
      "Guardrails, hallucination detection, and automated LLM evaluation"
    ],
    requirements: [
      "Comfortable with Python and asynchronous programming",
      "Familiarity with basic machine learning concepts and REST APIs"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: Modern LLM Foundations & Prompt Engineering",
        lessons: [
          {
            id: "ai-101",
            title: "Transformer Architecture & Tokenization Mechanics",
            duration: "24:40",
            videoUrl: "https://www.youtube.com/embed/bZQun8Y4L2A",
            summary: "Explore self-attention mechanisms, contextual embeddings, temperature sampling, and token budgets.",
            resources: [{ name: "Attention Mechanism Whitepaper", url: "#" }]
          },
          {
            id: "ai-102",
            title: "Structured Outputs, JSON Modes & Tool Calling",
            duration: "31:15",
            videoUrl: "https://www.youtube.com/embed/aqz_sD4S6B4",
            summary: "Enforce deterministic schema responses from probabilistic models using Pydantic and JSON schemas.",
            resources: [{ name: "Pydantic Schema Starter", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      title: "Generative AI Engineering Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "What does RAG stand for in modern AI architecture?",
          options: [
            "Random Access Generation",
            "Retrieval-Augmented Generation",
            "Recursive Agent Graph",
            "Real-time Automated Gradient"
          ],
          correctAnswer: 1,
          explanation: "Retrieval-Augmented Generation retrieves contextual documents from an external knowledge base and feeds them into the model's prompt."
        }
      ]
    }
  },
  {
    id: "cybersecurity-ethical-hacking",
    title: "Cybersecurity Fundamentals & Certified Ethical Hacking",
    slug: "cybersecurity-fundamentals-ethical-hacking",
    category: "Security",
    level: "Beginner",
    rating: 4.8,
    reviewsCount: 2280,
    studentsCount: 13500,
    duration: "24 hours",
    totalLessons: 12,
    price: 49.99,
    originalPrice: 109.99,
    badge: "Essential",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    instructor: {
      name: "Jason Miller",
      role: "Certified Information Systems Security Professional (CISSP)",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
      bio: "15+ years penetration tester and security auditor. Helped secure infrastructure for banking, defense, and healthcare systems."
    },
    shortDescription: "Learn network security, ethical penetration testing, OWASP Top 10 vulnerabilities, Wireshark, and defensive cryptography.",
    description: `Understand how cyber attackers compromise networks and web apps — and learn how to defend systems proactively. Hands-on labs with Kali Linux, Metasploit, Nmap, Wireshark, and web vulnerability analysis.`,
    highlights: [
      "Understand the ethical hacker methodology and legal boundaries",
      "Network reconnaissance, port scanning, and banner grabbing with Nmap",
      "Defend against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF)",
      "Packet sniffing and protocol analysis using Wireshark",
      "Applied cryptography: symmetric/asymmetric encryption, PKI, and hashing"
    ],
    requirements: [
      "Basic understanding of computers and operating systems",
      "Ability to install VirtualBox or VMware for isolated security labs"
    ],
    curriculum: [
      {
        sectionTitle: "Section 1: Information Security Essentials",
        lessons: [
          {
            id: "sec-101",
            title: "The CIA Triad & Threat Modeling",
            duration: "18:40",
            videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA",
            summary: "Confidentiality, Integrity, and Availability principles and identifying attack vectors.",
            resources: [{ name: "Threat Modeling Guide (PDF)", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      title: "Cybersecurity Fundamentals Quiz",
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "What does the CIA triad stand for in information security?",
          options: [
            "Central Intelligence Agency",
            "Confidentiality, Integrity, and Availability",
            "Control, Inspection, and Authorization",
            "Cryptography, Identification, and Auditing"
          ],
          correctAnswer: 1,
          explanation: "The CIA triad is the foundational benchmark for evaluating system security policies and access controls."
        }
      ]
    }
  }
];

// Student Testimonials
const TESTIMONIALS_DATA = [
  {
    name: "Alex Thorne",
    role: "Junior Frontend Engineer @ Spotify",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80",
    text: "LearnHub literally changed my career. I went from zero coding knowledge to landing my first engineering job within 6 months. The interactive lessons and practical curriculum made all the difference.",
    course: "Full-Stack Web Development Bootcamp",
    rating: 5
  },
  {
    name: "Maya Patel",
    role: "Product Designer @ Revolut",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    text: "The Figma Design Systems course was top tier. The instructor explained auto-layout and component tokens clearer than any tutorial I've seen. My portfolio looked 10x more polished after completing it.",
    course: "UI/UX Design Masterclass",
    rating: 5
  },
  {
    name: "Liam O'Connor",
    role: "Data Analyst @ Deliveroo",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    text: "The quizzes and practical Jupyter projects reinforced every concept. Learning how to clean real data and build scikit-learn models directly helped me earn a 30% promotion at work.",
    course: "Data Science & Machine Learning",
    rating: 5
  }
];

// Initial mock student state
const INITIAL_STUDENT = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  enrolledCourseIds: ["web-dev-masterclass", "ui-ux-design-pro"],
  completedLessons: {
    "web-dev-masterclass": ["wd-101", "wd-102"],
    "ui-ux-design-pro": ["ux-101"]
  },
  quizScores: {
    "web-dev-masterclass": 80
  },
  notes: {
    "wd-101": "HTTP Request Methods:\n- GET: retrieve resources\n- POST: create resource\n- PUT/PATCH: update resource\n- DELETE: remove resource\n\nStatus codes:\n2xx: Success\n4xx: Client error\n5xx: Server error"
  },
  savedBookIds: ["book-1", "book-2"]
};

// LearnHub Digital Bookstore Catalog
const BOOKS_DATA = [
  {
    id: "book-1",
    title: "The Full-Stack Architect's Handbook",
    author: "Sarah Jenkins",
    role: "Ex-Stripe Architect",
    category: "Development",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 1420,
    pages: 420,
    readTime: "8 hours read",
    format: "PDF & EPUB",
    badge: "Bestseller",
    price: 0, // Free with account
    originalPrice: 29.99,
    downloads: 12500,
    shortDescription: "A practical guide to building enterprise-scale React, Node.js, and cloud database architectures from ground zero.",
    chapters: [
      {
        title: "Chapter 1: The Modern Architectural Landscape",
        content: `Software architecture is not about making things complex; it is about keeping systems manageable as they grow. When we evaluate web applications today, the boundaries between the frontend and backend have fundamentally evolved.
        
Client-side applications run complex state graphs, while backend APIs manage real-time distributed data. To master modern software engineering, you must understand the interplay between latency, memory cache layers, and relational consistency.

Key Architecture Rule:
Always design your schemas around read/write ratios. If your application reads 95% of the time, optimize indexing and consider edge caching before adding more servers.`
      },
      {
        title: "Chapter 2: High-Performance React State Management",
        content: `Managing state at scale requires disciplined separation of concerns:
1. Server State (React Query / SWR): Cached asynchronous data from backend APIs.
2. Global UI State (Zustand / Redux): Shared modal states, active sidebar, theme preferences.
3. Local Component State (useState / useReducer): Form inputs, transient hover indicators.

When you separate server cache from client UI state, re-rendering waterfalls disappear and your application stays lightning fast.`
      }
    ]
  },
  {
    id: "book-2",
    title: "Designing Intuitive Interfaces: Principles of Modern UI/UX",
    author: "Marcus Vance",
    role: "Lead Product Designer",
    category: "Design",
    cover: "https://images.unsplash.com/photo-1507842229451-7971b32c3ae0?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 980,
    pages: 280,
    readTime: "5.5 hours read",
    format: "Interactive PDF",
    badge: "Staff Pick",
    price: 0,
    originalPrice: 24.99,
    downloads: 9400,
    shortDescription: "Master spatial visual hierarchy, 8pt spacing grids, typography scale, micro-interactions, and design systems.",
    chapters: [
      {
        title: "Chapter 1: Visual Perception & Cognitive Load",
        content: `Every element on a screen demands cognitive energy from the user. When cognitive load exceeds the user's working memory, decision fatigue occurs and users abandon your product.

The Law of Proximity:
Items placed close together are instinctively perceived as related. Before adding borders or colored boxes, test if simple white space and proximity can group your content cleanly.`
      },
      {
        title: "Chapter 2: The 8-Point Spatial Grid System",
        content: `Why do top-tier apps like Apple, Airbnb, and Stripe look so cohesive? The secret is geometric rhythm.

By snapping padding, margins, line heights, and icon bounds to multiples of 8 (8px, 16px, 24px, 32px, 48px, 64px), you eliminate random guesswork and establish a subconscious visual harmony.`
      }
    ]
  },
  {
    id: "book-3",
    title: "Applied Deep Learning & Neural Networks with Python",
    author: "Dr. Alex Rivera",
    role: "AI Research Scientist",
    category: "Data Science & AI",
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 1850,
    pages: 512,
    readTime: "11 hours read",
    format: "PDF + Code Notebooks",
    badge: "Trending",
    price: 0,
    originalPrice: 34.99,
    downloads: 14800,
    shortDescription: "Mathematical intuition and PyTorch code for convolutional networks, embeddings, and deep predictive models.",
    chapters: [
      {
        title: "Chapter 1: Foundations of Tensor Computation",
        content: `At the heart of modern artificial intelligence lies a single mathematical abstraction: the n-dimensional tensor.

Whether you are processing raw pixels, audio waveforms, or natural language tokens, your data is ultimately transformed into continuous vector spaces where matrix dot products uncover hidden semantic patterns.`
      }
    ]
  },
  {
    id: "book-4",
    title: "The LLM Engineer's Field Guide: RAG, Agents & Fine-Tuning",
    author: "Elena Rostova",
    role: "Principal AI Engineer",
    category: "AI & Tech",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviews: 1620,
    pages: 310,
    readTime: "6 hours read",
    format: "Interactive EPUB",
    badge: "New Release",
    price: 0,
    originalPrice: 29.99,
    downloads: 8700,
    shortDescription: "Production strategies for Retrieval-Augmented Generation (RAG), vector databases, and multi-agent systems.",
    chapters: [
      {
        title: "Chapter 1: The Anatomy of Vector Embeddings",
        content: `Traditional keyword search looks for exact string overlap. Vector embeddings, on the other hand, encode contextual meaning into high-dimensional geometry.

In this chapter, we explore how chunking strategies (semantic vs recursive character) drastically impact retrieval accuracy in production RAG systems.`
      }
    ]
  },
  {
    id: "book-5",
    title: "Offensive Security & Penetration Testing Blueprint",
    author: "Jason Miller",
    role: "CISSP Penetration Tester",
    category: "Cybersecurity",
    cover: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 1100,
    pages: 390,
    readTime: "7.5 hours read",
    format: "PDF & Security Labs",
    badge: "Essential",
    price: 0,
    originalPrice: 27.99,
    downloads: 10200,
    shortDescription: "Ethical hacking methodologies, reconnaissance, web vulnerability defense, and cryptographic foundations.",
    chapters: [
      {
        title: "Chapter 1: Legal Reconnaissance & Threat Modeling",
        content: `Ethical hacking begins not with exploitation, but with comprehensive reconnaissance.

Understanding how attackers map subdomains, scan open ports with Nmap, and detect vulnerable software versions allows defensive engineers to patch attack surfaces before malicious actors strike.`
      }
    ]
  },
  {
    id: "book-6",
    title: "Cross-Platform Mastery with Flutter & Dart",
    author: "David Chen",
    role: "Mobile Architect",
    category: "Mobile",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 840,
    pages: 340,
    readTime: "6.5 hours read",
    format: "PDF & Kindle",
    badge: "Hot",
    price: 0,
    originalPrice: 22.99,
    downloads: 6900,
    shortDescription: "Build production iOS and Android apps with reactive widget trees, Riverpod state, and native device hardware.",
    chapters: [
      {
        title: "Chapter 1: The Skia/Impeller Rendering Engine",
        content: `Unlike hybrid web-view containers, Flutter compiles directly to machine code and paints every pixel on canvas at 60 to 120 FPS.

This architectural difference delivers the fluid performance of native Swift and Kotlin while writing only a single Dart codebase.`
      }
    ]
  }
];


