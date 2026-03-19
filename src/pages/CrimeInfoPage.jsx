import React, { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function CrimeInfoPage() {

  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const userName = localStorage.getItem("loggedInUserName") || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  // 🔥 STATIC DATA
  const crimeDB = [
    { crime: "murder", section: "IPC 302", punishment: "Death penalty or life imprisonment + fine" },
    { crime: "rape", section: "IPC 376", punishment: "Rigorous imprisonment (10 years to life)" },
    { crime: "theft", section: "IPC 378", punishment: "Up to 3 years imprisonment or fine or both" },
    { crime: "robbery", section: "IPC 392", punishment: "Up to 10 years imprisonment + fine" },
    { crime: "cheating", section: "IPC 420", punishment: "Up to 7 years imprisonment + fine" },
    { crime: "kidnapping", section: "IPC 363", punishment: "Up to 7 years imprisonment + fine" },
    { crime: "assault", section: "IPC 351", punishment: "Up to 3 months imprisonment or fine" },
    { crime: "domestic violence", section: "PWDVA Act", punishment: "Protection orders + penalties" },
    { crime: "cyber crime", section: "IT Act 66", punishment: "Up to 3 years imprisonment + fine" },
    { crime: "dowry", section: "IPC 304B", punishment: "Minimum 7 years to life imprisonment" }
  ];

  const handleSearch = () => {
    const keyword = query.toLowerCase();

    const found = crimeDB.find((c) =>
      c.crime.includes(keyword)
    );

    setResult(found || null);
  };

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>

      <div style={{ padding: "30px" }}>

        {/* ✅ SAME STYLE AS GLOBAL SEARCH */}
        <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px" }}>
          Crime → Section & Punishment
        </h2>

        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="Search crime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #2d3748",
              width: "300px",
              background: "#111827",
              color: "white"
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

        {/* ✅ RESULT */}
        {!result ? (
          <p>No data found.</p>
        ) : (
          <div style={{
            border: "1px solid #2d3748",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "10px"
          }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              <strong>Crime:</strong> {result.crime.toUpperCase()}
            </p>

            <p style={{ fontSize: "14px", marginBottom: "6px" }}>
              <strong>Section:</strong> {result.section}
            </p>

            <p style={{ fontSize: "14px" }}>
              <strong>Punishment:</strong> {result.punishment}
            </p>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
}

export default CrimeInfoPage;