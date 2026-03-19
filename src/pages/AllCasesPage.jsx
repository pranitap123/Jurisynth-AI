import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function AllCasesPage() {

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [search, setSearch] = useState("");

  const userName = localStorage.getItem("loggedInUserName") || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cases");
      const data = await res.json();

      if (Array.isArray(data)) {
        const priorityOrder = { high: 1, medium: 2, low: 3 };

        const sorted = [...data].sort((a, b) => {
          const pA = (a.priority || "low").toLowerCase();
          const pB = (b.priority || "low").toLowerCase();
          return priorityOrder[pA] - priorityOrder[pB];
        });

        setCases(sorted);
        setFilteredCases(sorted);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);

    const filtered = cases.filter((c) =>
      c.title?.toLowerCase().includes(keyword) ||
      c.caseNumber?.toLowerCase().includes(keyword)
    );

    setFilteredCases(filtered);
  };

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>

      <div style={{ padding: "30px" }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <h2>All Cases</h2>

          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={handleSearch}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #333",
              width: "250px"
            }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Case ID</th>
              <th>Status</th>
              <th>Created</th>
              <th>Priority</th>
              <th>Documents</th> {/* ✅ NEW COLUMN */}
            </tr>
          </thead>

          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => {
                let p = (c.priority || "low").toLowerCase();

                let color = "#ccc";
                if (p === "high") color = "red";
                else if (p === "medium") color = "orange";
                else if (p === "low") color = "green";

                return (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.caseNumber}</td>
                    <td>{c.status || "Processing"}</td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ color, fontWeight: "bold" }}>
                      {p}
                    </td>

                    {/* ✅ DOCUMENT DISPLAY */}
                    <td>
                      {c.documents?.length > 0 ? (
                        c.documents.map((doc, index) => (
                          <div key={index} style={{ marginBottom: "6px" }}>
                            📁 {doc.fileName}
                            <br />
                            <a
                              href={`http://localhost:5000/uploads/${doc.fileUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "blue", fontSize: "12px" }}
                            >
                              View
                            </a>
                          </div>
                        ))
                      ) : (
                        "No Docs"
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default AllCasesPage;