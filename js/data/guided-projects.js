export const guidedProjects = [
  {
    id: "calculator",
    order: 1,
    icon: "🧮",
    title: "Beautiful Calculator",
    level: "Starter",
    time: "60–90 min",
    skills: ["HTML", "CSS", "JavaScript", "DOM"],
    description: "Build a polished calculator with a responsive keypad, keyboard support and clear error handling.",
    outcome: "A deployable calculator you can publish on GitHub Pages or Vercel.",
    steps: [
      "Create the display and calculator grid in HTML.",
      "Style number, operator and action buttons with CSS Grid.",
      "Store the current value, previous value and operator in JavaScript.",
      "Implement +, −, ×, ÷, decimal, clear and equals.",
      "Add keyboard controls and test edge cases such as division by zero."
    ],
    stretch: "Add calculation history and light/dark themes."
  },
  {
    id: "guessing-game",
    order: 2,
    icon: "🎯",
    title: "Number Guessing Game",
    level: "Beginner",
    time: "60 min",
    skills: ["JavaScript", "Logic", "Events", "State"],
    description: "Make a small game where the player guesses a hidden number and receives warmer/colder hints.",
    outcome: "A complete interactive browser game with score tracking.",
    steps: [
      "Generate a random target number.",
      "Read guesses from an input and validate them.",
      "Show higher/lower and distance hints.",
      "Track attempts and best score.",
      "Add restart and difficulty controls."
    ],
    stretch: "Add sound, animations and a leaderboard stored in Supabase."
  },
  {
    id: "study-planner",
    order: 3,
    icon: "✅",
    title: "Study Planner",
    level: "Beginner+",
    time: "2–3 hours",
    skills: ["CRUD", "Local Storage", "Forms", "Filtering"],
    description: "Build a useful study planner where users add tasks, deadlines and subjects, then filter what is still unfinished.",
    outcome: "A practical productivity app that persists data after refresh.",
    steps: [
      "Design a task form with title, subject and due date.",
      "Represent tasks as JavaScript objects.",
      "Create, complete and delete tasks.",
      "Persist tasks in localStorage.",
      "Add filters for all, active and completed tasks."
    ],
    stretch: "Replace localStorage with Supabase and add user accounts."
  },
  {
    id: "weather-dashboard",
    order: 4,
    icon: "🌦️",
    title: "Weather API Dashboard",
    level: "Intermediate",
    time: "3–4 hours",
    skills: ["APIs", "Async/Await", "JSON", "Error Handling"],
    description: "Create a city weather dashboard that fetches live data from an external API and turns it into a clean interface.",
    outcome: "A real API-powered app with loading and error states.",
    steps: [
      "Choose a weather API and read its documentation.",
      "Build city search and loading states.",
      "Fetch JSON with async/await.",
      "Render temperature, conditions and forecast cards.",
      "Handle invalid cities, network errors and API limits."
    ],
    stretch: "Add geolocation, saved cities and a small temperature chart."
  },
  {
    id: "space-data-story",
    order: 5,
    icon: "🚀",
    title: "Space Data Story",
    level: "Intermediate → Data Science",
    time: "4–6 hours",
    skills: ["NASA API", "Data Cleaning", "Charts", "Analysis"],
    description: "Use real near-Earth-object data to build charts and write a short evidence-based data story.",
    outcome: "A portfolio-ready mini data project connecting web development and data science.",
    steps: [
      "Fetch a real near-Earth-object dataset.",
      "Transform nested JSON into analysis-friendly records.",
      "Compare estimated diameter, velocity and miss distance.",
      "Create at least two meaningful visualizations.",
      "Write three conclusions and one limitation of your analysis."
    ],
    stretch: "Export the dataset and reproduce the analysis in Python/Pandas."
  }
];
