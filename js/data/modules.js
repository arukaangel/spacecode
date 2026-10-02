export const modules = [
  {
    id: "python-basics",
    title: "Python Foundations",
    level: "Beginner",
    icon: "🐍",
    description: "Build a real programming foundation: variables, conditions, loops, functions, collections and problem-solving.",
    skills: ["Python", "Algorithms", "Problem Solving"],
    estimated: "3–4 hours",
    lessons: [
      {
        title: "1. Variables, types and expressions",
        content: `
          <p>Python lets us store information in variables. A variable is a name that points to a value.</p>
          <pre class="code-window"><code>planet = "Mars"\ndistance_km = 225_000_000\nis_rocky = True\n\nprint(planet)\nprint(distance_km / 1_000_000)</code></pre>
          <p>Core types you will use constantly are <code>str</code>, <code>int</code>, <code>float</code>, <code>bool</code>, <code>list</code>, <code>dict</code> and <code>None</code>.</p>
        `
      },
      {
        title: "2. Conditions and loops",
        content: `
          <p>Conditions let programs make decisions, while loops let them repeat a task over a collection of values.</p>
          <pre class="code-window"><code>temperatures = [-63, -55, -71, -48]\n\nfor temp in temperatures:\n    if temp > -60:\n        print("Relatively warm:", temp)\n    else:\n        print("Cold:", temp)</code></pre>
          <p>Try changing the threshold and predict the output before running the code.</p>
        `
      },
      {
        title: "3. Functions and reusable logic",
        content: `
          <p>Functions package logic into reusable blocks. They are essential when your project becomes larger.</p>
          <pre class="code-window"><code>def km_to_au(km):\n    AU_KM = 149_597_870.7\n    return km / AU_KM\n\nprint(km_to_au(225_000_000))</code></pre>
          <p>This is the beginning of writing code that can later be reused inside data-analysis pipelines and web applications.</p>
        `
      }
    ],
    resources: [
      { title: "Python official tutorial", url: "https://docs.python.org/3/tutorial/", type: "Documentation" },
      { title: "Python for Everybody", url: "https://www.py4e.com/", type: "Course" },
      { title: "Exercism Python track", url: "https://exercism.org/tracks/python", type: "Practice" }
    ],
    quiz: [
      { q: "Which Python type stores True/False values?", options: ["str", "bool", "float", "list"], answer: 1 },
      { q: "What does a for loop usually help you do?", options: ["Repeat work over items", "Create a database", "Deploy a website", "Encrypt a password"], answer: 0 },
      { q: "Why are functions useful?", options: ["They make code reusable", "They replace all variables", "They remove the need for testing", "They only work with numbers"], answer: 0 }
    ]
  },
  {
    id: "data-science",
    title: "Data Science Foundations",
    level: "Beginner → Intermediate",
    icon: "📊",
    description: "Learn how raw observations become useful evidence through cleaning, exploration, statistics and visualization.",
    skills: ["Pandas", "EDA", "Statistics", "Visualization"],
    estimated: "4–5 hours",
    lessons: [
      { title: "1. What a dataset really is", content: `<p>A dataset is a structured collection of observations. In a table, rows often represent observations and columns represent variables.</p><p>Before modeling anything, ask: where did the data come from, what does each field mean, and what kinds of errors or missing values might exist?</p>` },
      { title: "2. Cleaning and exploring data", content: `<pre class="code-window"><code>import pandas as pd\n\ndf = pd.read_csv("asteroids.csv")\nprint(df.info())\nprint(df.isna().sum())\nprint(df.describe())</code></pre><p>Exploratory data analysis (EDA) is the process of understanding distributions, missingness, outliers and relationships before fitting a model.</p>` },
      { title: "3. Visualization and evidence", content: `<pre class="code-window"><code>import matplotlib.pyplot as plt\n\ndf["velocity"].hist()\nplt.xlabel("Velocity")\nplt.ylabel("Count")\nplt.show()</code></pre><p>A visualization should answer a question, not just decorate a report.</p>` }
    ],
    resources: [
      { title: "Pandas getting started", url: "https://pandas.pydata.org/docs/getting_started/index.html", type: "Documentation" },
      { title: "Kaggle Learn: Pandas", url: "https://www.kaggle.com/learn/pandas", type: "Practice" },
      { title: "Matplotlib tutorials", url: "https://matplotlib.org/stable/tutorials/index.html", type: "Documentation" }
    ],
    quiz: [
      { q: "What should usually happen before training a model?", options: ["EDA and data cleaning", "Delete every missing row automatically", "Choose the fanciest neural network", "Publish the result"], answer: 0 },
      { q: "What does one row often represent?", options: ["One observation", "One programming language", "One chart color", "One database server"], answer: 0 },
      { q: "A useful visualization should primarily…", options: ["Answer a question", "Use as many colors as possible", "Avoid labels", "Always be 3D"], answer: 0 }
    ]
  },
  {
    id: "web-development",
    title: "Web Development Essentials",
    level: "Beginner",
    icon: "🌐",
    description: "Understand how HTML, CSS and JavaScript work together to create interactive web products.",
    skills: ["HTML", "CSS", "JavaScript", "DOM"],
    estimated: "3–4 hours",
    lessons: [
      { title: "1. HTML = structure", content: `<p>HTML describes the meaning and structure of a page: headings, paragraphs, links, forms and sections.</p><pre class="code-window"><code>&lt;section&gt;\n  &lt;h2&gt;Asteroid Explorer&lt;/h2&gt;\n  &lt;p&gt;Explore near-Earth objects.&lt;/p&gt;\n&lt;/section&gt;</code></pre>` },
      { title: "2. CSS = presentation", content: `<p>CSS controls layout, spacing, typography, responsive behavior and visual hierarchy. Good CSS should make information easier to understand.</p>` },
      { title: "3. JavaScript = behavior", content: `<p>JavaScript reacts to events, changes the page, fetches data and connects your interface to services such as Supabase.</p><pre class="code-window"><code>button.addEventListener("click", () =&gt; {\n  console.log("Mission started");\n});</code></pre>` }
    ],
    resources: [
      { title: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", type: "Course" },
      { title: "JavaScript.info", url: "https://javascript.info/", type: "Course" },
      { title: "web.dev Learn", url: "https://web.dev/learn/", type: "Course" }
    ],
    quiz: [
      { q: "Which language mainly describes page structure?", options: ["HTML", "CSS", "SQL", "Python"], answer: 0 },
      { q: "Which language handles browser interaction?", options: ["JavaScript", "Markdown", "CSV", "Git"], answer: 0 },
      { q: "CSS is mainly responsible for…", options: ["Presentation and layout", "Database authentication", "Satellite navigation", "Compiling Python"], answer: 0 }
    ]
  },
  {
    id: "apis-space-data",
    title: "APIs & Space Data",
    level: "Intermediate",
    icon: "🛰️",
    description: "Fetch real data from public APIs and turn JSON responses into useful interfaces and analyses.",
    skills: ["REST APIs", "JSON", "fetch", "Data pipelines"],
    estimated: "3 hours",
    lessons: [
      { title: "1. What an API is", content: `<p>An API is a defined way for software systems to exchange information. Many scientific organizations publish public APIs that return structured JSON data.</p>` },
      { title: "2. Fetching JSON", content: `<pre class="code-window"><code>const response = await fetch(url);\nconst data = await response.json();\nconsole.log(data);</code></pre><p>Always handle loading states, errors and API limits.</p>` },
      { title: "3. From API to project", content: `<p>A strong project does more than display raw data. It asks a question, transforms the response and helps the user interpret it through comparison or visualization.</p>` }
    ],
    resources: [
      { title: "NASA Open APIs", url: "https://api.nasa.gov/", type: "API" },
      { title: "MDN Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", type: "Documentation" },
      { title: "JSON introduction", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON", type: "Documentation" }
    ],
    quiz: [
      { q: "Which format is commonly returned by web APIs?", options: ["JSON", "PSD", "MP3", "DOCX only"], answer: 0 },
      { q: "What should an app do if an API fails?", options: ["Handle the error clearly", "Freeze silently", "Delete user data", "Pretend the request succeeded"], answer: 0 },
      { q: "A stronger data project should…", options: ["Interpret data, not only print it", "Hide the source", "Avoid questions", "Remove labels"], answer: 0 }
    ]
  },
  {
    id: "git-github",
    title: "Git & GitHub for Real Projects",
    level: "Beginner",
    icon: "🧩",
    description: "Use commits, branches, README files and issues to document how a project evolves over time.",
    skills: ["Git", "GitHub", "Version Control", "Documentation"],
    estimated: "2 hours",
    lessons: [
      { title: "1. Why version control matters", content: `<p>Git records meaningful snapshots of your work. This makes experimentation safer and gives a visible development history.</p>` },
      { title: "2. A useful commit workflow", content: `<pre class="code-window"><code>git status\ngit add .\ngit commit -m "Add module quiz progress tracking"\ngit push</code></pre><p>Commit messages should describe a meaningful change rather than say only “update”.</p>` },
      { title: "3. README and project evidence", content: `<p>A strong README explains the problem, users, features, technical stack, setup instructions, screenshots, architecture and what you learned.</p>` }
    ],
    resources: [
      { title: "GitHub Skills", url: "https://skills.github.com/", type: "Practice" },
      { title: "Git documentation", url: "https://git-scm.com/doc", type: "Documentation" }
    ],
    quiz: [
      { q: "What is the purpose of a Git commit?", options: ["Record a meaningful snapshot", "Host an email server", "Replace a database", "Train a model"], answer: 0 },
      { q: "A good README should explain…", options: ["What the project does and how to use it", "Only your name", "Only CSS colors", "Nothing technical"], answer: 0 },
      { q: "Which command sends local commits to a remote?", options: ["git push", "git draw", "git merge-only", "git html"], answer: 0 }
    ]
  },
  {
    id: "intro-ml",
    title: "Introduction to Machine Learning",
    level: "Intermediate",
    icon: "🤖",
    description: "Understand features, targets, train/test splits, evaluation and why a model is only as good as its validation.",
    skills: ["Machine Learning", "Evaluation", "Scikit-learn", "Model Thinking"],
    estimated: "4 hours",
    lessons: [
      { title: "1. Features and targets", content: `<p>Features are the inputs a model uses. A target is what a supervised model tries to predict. The most important step is defining a valid problem.</p>` },
      { title: "2. Train/test split", content: `<pre class="code-window"><code>from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)</code></pre><p>Testing on unseen data helps estimate how a model may generalize.</p>` },
      { title: "3. Evaluation before excitement", content: `<p>Accuracy alone may be misleading. Choose metrics that match the problem, inspect errors and compare against a simple baseline.</p>` }
    ],
    resources: [
      { title: "Scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html", type: "Documentation" },
      { title: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", type: "Course" }
    ],
    quiz: [
      { q: "Why keep a test set?", options: ["To evaluate on unseen data", "To make training slower", "To store passwords", "To replace features"], answer: 0 },
      { q: "A feature is…", options: ["An input variable", "Always the target", "A CSS class only", "A Git branch"], answer: 0 },
      { q: "Before trusting a model, you should…", options: ["Evaluate it against an appropriate baseline and metric", "Only look at training accuracy", "Hide errors", "Remove the test set"], answer: 0 }
    ]
  }
];

export const getModule = (id) => modules.find((m) => m.id === id);
