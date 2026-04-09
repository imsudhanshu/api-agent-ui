"use client";

import { useState,useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { generateReportHTML } from '../utils/generateReportHTML';

export default function Home() {
  const [swagger, setSwagger] = useState("");
  const [swaggerUrl, setSwaggerUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("json");
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [activeConfig, setActiveConfig] = useState(null);

  function getFailureInsight(message) {
    if (!message) return "Unknown issue";

    if (message.includes("404")) return "🚫 Endpoint not found";
    if (message.includes("401")) return "🔐 Unauthorized";
    if (message.includes("400")) return "⚠️ Bad request";
    if (message.includes("500")) return "💥 Server error";
    if (message.includes("timeout")) return "⏱️ Timeout";

    return "❗ Unexpected error";
  }
  useEffect(() => {
    const saved = localStorage.getItem("qa-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProvider(parsed.provider || "openai");
      setApiKey(parsed.apiKey || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("qa-config", JSON.stringify({ provider, apiKey }));
  }, [provider, apiKey]);

  useEffect(() => {
    fetch("http://localhost:3000/api/config")
      .then(res => res.json())
      .then(data => {
        setActiveConfig(data);
  
        // 🔥 Sync UI with backend config
        if (data.mode === "local") {
          setProvider("local");
        } else {
          setProvider(data.provider);
        }
      })
      .catch(err => {
        console.error("Failed to fetch config", err);
      });
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const res = await fetch("http://localhost:3000/api/swagger-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
  
        body: JSON.stringify({
          swagger: JSON.parse(swagger),
  
          //THIS IS THE IMPORTANT PART
          config: {
            provider,
            apiKey
          }
        })
      });
  
      const data = await res.json();
      setResult(data);
  
    } catch (err) {
      console.error(err);
      alert("Error running tests");
    } finally {
      setLoading(false);
    }
  };

  const fetchSwagger = async () => {
    try {
      const res = await fetch(swaggerUrl);
      const data = await res.json();
      setSwagger(JSON.stringify(data, null, 2));
    } catch {
      alert("Invalid Swagger URL");
    }
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => setSwagger(e.target.result);
    reader.readAsText(e.target.files[0]);
  };
  const handleSaveKey = () => {
    localStorage.setItem(
      "qa-config",
      JSON.stringify({ provider, apiKey })
    );
    alert("API key saved locally");
  };
  
  const handleClearKey = () => {
    setApiKey("");
    localStorage.removeItem("qa-config");
  };
  const handleExport = async () => {
    if (!result) return alert("Run tests first");
  
    try {
      const reportData = {
        totalTests: result.meta?.totalTests || 0,
        passed: result.execution?.numPassedTests || 0,
        failed: result.execution?.numFailedTests || 0,
        tests: result.execution?.testResults?.[0]?.assertionResults?.map((t) => ({
          name: t.title,
          method: "POST",
          endpoint: "N/A",
          expectedStatus: "N/A",
          actualStatus: t.status === "passed" ? 200 : 500
        })) || []
      };
  
      const html = generateReportHTML(reportData);
  
      const res = await fetch('http://localhost:3000/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'api-report.pdf';
      a.click();
  
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    }
  };
  const chartData = result
    ? [
        { name: "Passed", value: result.execution?.numPassedTests },
        { name: "Failed", value: result.execution?.numFailedTests }
      ]
    : [];

  return (
    <div style={layout}>
      <style>{animations}</style>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={{ fontWeight: 800 }}>⚡ QA Agent</h2>
        <p style={muted}>AI Testing Platform</p>
      </div>

      {/* MAIN */}
      <div style={main}>
        <div style={header}>
          <h2>Dashboard</h2>
          <br />
          <div style={{ ...card, maxWidth: 320 }}>
            <h3>🧠 AI Configuration</h3>

            <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                style={input}
            >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="perplexity">Perplexity</option>
                <option value="local">Local (Ollama)</option>
            </select>

            {provider !== "local" && (
                <input
                type="password"
                placeholder="Enter API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={input}
                />
            )}

            {/* 🔥 ACTION BUTTONS */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={handleSaveKey} style={btnPrimary}>
                Save
                </button>

                <button onClick={handleClearKey} style={btnSecondary}>
                Clear
                </button>
            </div>

            {/* 🔥 STATUS */}
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                {provider === "local"
                ? "⚡ Using local Ollama"
                : apiKey
                ? "✅ API key saved locally"
                : "⚠ API key not saved"}
            </div>
            </div>
        </div>

        <div style={content}>

          {/* INPUT CARD */}
          <div style={card} className="hover-card">
            <h3>📥 Swagger Input</h3>

            <div style={tabs}>
              {["json"].map(type => (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  style={{
                    ...tabBtn,
                    background: inputType === type ? "#3b82f6" : "#1e293b"
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* {inputType === "url" && (
              <>
                <input
                  placeholder="Swagger URL..."
                  value={swaggerUrl}
                  onChange={(e) => setSwaggerUrl(e.target.value)}
                  style={input}
                />
                <button onClick={fetchSwagger} style={btnSecondary}>
                  Load Swagger
                </button>
              </>
            )}

            {inputType === "file" && (
              <input type="file" onChange={handleFileUpload} />
            )} */}

            {inputType === "json" && (
              <textarea
                rows="8"
                value={swagger}
                onChange={(e) => setSwagger(e.target.value)}
                style={textarea}
              />
            )}

            <button onClick={handleSubmit} style={btnPrimary}>
              {loading ? "⚡ Running tests..." : "Run Tests"}
            </button>
          </div>

          {/* RESULTS */}
          <div style={card} className="hover-card">
            <h3>📊 Results</h3>
            <br />
            {result && (
              <button
                onClick={handleExport}
                style={{
                  marginBottom: 12,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ⬇ Export PDF
              </button>
            )}

            {!result && <p style={muted}>Run tests to see results</p>}

            {result && (
              <>
                {/* Summary */}
                <div style={grid}>
                  <Metric label="Endpoints" value={result.meta?.totalEndpoints} />
                  <Metric label="Tests" value={result.meta?.totalTests} />
                </div>

                {/* Chart */}
                <div style={reportBox}>
                  <h4>📊 Distribution</h4>

                  <PieChart width={300} height={220}>
                    <Pie data={chartData} dataKey="value">
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

                {/* Test Cases */}
                <h4 style={{ marginTop: 20 }}>🧪 Test Cases</h4>

                {/* {result.execution?.testResults?.[0]?.assertionResults?.map((t, i) => {
                  const error = t.failureMessages?.[0] || "";
                  const insight = getFailureInsight(error);

                  return (
                    <div
                      key={i}
                      style={{
                        ...testCard,
                        animation: `fadeIn 0.4s ease forwards`,
                        animationDelay: `${i * 0.05}s`,
                        borderLeft: `4px solid ${
                          t.status === "passed" ? "#22c55e" : "#ef4444"
                        }`
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{t.title}</div>

                      <span style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        background:
                          t.status === "passed"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                        color:
                          t.status === "passed"
                            ? "#22c55e"
                            : "#ef4444"
                      }}>
                        {t.status.toUpperCase()}
                      </span>

                      {t.status === "failed" && (
                        <>
                          <div style={{ fontSize: 12, marginTop: 5 }}>
                            {error.slice(0, 120)}
                          </div>

                          <div style={{
                            marginTop: 5,
                            fontSize: 12,
                            color: "#facc15"
                          }}>
                            💡 {insight}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })} */}
                {result.execution?.testResults?.[0]?.assertionResults?.map((t, i) => {
                  const error = t.failureMessages?.[0] || "";
                  const insight = t.insight; // 👈 IMPORTANT (from backend now)

                  return (
                    <div
                      key={i}
                      style={{
                        ...testCard,
                        animation: `fadeIn 0.4s ease forwards`,
                        animationDelay: `${i * 0.05}s`,
                        borderLeft: `4px solid ${
                          t.status === "passed" ? "#22c55e" : "#ef4444"
                        }`
                      }}
                    >
                      {/* Title */}
                      <div style={{ fontWeight: "bold" }}>{t.title}</div>

                      {/* Status Badge */}
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        background:
                          t.status === "passed"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                        color:
                          t.status === "passed"
                            ? "#22c55e"
                            : "#ef4444"
                      }}>
                        {t.status.toUpperCase()}
                      </span>

                      {/* ❌ Error Message */}
                      {t.status === "failed" && (
                        <div style={{
                          fontSize: 12,
                          marginTop: 6,
                          color: "#f87171"
                        }}>
                          {error.slice(0, 120)}
                        </div>
                      )}

                      {/* 🧠 NEW INSIGHT BLOCK (ADD HERE 👇) */}
                      {t.status === "failed" && insight && (
                        <div style={{
                          marginTop: 8,
                          padding: 10,
                          background: "rgba(250,204,21,0.08)",
                          borderRadius: 8,
                          fontSize: 12,
                          border: "1px solid rgba(250,204,21,0.2)"
                        }}>
                          <div><b>⚠ Issue:</b> {insight.issue}</div>
                          <div><b>🧠 Reason:</b> {insight.reason}</div>
                          <div><b>🛠 Fix:</b> {insight.fix}</div>

                          <div style={{
                            marginTop: 5,
                            fontSize: 11,
                            color: "#94a3b8"
                          }}>
                            Confidence: {(insight.confidence * 100).toFixed(0)}% | {insight.source}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                              </>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                }

/* 🎬 ANIMATIONS */
const animations = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.hover-card:hover {
  transform: translateY(-5px);
}
`;

/* 🎨 STYLES */

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a,#020617)",
  color: "#fff",
  fontFamily: "Inter, sans-serif"
};

const sidebar = {
  width: 240,
  background: "rgba(2,6,23,0.9)",
  padding: 20,
  borderRight: "1px solid rgba(255,255,255,0.05)"
};

const main = { flex: 1, display: "flex", flexDirection: "column" };

const header = {
  padding: 20,
  borderBottom: "1px solid rgba(255,255,255,0.05)"
};

const content = { display: "flex", gap: 20, padding: 20 };

const card = {
  flex: 1,
  background: "rgba(30,41,59,0.6)",
  backdropFilter: "blur(10px)",
  padding: 20,
  borderRadius: 16,
  transition: "all 0.3s ease"
};

const reportBox = {
  background: "#020617",
  padding: 15,
  borderRadius: 10,
  marginTop: 15
};

const grid = { display: "flex", gap: 10, marginTop: 10 };

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: "none"
};

const textarea = {
  width: "100%",
  marginTop: 10,
  padding: 10,
  borderRadius: 8,
  border: "none"
};

const btnPrimary = {
  marginTop: 15,
  padding: 12,
  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
  border: "none",
  borderRadius: 10,
  color: "#fff",
  cursor: "pointer"
};

const btnSecondary = {
  marginTop: 10,
  padding: 10,
  background: "#1e293b",
  border: "none",
  borderRadius: 8,
  color: "#fff"
};

const tabs = { display: "flex", gap: 10, marginTop: 10 };

const tabBtn = {
  padding: "6px 12px",
  border: "none",
  borderRadius: 6,
  color: "#fff",
  cursor: "pointer"
};

const testCard = {
  marginTop: 12,
  padding: 14,
  background: "#020617",
  borderRadius: 10
};

const muted = { color: "#64748b" };

function Metric({ label, value }) {
  return (
    <div style={{
      flex: 1,
      background: "#020617",
      padding: 12,
      borderRadius: 10
    }}>
      <div style={{ color: "#64748b", fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}