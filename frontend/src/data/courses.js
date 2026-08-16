export const courseData = [
  {
    id: 1,
    code: "CS301",
    title: "Full Stack Development",
    department: "Computer Science",
    category: "Full Stack",
    teacher: "Dr. Arun Kumar",
    instructor: "Dr. Arun Kumar",
    scheduleText: "Mon & Wed • 10:00 AM",
    schedule: [
      "Monday — 10:00 AM to 11:30 AM",
      "Wednesday — 10:00 AM to 11:30 AM",
    ],
    duration: "12 Weeks",
    students: 42,
    level: "Intermediate",
    description:
      "Learn full stack web application development with modern frontend frameworks, RESTful APIs, and backend server design.",
    syllabus: [
      "HTML5, CSS3 & Responsive UI",
      "JavaScript ES6+ & React Framework",
      "Node.js & Express API Development",
      "Database Integration (MongoDB / SQL)",
      "RESTful Services & Authentication",
      "Full Stack Project Deployment",
    ],
  },
  {
    id: 2,
    code: "CS302",
    title: "Foundation of Data Science",
    department: "Computer Science",
    category: "Data Science",
    teacher: "Dr. Priya Sharma",
    instructor: "Dr. Priya Sharma",
    scheduleText: "Tue & Thu • 11:00 AM",
    schedule: [
      "Tuesday — 11:00 AM to 12:30 PM",
      "Thursday — 11:00 AM to 12:30 PM",
    ],
    duration: "14 Weeks",
    students: 40,
    level: "Intermediate",
    description:
      "Learn foundational principles of data analysis, exploratory data analysis, statistical modeling, Python data tools, and machine learning.",
    syllabus: [
      "Python for Data Science (NumPy, Pandas)",
      "Data Cleaning & Preprocessing",
      "Exploratory Data Analysis (EDA)",
      "Data Visualization (Matplotlib, Seaborn)",
      "Statistical Inference & Probability",
      "Introductory Machine Learning & Scikit-Learn",
    ],
  },
  {
    id: 3,
    code: "CS303",
    title: "Generative AI",
    department: "Computer Science",
    category: "Artificial Intelligence",
    teacher: "Mr. Kavin Raj",
    instructor: "Mr. Kavin Raj",
    scheduleText: "Mon & Fri • 2:00 PM",
    schedule: [
      "Monday — 2:00 PM to 3:30 PM",
      "Friday — 2:00 PM to 3:30 PM",
    ],
    duration: "10 Weeks",
    students: 38,
    level: "Advanced",
    description:
      "Explore generative AI architectures, large language models (LLMs), prompt engineering, diffusion models, and fine-tuning AI algorithms.",
    syllabus: [
      "Foundations of Generative AI & Deep Learning",
      "Transformer Architecture & Attention Mechanisms",
      "Large Language Models (LLMs) & Prompt Engineering",
      "Diffusion Models & AI Image Generation",
      "Fine-Tuning & RAG (Retrieval-Augmented Generation)",
      "Building Generative AI Applications",
    ],
  },
  {
    id: 4,
    code: "CS304",
    title: "Business Statistics",
    department: "Computer Science",
    category: "Analytics",
    teacher: "Mr. Rahul Dev",
    instructor: "Mr. Rahul Dev",
    scheduleText: "Wed & Fri • 9:00 AM",
    schedule: [
      "Wednesday — 9:00 AM to 10:30 AM",
      "Friday — 9:00 AM to 10:30 AM",
    ],
    duration: "12 Weeks",
    students: 45,
    level: "Intermediate",
    description:
      "Master statistical decision-making, hypothesis testing, probability distributions, regression modeling, and business analytics.",
    syllabus: [
      "Descriptive Statistics & Data Summarization",
      "Probability Distributions & Expected Values",
      "Sampling Distributions & Confidence Intervals",
      "Hypothesis Testing & Z/T Tests",
      "Linear & Multiple Regression Analysis",
      "Business Forecasting & Decision Analytics",
    ],
  },
  {
    id: 5,
    code: "CS305",
    title: "Robotics",
    department: "Computer Science",
    category: "Robotics & Automation",
    teacher: "Dr. Meena Krishnan",
    instructor: "Dr. Meena Krishnan",
    scheduleText: "Tue & Thu • 3:00 PM",
    schedule: [
      "Tuesday — 3:00 PM to 4:30 PM",
      "Thursday — 3:00 PM to 4:30 PM",
    ],
    duration: "12 Weeks",
    students: 36,
    level: "Advanced",
    description:
      "Study autonomous robotic systems, kinematics, sensor integration, control algorithms, and ROS (Robot Operating System).",
    syllabus: [
      "Introduction to Robotics & Kinematics",
      "Sensors, Actuators & Microcontrollers",
      "Robot Motion Planning & Control Systems",
      "Robot Operating System (ROS) & Simulation",
      "Computer Vision for Autonomous Robots",
      "Robotics Capstone System Design",
    ],
  },
  {
    id: 6,
    code: "EC301",
    title: "Computer Networks",
    department: "Electronics",
    category: "Networking",
    teacher: "Dr. Suresh Kumar",
    instructor: "Dr. Suresh Kumar",
    scheduleText: "Mon & Thu • 1:00 PM",
    schedule: [
      "Monday — 1:00 PM to 2:30 PM",
      "Thursday — 1:00 PM to 2:30 PM",
    ],
    duration: "14 Weeks",
    students: 34,
    level: "Advanced",
    description:
      "Study networking fundamentals, TCP/IP, routing, protocols and network security.",
    syllabus: [
      "OSI & TCP/IP Model Overview",
      "Physical & Data Link Layers",
      "IP Addressing & Subnetting",
      "Routing Algorithms & Protocols",
      "Transport Protocols (TCP/UDP)",
      "Application Layer Protocols (HTTP, DNS)",
      "Network Security & Cryptography",
    ],
  },
];

export function getInitialEnrollments() {
  const stored = localStorage.getItem("enrolledCourses");
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(Number);
  } catch {
    return [];
  }
}

export function saveEnrollments(enrolledIds) {
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolledIds));
}
