"use client";
import { useState, useEffect, useRef } from "react";

export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [logs, setLogs] = useState([]);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0px)";
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));

    // Fake live logs
    const messages = [
      "✔ GET /users → 200 OK",
      "✔ POST /login → 201 Created",
      "⚠ Missing auth header detected",
      "✔ GET /payments → 200 OK",
      "❌ POST /orders → 500 Server Error",
      "💡 Suggestion: Add validation for order payload",
    ];

    const interval = setInterval(() => {
      setLogs((prev) => [messages[Math.floor(Math.random() * messages.length)], ...prev.slice(0, 5)]);
    }, 1500);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={container}>
      <style>{animations}</style>

      {/* NAVBAR */}
      <div style={{ ...navbar, ...(scrolled ? navbarScrolled : {}) }}>
        <div style={{ fontWeight: 700 }}>QA Agent</div>
        <button style={navBtn} onClick={() => setShowModal(true)}>
          Launch
        </button>
      </div>

      {/* Cursor Glow */}
      <div
        style={{
          position: "fixed",
          top: cursor.y - 120,
          left: cursor.x - 120,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* HERO */}
      <section style={hero}>
        <h1 style={title}>⚡ AI-Powered API Testing</h1>

        <p style={subtitle}>
          Stop guessing failures. Get root cause + fixes instantly.
        </p>

        {/* INTEGRATIONS QUICK VIEW */}
        <div style={heroIntegrations}>
          <span style={badge}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" style={icon}/> Swagger</span>
          <span style={badge}><img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" style={icon}/> Postman</span>
          <span style={badge}>🤖 OpenAI Powered</span>
        </div>

        <div style={installBox}>
          <code style={code}>
           npx @sudhanshu04/api-agent init my-app
          </code>
        </div>

        <div style={{ marginTop: 25 }}>
          <button style={primaryBtn} onClick={() => setShowModal(true)}>
            Launch Dashboard
          </button>
        </div>

        {/* LIVE DASHBOARD */}
        <div style={liveDashboard}>
          <h3 style={{ marginBottom: 10 }}>Live API Insights</h3>

          <div style={typingBox}>
            <TypingText />
          </div>

          <div style={logBox}>
            {logs.map((log, i) => (
              <div key={i} style={logItem}>{log}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        style={fadeSection}
      >
        <h2 style={sectionTitle}>Why QA Agent?</h2>
        <p style={{ color: "#94a3b8", marginTop: 10 }}>
          Built for developers who want instant clarity, not logs overload.
        </p>
        <div style={grid}>
          <Feature title="🧠 Smart Insights" desc="Root cause + fixes" />
          <Feature title="⚡ Auto Test Generation" desc="From Swagger in seconds" />
          <Feature title="📊 Live Monitoring" desc="Real-time API health" />
          <Feature title="🔐 Security Checks" desc="Detect vulnerabilities" />
        </div>
      </section>

      {/* EXTRA CONTENT */}
      <section style={extraSection}>
        <h2 style={sectionTitle}>Built for Modern Teams</h2>
        <p style={{ color: "#94a3b8", maxWidth: 600, margin: "10px auto" }}>
          Whether you're a startup or scaling SaaS, QA Agent helps you ship
          faster with confidence by automating testing and surfacing insights.
        </p>
      </section>

      {/* INTEGRATIONS */}
      <section style={integrationSection}>
        <h2 style={sectionTitle}>Works With Your Existing Tools</h2>
        <p style={{ color: "#94a3b8", marginTop: 10 }}>
          No need to change your workflow. Plug QA Agent into tools you already use.
        </p>

        <div style={integrationGrid}>
          <div style={integrationCard}>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" style={bigLogo} />
            <h3>Swagger / OpenAPI</h3>
            <p style={integrationText}>
              Import your Swagger files and instantly generate test cases,
              validate endpoints, and detect edge cases.
            </p>
          </div>

          <div style={integrationCard}>
            <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" style={bigLogo} />
            <h3>Postman Collections</h3>
            <p style={integrationText}>
              Upload your Postman collections and let QA Agent analyze request
              flows, detect failures, and suggest fixes automatically.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section style={footer}>
        <p style={{ color: "#64748b" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <img src="https://avatars.githubusercontent.com/u/1?v=4" style={{ width: 36, height: 36, borderRadius: "50%" }} />
          <div>
            <div style={{ color: "#e2e8f0", fontWeight: 500 }}>Sudhanshu</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Built by developers, for developers</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
          🌐 Deployed on Vercel
        </div>
        </p>
      </section>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h2>🚧 Coming Soon</h2>
            <p style={{ color: "#94a3b8" }}>
              Product is stabilizing for live environment.
            </p>
            <div style={installBox}>
              <code style={code}>
              npx @sudhanshu04/api-agent init my-app
              </code>
            </div>
            <button style={primaryBtn} onClick={() => setShowModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TypingText() {
  const messages = [
    "Analyzing endpoint /orders...",
    "Detecting failure patterns...",
    "Identifying root cause...",
    "Generating fix suggestion...",
    "✅ Fix: Add payload validation schema"
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  useEffect(() => {
    if (index >= messages.length) return;

    if (subIndex < messages[index].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + messages[index][subIndex]);
        setSubIndex(subIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText("");
        setSubIndex(0);
        setIndex((prev) => (prev + 1) % messages.length);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [subIndex, index]);

  return (
    <div style={typingText}>
      {text}
      <span style={cursorBlink}>|</span>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={{ color: "#94a3b8" }}>{desc}</p>
    </div>
  );
}

const animations = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes blink {
  0%,100% { opacity: 1 }
  50% { opacity: 0 }
}
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const container = {
  background:
    "linear-gradient(270deg,#020617,#0f172a,#020617)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 15s ease infinite",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif",
};

const navbar = {
  position: "fixed",
  top: 0,
  width: "100%",
  padding: "16px 40px",
  display: "flex",
  justifyContent: "space-between",
};

const navbarScrolled = {
  backdropFilter: "blur(12px)",
  background: "rgba(2,6,23,0.6)",
};

const navBtn = {
  background: "#3b82f6",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  color: "#fff",
};

const hero = {
  textAlign: "center",
  padding: "160px 20px",
};

const title = {
  fontSize: 56,
  fontWeight: 900,
  background: "linear-gradient(90deg,#3b82f6,#a855f7,#06b6d4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = { color: "#94a3b8", marginTop: 10 };

const heroIntegrations = {
  marginTop: 20,
  display: "flex",
  justifyContent: "center",
  gap: 10,
  flexWrap: "wrap"
};

const badge = {
  background: "rgba(255,255,255,0.08)",
  padding: "6px 12px",
  borderRadius: 20,
  fontSize: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  gap: 6
};

const icon = {
  width: 14,
  height: 14
};

const installBox = {
  marginTop: 20,
  display: "inline-flex",
  background: "rgba(2,6,23,0.8)",
  padding: "10px 14px",
  borderRadius: 10,
};

const code = { fontFamily: "monospace" };

const primaryBtn = {
  marginTop: 20,
  padding: "12px 20px",
  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
  borderRadius: 10,
  border: "none",
  color: "#fff",
};

const liveDashboard = {
  marginTop: 60,
  maxWidth: 500,
  marginInline: "auto",
  background: "rgba(255,255,255,0.05)",
  padding: 20,
  borderRadius: 12,
  textAlign: "left",
};

const typingBox = {
  background: "rgba(0,0,0,0.4)",
  padding: "10px",
  borderRadius: 8,
  marginBottom: 10,
  fontFamily: "monospace",
  fontSize: 12,
  minHeight: 24
};

const typingText = {
  color: "#22c55e"
};

const cursorBlink = {
  marginLeft: 4,
  animation: "blink 1s infinite"
};

const logBox = {
  maxHeight: 150,
  overflow: "hidden",
  fontFamily: "monospace",
  fontSize: 12,
};

const logItem = {
  padding: "4px 0",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const fadeSection = {
  opacity: 0,
  transform: "translateY(40px)",
  transition: "all 0.8s ease",
  padding: "100px 20px",
  textAlign: "center",
};

const sectionTitle = { fontSize: 32 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  marginTop: 40,
};

const card = {
  background: "rgba(30,41,59,0.6)",
  padding: 20,
  borderRadius: 14,
};

const extraSection = {
  padding: "100px 20px",
  textAlign: "center",
};

const integrationSection = {
  padding: "100px 20px",
  textAlign: "center",
};

const integrationGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
  marginTop: 40,
};

const integrationCard = {
  background: "rgba(30,41,59,0.6)",
  padding: 24,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const bigLogo = {
  width: 50,
  height: 50,
  marginBottom: 12
};

const integrationText = {
  color: "#94a3b8",
  marginTop: 10,
  fontSize: 14,
};

const footer = {
  padding: "60px 20px",
  textAlign: "center",
  borderTop: "1px solid rgba(255,255,255,0.05)",
  marginTop: 60
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#020617",
  padding: 30,
  borderRadius: 16,
};
