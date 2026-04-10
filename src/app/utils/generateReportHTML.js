// /utils/generateReportHTML.js

export function generateReportHTML(data) {
  const successRate =
    data.totalTests > 0
      ? ((data.passed / data.totalTests) * 100).toFixed(2)
      : "0.00";

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 24px;
          color: #1f2937;
          background: #ffffff;
        }

        h1 {
          text-align: center;
          margin-bottom: 10px;
        }

        h2 {
          margin-top: 30px;
          border-bottom: 2px solid #eee;
          padding-bottom: 5px;
        }

        .meta {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .summary {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          gap: 10px;
        }

        .card {
          flex: 1;
          border: 1px solid #e5e7eb;
          padding: 14px;
          border-radius: 10px;
          text-align: center;
          background: #f9fafb;
        }

        .card h3 {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .card p {
          font-size: 20px;
          font-weight: bold;
          margin-top: 6px;
        }

        .success { color: #16a34a; }
        .fail { color: #dc2626; }

        .rate {
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          font-size: 13px;
          text-align: left;
        }

        th {
          background: #f3f4f6;
        }

        .passed {
          color: #16a34a;
          font-weight: bold;
        }

        .failed {
          color: #dc2626;
          font-weight: bold;
        }

        .error {
          font-size: 11px;
          color: #b91c1c;
          margin-top: 4px;
        }

        .insight-box {
          margin-top: 5px;
          padding: 6px;
          background: #fff7ed;
          border-radius: 5px;
          font-size: 11px;
        }

        .section-box {
          margin-top: 15px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        ul {
          margin: 0;
          padding-left: 18px;
        }

        li {
          margin-bottom: 5px;
          font-size: 13px;
        }

        .footer {
          margin-top: 40px;
          font-size: 11px;
          text-align: center;
          color: #9ca3af;
        }
      </style>
    </head>

    <body>

      <h1>🧪 API Test Report</h1>

      <div class="meta">
        Generated on: ${new Date().toLocaleString()}
      </div>

      <!-- SUMMARY -->
      <div class="summary">
        <div class="card">
          <h3>Total Tests</h3>
          <p>${data.totalTests}</p>
        </div>

        <div class="card">
          <h3 class="success">Passed</h3>
          <p class="success">${data.passed}</p>
        </div>

        <div class="card">
          <h3 class="fail">Failed</h3>
          <p class="fail">${data.failed}</p>
        </div>
      </div>

      <div class="rate">
        <strong>Success Rate:</strong> ${successRate}%
      </div>

      ${
        data.chartImage
          ? `<img src="${data.chartImage}" style="width:100%; margin:20px 0;" />`
          : ''
      }

      <!-- TEST TABLE -->
      <h2>🧪 Test Cases</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Expected</th>
          </tr>
        </thead>

        <tbody>
          ${data.tests
            .map(
              (t) => `
              <tr>
                <td>
                  ${t.name}
                  ${
                    t.error
                      ? `<div class="error">${t.error.slice(0, 120)}</div>`
                      : ""
                  }

                  ${
                    t.issue
                      ? `
                      <div class="insight-box">
                        ⚠ ${t.issue}<br/>
                        💡 ${t.fix || ""}
                      </div>
                    `
                      : ""
                  }
                </td>

                <td>${t.method}</td>
                <td>${t.endpoint}</td>

                <td class="${
                  t.actualStatus < 400 ? "passed" : "failed"
                }">
                  ${t.actualStatus < 400 ? "PASSED" : "FAILED"}
                </td>

                <td>${t.expectedStatus}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>

      <!-- PATTERNS -->
      ${
        data.insights?.patterns?.length
          ? `
        <h2>🔥 Failure Patterns</h2>
        <div class="section-box">
          <ul>
            ${data.insights.patterns
              .map((p) => `<li>${p.message}</li>`)
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <!-- COVERAGE -->
      ${
        data.insights?.coverage?.length
          ? `
        <h2>🧠 Coverage Suggestions</h2>
        <div class="section-box">
          <ul>
            ${data.insights.coverage
              .map((c) => `<li>${c}</li>`)
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <!-- TEST QUALITY -->
      ${
        data.insights?.testQuality?.length
          ? `
        <h2>⚠️ Test Quality Issues</h2>
        <div class="section-box">
          <ul>
            ${data.insights.testQuality
              .map(
                (q) => `<li><b>${q.test}</b>: ${q.problem}</li>`
              )
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <div class="footer">
        Generated by AI API Testing Tool 🚀
      </div>

    </body>
  </html>
  `;
}