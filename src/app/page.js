"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <div style={container}>
      <style>{animations}</style>

      {/* HERO */}
      <section style={hero}>
        <h1 style={title}>
          ⚡ AI-Powered API Testing
        </h1>

        <p style={subtitle}>
          Stop guessing failures. Get root cause + fixes instantly.
        </p>

        <p style={tagline}>
          Works locally • No setup • AI-powered insights
        </p>

        {/* INSTALL BLOCK */}
        <div style={installBox}>
          <code style={code}>npx qa-agent init</code>
          <button
            style={copyBtn}
            onClick={() => {
              navigator.clipboard.writeText("npx qa-agent init");
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Copy
          </button>
        </div>

        <div style={{ marginTop: 25 }}>
          <Link href="/dashboard" style={primaryBtn}>
            Launch Dashboard
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={section}>
        <h2 style={sectionTitle}>Why QA Agent?</h2>

        <div style={grid}>
          <Feature title="🧠 Smart Insights" desc="Real reasons & fixes, not just errors" />
          <Feature title="⚡ Swagger → Tests" desc="Generate test cases instantly" />
          <Feature title="📊 Visual Dashboard" desc="Understand API health at a glance" />
          <Feature title="🔐 Security Checks" desc="Catch vulnerabilities early" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={section}>
        <h2 style={sectionTitle}>How It Works</h2>

        <div style={steps}>
          <Step num="1" text="Install CLI" />
          <Step num="2" text="Run Tests on Swagger" />
          <Step num="3" text="Get Insights + Fixes" />
        </div>
      </section>

      {/* CTA */}
      <section style={cta}>
        <h2>Start Testing Like a Pro 🚀</h2>

        <div style={installBox}>
          <code style={code}>npx qa-agent start</code>
        </div>
      </section>
    </div>
  );
}

/* COMPONENTS */

function Feature({ title, desc }) {
  return (
    <div
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <h3>{title}</h3>
      <p style={{ color: "#94a3b8" }}>{desc}</p>
    </div>
  );
}

function Step({ num, text }) {
  return (
    <div style={step}>
      <div style={stepNum}>{num}</div>
      <div>{text}</div>
    </div>
  );
}

/* 🎬 ANIMATIONS */

const animations = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  0% { box-shadow: 0 0 0px rgba(59,130,246,0.4); }
  50% { box-shadow: 0 0 25px rgba(99,102,241,0.6); }
  100% { box-shadow: 0 0 0px rgba(59,130,246,0.4); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}
`;

/* 🎨 STYLES */

const container = {
  background: `
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.15), transparent),
    radial-gradient(circle at 80% 30%, rgba(168,85,247,0.15), transparent),
    linear-gradient(135deg,#0f172a,#020617)
  `,
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif"
};

const hero = {
  textAlign: "center",
  padding: "140px 20px",
  animation: "fadeIn 0.8s ease"
};

const title = {
  fontSize: 56,
  fontWeight: 900,
  letterSpacing: "-1px",
  background: "linear-gradient(90deg,#3b82f6,#a855f7,#06b6d4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const subtitle = {
  color: "#94a3b8",
  marginTop: 10,
  fontSize: 18
};

const tagline = {
  marginTop: 15,
  fontSize: 14,
  color: "#64748b"
};

const installBox = {
  marginTop: 30,
  display: "inline-flex",
  alignItems: "center",
  background: "rgba(2,6,23,0.8)",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  animation: "glow 3s infinite",
  backdropFilter: "blur(10px)"
};

const code = {
  fontFamily: "monospace",
  marginRight: 10
};

const copyBtn = {
  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const primaryBtn = {
  padding: "12px 20px",
  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
  borderRadius: 10,
  color: "#fff",
  textDecoration: "none"
};

const section = {
  padding: "80px 20px",
  textAlign: "center"
};

const sectionTitle = {
  fontSize: 32,
  fontWeight: 700
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
  marginTop: 40
};

const card = {
  background: "rgba(30,41,59,0.6)",
  padding: 20,
  borderRadius: 14,
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.05)",
  transition: "all 0.3s ease"
};

const steps = {
  display: "flex",
  justifyContent: "center",
  gap: 40,
  marginTop: 30
};

const step = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: "float 3s ease-in-out infinite"
};

const stepNum = {
  background: "#3b82f6",
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10
};

const cta = {
  textAlign: "center",
  padding: 100,
  background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))"
};