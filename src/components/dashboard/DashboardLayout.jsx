import React, { useState } from "react";
import Sidebar from "./Sidebar";

function DashboardLayout({ children, userName, userInitials }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

 const [formData, setFormData] = useState({
  title: "",
  caseNumber: "",
  description: "",
  priority: "Medium"
});

  const handleCreateCase = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to create case");
      }

      alert("Case created successfully!");

      setFormData({
        title: "",
        caseNumber: "",
        description: ""
      });

      setIsModalOpen(false);

    } catch (error) {
      alert(error.message);
    }
  };

  return (

    <div className="dashboard-layout">

      <Sidebar
        userName={userName}
        userInitials={userInitials}
        openCreateCase={() => setIsModalOpen(true)}
      />

      <main className="dashboard-main-content">
        {children}
      </main>

      {isModalOpen && (

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "10px",
            width: "400px"
          }}>

            <h2>Create New Case</h2>

            <form onSubmit={handleCreateCase}>

              <input
                type="text"
                placeholder="Case Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                required
              />

              <input
                type="text"
                placeholder="Case Number"
                value={formData.caseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, caseNumber: e.target.value })
                }
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                required
              />

              <textarea
                placeholder="Description"
                
                value={formData.description}
              
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              />
              <select
  value={formData.priority}
  onChange={(e)=>setFormData({...formData, priority:e.target.value})}
  style={{width:"100%",padding:"10px",marginBottom:"10px"}}
>
  <option value="High">High Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="Low">Low Priority</option>
</select>

              <div style={{ display: "flex", gap: "10px" }}>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default DashboardLayout;