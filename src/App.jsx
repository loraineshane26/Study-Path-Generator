import { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const roadmapData = {
  "Computer Engineering": {
    description:
      "Build a strong foundation in mathematics, programming, electronics, and networking for Computer Engineering.",
    steps: [
      {
        title: "Core Mathematics",
        resources: [
          {
            label: "Khan Academy Algebra",
            url: "https://www.khanacademy.org/math/algebra",
          },
          {
            label: "Khan Academy Calculus",
            url: "https://www.khanacademy.org/math/calculus-1",
          },
        ],
      },
      {
        title: "Programming Fundamentals",
        resources: [
          { label: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
          {
            label: "Python Basics",
            url: "https://www.python.org/about/gettingstarted/",
          },
        ],
      },
      {
        title: "Electronics Basics",
        resources: [
          {
            label: "All About Circuits",
            url: "https://www.allaboutcircuits.com/",
          },
          {
            label: "Arduino Guide",
            url: "https://www.arduino.cc/en/Guide",
          },
        ],
      },
      {
        title: "Networking Basics",
        resources: [
          { label: "Cisco Networking", url: "https://www.cisco.com/" },
          {
            label: "Networking Basics YouTube",
            url: "https://www.youtube.com/results?search_query=networking+basics",
          },
        ],
      },
      {
        title: "Project and Review",
        resources: [
          { label: "GitHub", url: "https://github.com/" },
          { label: "Study Planner", url: "https://www.notion.com/templates" },
        ],
      },
    ],
  },

  Mathematics: {
    description: "Strengthen math foundations for engineering and computing.",
    steps: [
      {
        title: "Algebra and Functions",
        resources: [
          {
            label: "Khan Academy Algebra",
            url: "https://www.khanacademy.org/math/algebra",
          },
          {
            label: "Paul's Online Notes",
            url: "https://tutorial.math.lamar.edu/",
          },
        ],
      },
      {
        title: "Trigonometry and Geometry",
        resources: [
          {
            label: "Khan Academy Trigonometry",
            url: "https://www.khanacademy.org/math/trigonometry",
          },
        ],
      },
      {
        title: "Calculus Basics",
        resources: [
          {
            label: "Khan Academy Calculus",
            url: "https://www.khanacademy.org/math/calculus-1",
          },
        ],
      },
    ],
  },

  Programming: {
    description: "Build strong programming foundations and practice problem solving.",
    steps: [
      {
        title: "Programming Logic",
        resources: [
          { label: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
          {
            label: "Python Basics",
            url: "https://www.python.org/about/gettingstarted/",
          },
        ],
      },
      {
        title: "Data Structures",
        resources: [
          { label: "VisuAlgo", url: "https://visualgo.net/" },
          {
            label: "GeeksforGeeks DS",
            url: "https://www.geeksforgeeks.org/data-structures/",
          },
        ],
      },
      {
        title: "Project Practice",
        resources: [
          { label: "GitHub", url: "https://github.com/" },
          {
            label: "Frontend Mentor",
            url: "https://www.frontendmentor.io/",
          },
        ],
      },
    ],
  },

  Electronics: {
    description: "Learn circuits, components, and digital electronics.",
    steps: [
      {
        title: "Circuit Fundamentals",
        resources: [
          {
            label: "All About Circuits",
            url: "https://www.allaboutcircuits.com/",
          },
          {
            label: "Electronics Tutorials",
            url: "https://www.electronics-tutorials.ws/",
          },
        ],
      },
      {
        title: "Ohm's Law and Components",
        resources: [
          {
            label: "Khan Academy Circuits",
            url: "https://www.khanacademy.org/science/physics/circuits-topic",
          },
        ],
      },
      {
        title: "Digital Logic",
        resources: [
          {
            label: "Logic Gates Guide",
            url: "https://www.geeksforgeeks.org/digital-electronics-logic-gates/",
          },
        ],
      },
      {
        title: "Microcontrollers Basics",
        resources: [{ label: "Arduino Guide", url: "https://www.arduino.cc/en/Guide" }],
      },
    ],
  },

  Networking: {
    description: "Learn networking fundamentals, IP addressing, routing, and security.",
    steps: [
      {
        title: "Networking Fundamentals",
        resources: [
          { label: "Cisco Networking Basics", url: "https://www.cisco.com/" },
          {
            label: "Networking Basics YouTube",
            url: "https://www.youtube.com/results?search_query=networking+basics",
          },
        ],
      },
      {
        title: "IP Addressing and Subnetting",
        resources: [
          {
            label: "Subnetting Practice",
            url: "https://subnettingpractice.com/",
          },
        ],
      },
      {
        title: "Routing and Switching",
        resources: [
          {
            label: "CCNA Intro",
            url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna/index.html",
          },
        ],
      },
    ],
  },

  "Other Subjects": {
    description: "Review general subjects and build study discipline.",
    steps: [
      {
        title: "Identify Weak Subjects",
        resources: [
          { label: "Study Planner", url: "https://www.notion.com/templates" },
        ],
      },
      {
        title: "Set Weekly Goals",
        resources: [
          { label: "Goal Setting Guide", url: "https://www.mindtools.com/" },
        ],
      },
      {
        title: "Practice and Review",
        resources: [
          { label: "Quizlet", url: "https://quizlet.com/" },
          { label: "Anki", url: "https://apps.ankiweb.net/" },
        ],
      },
    ],
  },
};

const tabToGoal = {
  tracker: "Computer Engineering",
  math: "Mathematics",
  programming: "Programming",
  electronics: "Electronics",
  networking: "Networking",
  other: "Other Subjects",
};

const formatActivityLabel = (item) => {
  switch (item.type) {
    case "account-created":
      return "Account created";
    case "login":
      return "Logged in";
    case "logout":
      return "Logged out";
    case "note-saved":
      return "Note saved";
    case "step-complete":
      return "Step completed";
    default:
      return item.type || "Activity";
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [activity, setActivity] = useState([]);

  const dashboardGoal = userData?.selectedGoal || "Computer Engineering";
  const dashboardRoadmap =
    roadmapData[dashboardGoal] || roadmapData["Computer Engineering"];
  const dashboardStepIndex = progress[dashboardGoal] ?? 0;
  const dashboardCurrentStep =
    dashboardRoadmap.steps[
      Math.min(dashboardStepIndex, dashboardRoadmap.steps.length - 1)
    ];

  const activeGoal =
    tabToGoal[activeTab] || userData?.selectedGoal || "Computer Engineering";
  const currentRoadmap =
    roadmapData[activeGoal] || roadmapData["Computer Engineering"];
  const currentStepIndex = progress[activeGoal] ?? 0;
  const currentStep =
    currentRoadmap.steps[
      Math.min(currentStepIndex, currentRoadmap.steps.length - 1)
    ];

  const register = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        course: "Computer Engineering",
        selectedGoal: "Computer Engineering",
        progress: Object.keys(roadmapData).reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {}),
        createdAt: serverTimestamp(),
      });

      const docSnap = await getDoc(doc(db, "users", res.user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setProgress(data.progress || {});
      }

      await addDoc(collection(db, "users", res.user.uid, "activity"), {
        type: "account-created",
        createdAt: serverTimestamp(),
      });

      setUser(res.user);
      setStatus("ACCOUNT CREATED");
    } catch (err) {
      setStatus("ERROR");
      alert(err.message);
    }

    setLoading(false);
  };

  const login = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);

      const docSnap = await getDoc(doc(db, "users", res.user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setProgress(data.progress || {});
      }

      await addDoc(collection(db, "users", res.user.uid, "activity"), {
        type: "login",
        createdAt: serverTimestamp(),
      });

      setStatus("ACCESS GRANTED");
    } catch (err) {
      let message = "Login failed";

      if (err.code === "auth/invalid-credential") {
        message = "Incorrect email or password";
      } else if (err.code === "auth/user-not-found") {
        message = "Account not found";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format";
      }

      setStatus(message);
    }

    setLoading(false);
  };

  const logout = async () => {
    if (user) {
      await addDoc(collection(db, "users", user.uid, "activity"), {
        type: "logout",
        createdAt: serverTimestamp(),
      });
    }

    await signOut(auth);
    setUser(null);
    setUserData(null);
    setEmail("");
    setPassword("");
    setStatus("");
    setIsRegister(false);
    setActiveTab("dashboard");
    setProgress({});
    setNotes("");
    setSavedNotes([]);
    setActivity([]);
  };

  const markStepComplete = async () => {
    if (!user) return;

    const nextIndex = Math.min(
      currentStepIndex + 1,
      currentRoadmap.steps.length - 1
    );
    const updatedProgress = {
      ...progress,
      [activeGoal]: nextIndex,
    };

    setProgress(updatedProgress);

    await updateDoc(doc(db, "users", user.uid), {
      progress: updatedProgress,
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "users", user.uid, "activity"), {
      type: "step-complete",
      goal: activeGoal,
      step: currentStep.title,
      createdAt: serverTimestamp(),
    });
  };

  const saveNote = async () => {
    if (!user || !notes.trim()) return;

    await addDoc(collection(db, "users", user.uid, "notes"), {
      goal: activeGoal,
      note: notes,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "users", user.uid, "activity"), {
      type: "note-saved",
      goal: activeGoal,
      note: notes,
      createdAt: serverTimestamp(),
    });

    setNotes("");
    setStatus("NOTE SAVED");
  };

  useEffect(() => {
    if (!user) return;

    const activityQuery = query(
      collection(db, "users", user.uid, "activity"),
      orderBy("createdAt", "desc")
    );

    const unsubActivity = onSnapshot(activityQuery, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setActivity(items.slice(0, 5));
    });

    const notesQuery = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("createdAt", "desc")
    );

    const unsubNotes = onSnapshot(notesQuery, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSavedNotes(items);
    });

    return () => {
      unsubActivity();
      unsubNotes();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-bg">
          <div className="auth-orb auth-orb-blue" />
          <div className="auth-orb auth-orb-orange" />
          <div className="auth-grid" />
        </div>

        <div className="auth-shell">
          <section className="brand-panel">
            <div className="brand-badge">PLSP</div>
            <h1 className="brand-title">Study Path Generator</h1>
            <p className="brand-subtitle">Computer Engineering Learning System</p>

            <div className="brand-divider" />

            <div className="brand-points">
              <div className="brand-point">
                <span className="brand-icon">◎</span>
                <span>Track your subjects and progress</span>
              </div>
              <div className="brand-point">
                <span className="brand-icon">◎</span>
                <span>Organize goals and study plans</span>
              </div>
              <div className="brand-point">
                <span className="brand-icon">◎</span>
                <span>Built for a clean engineering workflow</span>
              </div>
            </div>
          </section>

          <section className="form-panel">
            <div className="form-card">
              <h2 className="form-title">{isRegister ? "Create Account" : "Login"}</h2>
              <p className="form-note">
                {isRegister
                  ? "Sign up to start using the system."
                  : "Enter your credentials to continue."}
              </p>

              <input
                type="email"
                placeholder="Email"
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {!isRegister ? (
                <button onClick={login} disabled={loading} className="primary-btn">
                  {loading ? "AUTHENTICATING..." : "LOGIN"}
                </button>
              ) : (
                <button onClick={register} disabled={loading} className="primary-btn">
                  {loading ? "CREATING ACCOUNT..." : "REGISTER"}
                </button>
              )}

              <p className="switch-text">
                {!isRegister ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsRegister(!isRegister)}>
                  {!isRegister ? "Create one" : "Back to login"}
                </span>
              </p>

              {loading && (
                <div className="loading-row">
                  <div className="spinner" />
                  <span>Processing request...</span>
                </div>
              )}

              {status && <p className="status-text">{status}</p>}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-blue" />
        <div className="auth-orb auth-orb-orange" />
        <div className="auth-grid" />
      </div>

      <div className="dashboard-shell">
        <aside className="sidebar">
          <div>
            <h2 className="sidebar-title">⚙ CE Dashboard</h2>

            <nav className="nav-list">
              <button
                onClick={() => setActiveTab("tracker")}
                className={`nav-btn ${activeTab === "tracker" ? "active" : ""}`}
              >
                📊 Tracker
              </button>
              <button
                onClick={() => setActiveTab("math")}
                className={`nav-btn ${activeTab === "math" ? "active" : ""}`}
              >
                📘 Mathematics
              </button>
              <button
                onClick={() => setActiveTab("programming")}
                className={`nav-btn ${activeTab === "programming" ? "active" : ""}`}
              >
                💻 Programming
              </button>
              <button
                onClick={() => setActiveTab("electronics")}
                className={`nav-btn ${activeTab === "electronics" ? "active" : ""}`}
              >
                ⚡ Electronics
              </button>
              <button
                onClick={() => setActiveTab("networking")}
                className={`nav-btn ${activeTab === "networking" ? "active" : ""}`}
              >
                🌐 Networking
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`nav-btn ${activeTab === "other" ? "active" : ""}`}
              >
                📚 Other Subjects
              </button>
            </nav>
          </div>

          <button onClick={logout} className="danger-btn">
            Log Out
          </button>
        </aside>

        <main className="content">
          <div className="dashboard-hero">
            <div>
              <p className="eyebrow">STUDENT PORTAL</p>
              <h1 className="dashboard-title">Study Path Dashboard</h1>
              <p className="dashboard-subtitle">Computer Engineering Learning System</p>
            </div>
          </div>

          <section className="info-grid">
            <div className="info-card">
              <p className="info-label">Logged in as</p>
              <p className="info-value">{user.email}</p>
            </div>

            <div className="info-card">
              <p className="info-label">Course</p>
              <p className="info-value">{userData?.course ?? "—"}</p>
            </div>

            <div className="info-card">
              <p className="info-label">Selected Goal</p>
              <p className="info-value">{dashboardGoal}</p>
            </div>

            <div className="info-card">
              <p className="info-label">Current Step</p>
              <p className="info-value">{dashboardCurrentStep?.title ?? "—"}</p>
            </div>
          </section>

          {activeTab === "dashboard" ? (
            <section className="tracker-empty">
              <h3>Welcome</h3>
              <p>Choose a subject from the sidebar to view its roadmap.</p>
            </section>
          ) : (
            <>
              <section className="roadmap-section">
                <div className="roadmap-header">
                  <h2>{activeGoal}</h2>
                  <p>{currentRoadmap.description}</p>
                  <p>
                    Current Step: <strong>{currentStep?.title ?? "—"}</strong>
                  </p>
                  <button className="step-btn" onClick={markStepComplete}>
                    Mark Step Complete
                  </button>
                </div>

                <div className="step-list">
                  {currentRoadmap.steps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`step-card ${index <= currentStepIndex ? "done" : ""}`}
                    >
                      <h4>
                        {index + 1}. {step.title}
                      </h4>

                      <div className="resource-list">
                        {step.resources.map((r) => (
                          <a key={r.label} href={r.url} target="_blank" rel="noreferrer">
                            {r.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="notes-section">
                <h3>Progress Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write what you learned, what is difficult, or what to study next..."
                />
                <button className="primary-btn" onClick={saveNote}>
                  Save Note
                </button>

                <div className="saved-notes">
                  {savedNotes.length === 0 ? (
                    <p className="empty-text">No saved notes yet.</p>
                  ) : (
                    savedNotes.map((item) => (
                      <div key={item.id} className="history-item">
                        <strong>{item.goal}</strong> — {item.note}
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="history-section">
                <h3>Recent Activity</h3>
                <div className="history-list">
                  {activity.length === 0 ? (
                    <p className="empty-text">No activity yet.</p>
                  ) : (
                    activity.map((item) => (
                      <div key={item.id} className="history-item">
                        <strong>{item.goal || "System"}</strong> — {formatActivityLabel(item)}
                        {item.step ? ` — ${item.step}` : ""}
                        {item.note ? ` — ${item.note}` : ""}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}