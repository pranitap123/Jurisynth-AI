import React, { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function GlobalSearchPage() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const userName = localStorage.getItem("loggedInUserName") || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  const handleSearch = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cases");
      const data = await res.json();

      if (Array.isArray(data)) {

        const keyword = query.toLowerCase();

        const filtered = data.filter((c) =>
          c.title?.toLowerCase().includes(keyword) ||
          c.caseNumber?.toLowerCase().includes(keyword) ||
          c.description?.toLowerCase().includes(keyword) ||
          c.status?.toLowerCase().includes(keyword) ||
          c.priority?.toLowerCase().includes(keyword)
        );

        setResults(filtered);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>

      <div style={{ padding: "30px" }}>

        <h2>Global Search</h2>

        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #333",
              width: "300px"
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Search
          </button>
        </div>

        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Case Name</th>
                <th>Case ID</th>
                <th>Status</th>
                <th>Created</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {results.map((c) => {
                let p = (c.priority || "low").toLowerCase();

                let color = "#ccc";
                if (p === "high") color = "red";
                else if (p === "medium") color = "yellow";
                else if (p === "low") color = "green";

                return (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.caseNumber}</td>
                    <td>{c.status}</td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ color, fontWeight: "bold" }}>
                      {p}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      </div>

    </DashboardLayout>
  );
}

export default GlobalSearchPage;