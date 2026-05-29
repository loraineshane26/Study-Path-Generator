import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

/* ===================== BACKGROUND CODE STREAM ===================== */
const codeLines = [
  "SYSTEM BOOT SEQUENCE INITIATED",
  "STUDY PATH GENERATOR ONLINE",
  "firebase.auth.CONNECT(secure=true);",
  "database.SYNC(user_records);",
  "network.STREAM.established();",
  "cpu.ALLOCATE(max_performance);",
  "memory.CACHE.optimize(HIGH_MODE);",
  "ENGINEERING_CORE.initialize();",
  "AI_MODEL.train(engineering_dataset_v3);",
  "PATH_GENERATOR.build(student_profile);",
  "ALGORITHM.optimize_learning_route();",
  "AUTH.verify(email, password);",
  "SECURITY.encrypt(session_token, AES256);",
  "ACCESS_LEVEL = GRANTED;",
  "STUDY_PATH.NODE.connect(MATH);",
  "STUDY_PATH.NODE.connect(PROGRAMMING);",
  "STUDY_PATH.NODE.connect(ELECTRONICS);",
  "[OK] SYSTEM READY",
  "[OK] FIREBASE CONNECTED",
  "[OK] ENGINE ACTIVE",
];

const infiniteCode = Array(500).fill(codeLines).flat().join("\n");

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  console.log("AUTH:", auth);
console.log("DB:", db);
const testFirestore = async () => {
  try {
    await setDoc(doc(db, "test", "hello"), {
      message: "Firestore works",
      time: new Date()
    });

    console.log("WRITE SUCCESS");
  } catch (err) {
    console.log("ERROR:", err.message);
  }
};

  /* ================= REGISTER ================= */
  const register = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // SAVE USER DATA TO FIRESTORE
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        course: "Computer Engineering",
        path: "Programming",
        createdAt: new Date(),
      });

      // READ USER DATA
      const docRef = doc(db, "users", res.user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
        console.log(docSnap.data());
      }

      setUser(res.user);

      setStatus("ACCOUNT CREATED");
    } catch (err) {
      setStatus("ERROR");
      alert(err.message);
    }

    setLoading(false);
  };

  /* ================= LOGIN ================= */
  const login = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      setUser(res.user);

      // GET USER DATA FROM FIRESTORE
      const docRef = doc(db, "users", res.user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
        console.log(docSnap.data());
      }

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

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  /* ================= LOGIN PAGE ================= */
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#010310] relative overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute inset-0 animate-marquee whitespace-pre text-green-300 text-sm font-mono opacity-40">
            {infiniteCode}
          </div>

          <div className="absolute inset-0 animate-marquee2 whitespace-pre text-blue-300 text-sm font-mono opacity-25">
            {infiniteCode}
          </div>

          <div className="absolute inset-0 animate-marquee whitespace-pre text-orange-300 text-xs font-mono opacity-20">
            {infiniteCode}
          </div>

          <div className="absolute w-[800px] h-[800px] bg-blue-600 blur-3xl opacity-30 top-[-150px] left-[-150px] rounded-full animate-pulse"></div>

          <div className="absolute w-[800px] h-[800px] bg-orange-500 blur-3xl opacity-30 bottom-[-150px] right-[-150px] rounded-full animate-pulse"></div>

        </div>

        {/* LOGIN CARD */}
        <div className="z-10 w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

          <h1 className="text-white text-3xl font-bold text-center">
            Study Path Generator
          </h1>

          <p className="text-center text-blue-200 text-sm mt-2">
            Computer Engineering AI System
          </p>

          {!isRegister ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full mt-6 p-3 rounded bg-white/10 text-white border border-white/30"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mt-3 p-3 rounded bg-white/10 text-white border border-white/30"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={login}
                disabled={loading}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold text-white"
              >
                {loading ? "AUTHENTICATING..." : "LOGIN"}
              </button>

              <p className="text-center text-gray-300 mt-5 text-sm">
                Don't have an account?
              </p>

              <button
                onClick={() => setIsRegister(true)}
                className="w-full mt-3 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold text-white"
              >
                CREATE ACCOUNT
              </button>
            </>
          ) : (
            <>
              <h2 className="text-center text-white text-xl font-bold mt-4">
                Create Your Account
              </h2>

              <input
                type="email"
                placeholder="Enter Email"
                className="w-full mt-6 p-3 rounded bg-white/10 text-white border border-white/30"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Create Password"
                className="w-full mt-3 p-3 rounded bg-white/10 text-white border border-white/30"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={register}
                disabled={loading}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold text-white"
              >
                {loading ? "CREATING ACCOUNT..." : "REGISTER"}
              </button>

              <p
                onClick={() => setIsRegister(false)}
                className="text-center text-blue-300 mt-4 cursor-pointer hover:underline text-sm"
              >
                Back to Login
              </p>
            </>
          )}

          {loading && (
            <div className="flex flex-col items-center mt-4 text-white">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              <p className="text-xs mt-2 opacity-80">
                Processing request...
              </p>
            </div>
          )}

          {status && (
            <p className="text-center mt-4 text-white font-bold tracking-widest">
              {status}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="min-h-screen flex bg-[#010310] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black/60 border-r border-white/10 flex flex-col justify-between p-5">

        <div>
          <h2 className="text-2xl font-bold text-orange-400 mb-8">
            ⚙ CE Dashboard
          </h2>

          <div className="flex flex-col gap-2">

            <button
              onClick={() => setActiveTab("tracker")}
              className="text-left px-3 py-2 rounded hover:bg-blue-500/30"
            >
              📊 Tracker
            </button>

            <button
              onClick={() => setActiveTab("math")}
              className="text-left px-3 py-2 rounded hover:bg-blue-500/30"
            >
              📘 Mathematics
            </button>

            <button
              onClick={() => setActiveTab("programming")}
              className="text-left px-3 py-2 rounded hover:bg-orange-500/30"
            >
              💻 Programming
            </button>

            <button
              onClick={() => setActiveTab("electronics")}
              className="text-left px-3 py-2 rounded hover:bg-cyan-500/30"
            >
              ⚡ Electronics
            </button>

            <button
              onClick={() => setActiveTab("other")}
              className="text-left px-3 py-2 rounded hover:bg-white/10"
            >
              📚 Other Subjects
            </button>

          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 py-2 rounded font-bold"
        >
          Log Out
        </button>

      </div>

      <button
  onClick={testFirestore}
  className="bg-green-500 px-4 py-2 rounded mt-4"
>
  TEST FIRESTORE
</button>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

          <h1 className="text-3xl font-bold text-center text-blue-200">
            🎓 Study Path Dashboard
          </h1>

          <p className="text-center text-orange-300 mt-2">
            Computer Engineering Learning System
          </p>

          <div className="mt-8 bg-black/40 p-5 rounded-xl border border-white/10">

            <p className="text-gray-300 text-sm">
              Logged in as:
            </p>

            <p className="text-lg font-semibold">
              {user.email}
            </p>

            <div className="mt-4">
              <p>Course: {userData?.course}</p>
              <p>Path: {userData?.path}</p>
            </div>

          </div>

          <div className="mt-6 text-center text-gray-300">
            Active Section: {activeTab}
          </div>

        </div>
      </div>
    </div>
  );
}
