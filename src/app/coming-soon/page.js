export default function ComingSoon() {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "#020617",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1>🚧 Dashboard Coming Soon</h1>
  
        <p style={{ color: "#94a3b8", marginTop: 10 }}>
          We’re still working on making the product stable for live environment.
        </p>
  
        <p style={{ marginTop: 20 }}>
          You can explore it locally:
        </p>
  
        <code
          style={{
            marginTop: 10,
            padding: "10px 15px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 8,
          }}
        >
          git clone https://github.com/your-repo/qa-agent
        </code>
      </div>
    );
  }