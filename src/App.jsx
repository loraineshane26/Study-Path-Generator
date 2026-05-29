import { useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState(null);

  const register = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        course: "Computer Engineering",
        path: "Programming",
        createdAt: new Date(),
      });

      const docSnap = await getDoc(doc(db, "users", res.user.uid));
      if (docSnap.exists()) setUserData(docSnap.data());

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
      if (docSnap.exists()) setUserData(docSnap.data());

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
    await signOut(auth);
    setUser(null);
    setUserData(null);
    setEmail("");
    setPassword("");
    setStatus("");
    setIsRegister(false);
    setActiveTab("dashboard");
  };

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
            <p className="brand-subtitle">Computer Engineering AI System</p>

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

            <button
              onClick={async () => {
                await setDoc(doc(db, "test", "hello"), {
                  message: "Firestore works",
                  time: new Date(),
                });
              }}
              className="ghost-btn"
            >
              Test Firestore
            </button>
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
              <p className="info-label">Path</p>
              <p className="info-value">{userData?.path ?? "—"}</p>
            </div>

            <div className="info-card">
              <p className="info-label">Active Section</p>
              <p className="info-value">{activeTab}</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}