import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] = useState([]);

  const userName = localStorage.getItem("loggedInUserName") || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  // ✅ FETCH CASES FOR DROPDOWN
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cases");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCases(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ HANDLE UPLOAD
  const handleUpload = async () => {
    if (!file || !caseId) {
      alert("Select case and file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/cases/upload/${caseId}`, // ✅ correct route
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("File uploaded successfully ✅");

        // ✅ RESET
        setFile(null);
        setCaseId("");
      } else {
        console.log(data);
        alert(data.message || "Upload failed ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Error uploading file ❌");
    }
  };

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>
      <div style={{ padding: "30px" }}>
        <h2>Upload Document</h2>

        {/* ✅ DROPDOWN INSTEAD OF MANUAL ID */}
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            width: "300px",
            display: "block",
          }}
        >
          <option value="">Select Case</option>
          {cases.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.caseNumber})
            </option>
          ))}
        </select>

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />

        <br />

        <button
          onClick={handleUpload}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>
    </DashboardLayout>
  );
}

export default UploadPage;