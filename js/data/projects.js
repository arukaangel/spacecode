export const projects = [
  {
    id: "asteroid-explorer",
    title: "Asteroid Data Explorer",
    level: "Beginner → Intermediate",
    icon: "☄️",
    description: "Use near-Earth object data to compare size, velocity and close-approach distance.",
    skills: ["APIs", "JavaScript", "EDA", "Visualization"],
    deliverable: "Interactive explorer + short data analysis",
    steps: ["Fetch a real NEO dataset", "Clean and transform the JSON", "Create comparisons", "Write 3 evidence-based observations"]
  },
  {
    id: "galaxy-classification",
    title: "Galaxy Classification",
    level: "Intermediate",
    icon: "🌌",
    description: "Build a small image or tabular classification workflow and explain how you evaluated it.",
    skills: ["Python", "ML", "Validation", "Model Evaluation"],
    deliverable: "Notebook + model card + results",
    steps: ["Choose a public dataset", "Create a baseline", "Train a model", "Evaluate errors and limitations"]
  },
  {
    id: "student-ocean-network",
    title: "Global Student Ocean Network",
    level: "Long-term build",
    icon: "🌊",
    description: "Prototype a network where student-built sensor buoys send environmental observations to a shared map and dataset.",
    skills: ["IoT", "Databases", "APIs", "Data Science", "Mapping"],
    deliverable: "Prototype buoy + ingestion API + map dashboard",
    steps: ["Design low-cost sensor unit", "Send measurements safely", "Store measurements", "Visualize and analyze trends"]
  },
  {
    id: "spectra-ml",
    title: "Scientific Spectra ML Lab",
    level: "Advanced / research-inspired",
    icon: "🧪",
    description: "Use public or synthetic spectroscopy datasets to learn classification, regression and domain-shift concepts in a safe educational setting.",
    skills: ["ML", "Signal Processing", "Scientific Computing", "Validation"],
    deliverable: "Educational notebook + web demo using non-sensitive public/synthetic data",
    steps: ["Choose safe public/synthetic spectra", "Preprocess signals", "Train baseline models", "Study errors and domain shift"]
  }
];
