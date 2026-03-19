import React, { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

function CreateCasePage() {

  const [title, setTitle] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("low"); // ✅ ADDED

  const navigate = useNavigate();

  const userName = localStorage.getItem("loggedInUserName") || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  title,
  caseNumber,
  description,
  status,
  priority
})
      });

      const data = await res.json();

      console.log("CREATE RESPONSE 👉", data);

      if (res.ok) {
        alert("Case created successfully!");
        navigate("/all-cases");
      } else {
        alert(data.message || "Error creating case");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout
      userName={userName}
      userInitials={userInitials}
    >
      <div style={{ padding: "30px", maxWidth: "600px" }}>

        <h2>Create New Case</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Case Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Case Number"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <textarea
            placeholder="Case Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          {/* STATUS */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          >
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>

          {/* PRIORITY */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Create Case
          </button>

        </form>

      </div>
    </DashboardLayout>
  );
}

export default CreateCasePage;