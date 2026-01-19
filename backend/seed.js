require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');

const seedData = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  education: [
    "Bachelor of Science in Computer Science - Stanford University (2019-2023)",
    "Full Stack Web Development Bootcamp - App Academy (2022)"
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "Python",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Git",
    "REST APIs",
    "GraphQL",
    "CI/CD",
    "Agile"
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "Built a full-stack e-commerce platform using React, Node.js, Express, and MongoDB. Implemented user authentication, shopping cart, payment integration with Stripe, and admin dashboard. Deployed on AWS with Docker containers.",
      links: [
        "https://github.com/alexrivera/ecommerce-platform",
        "https://demo-ecommerce.alexrivera.dev"
      ]
    },
    {
      title: "Real-Time Chat Application",
      description: "Developed a real-time chat application using React, Socket.io, Node.js, and PostgreSQL. Features include private messaging, group chats, file sharing, and message history. Implemented Redis for caching and session management.",
      links: [
        "https://github.com/alexrivera/realtime-chat",
        "https://chat-app.alexrivera.dev"
      ]
    },
    {
      title: "Task Management API",
      description: "Created a RESTful API for task management using Python, FastAPI, and PostgreSQL. Implemented JWT authentication, role-based access control, and comprehensive API documentation with Swagger. Deployed on Railway with automated CI/CD pipeline.",
      links: [
        "https://github.com/alexrivera/task-api",
        "https://api.tasks.alexrivera.dev/docs"
      ]
    },
    {
      title: "Weather Dashboard",
      description: "Built a weather dashboard using React, TypeScript, and OpenWeather API. Features include location search, 7-day forecast, interactive charts with Chart.js, and responsive design. Deployed on Vercel with automatic deployments from GitHub.",
      links: [
        "https://github.com/alexrivera/weather-dashboard",
        "https://weather.alexrivera.dev"
      ]
    },
    {
      title: "Expense Tracker Mobile App",
      description: "Developed a cross-platform mobile app using React Native and Firebase. Includes expense categorization, budget tracking, data visualization, and offline support. Published on both iOS and Android app stores.",
      links: [
        "https://github.com/alexrivera/expense-tracker"
      ]
    }
  ],
  work: [
    "Software Engineer Intern - Tech Startup Inc. (Summer 2022) - Worked on backend services using Node.js and PostgreSQL",
    "Frontend Developer - Freelance (2021-2023) - Built websites and web applications for local businesses",
    "Teaching Assistant - Stanford CS Department (2021-2022) - Assisted in teaching Data Structures and Algorithms course"
  ],
  links: {
    github: "https://github.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera",
    portfolio: "https://alexrivera.dev"
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing profiles...');
    await Profile.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert seed data
    console.log('📝 Inserting seed data...');
    const profile = await Profile.create(seedData);
    console.log('✓ Profile created successfully');
    console.log('\n📋 Profile Details:');
    console.log(`   Name: ${profile.name}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Skills: ${profile.skills.length}`);
    console.log(`   Projects: ${profile.projects.length}`);
    console.log(`   Education: ${profile.education.length}`);
    console.log(`   Work: ${profile.work.length}`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
