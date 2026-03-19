import React from "react";
import { useParams } from "react-router-dom";

const steps = [
  "Case Created",
  "Registered",
  "Docs Uploaded",
  "Proof Added",
  "Judgement",
  "Case Closed",
];

function CaseDetailsPage() {
  const { id } = useParams();
  console.log(id); // fix warning

  const currentStep = 0; // only created

  return (
    <div style={styles.container}>
      <h2>Case Timeline</h2>

      <div style={styles.timeline}>
        {steps.map((step, index) => (
          <div key={index} style={styles.row}>
            
            {/* LEFT LINE */}
            <div style={styles.left}>
              <div
                style={{
                  ...styles.circle,
                  backgroundColor:
                    index <= currentStep ? "#00d4ff" : "#374151",
                }}
              />
              {index !== steps.length - 1 && (
                <div
                  style={{
                    ...styles.line,
                    backgroundColor:
                      index < currentStep ? "#00d4ff" : "#374151",
                  }}
                />
              )}
            </div>

            {/* RIGHT CARD */}
            <div style={styles.card}>
              {step}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  timeline: {
    marginTop: "40px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
  },
  left: {
    width: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  circle: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
  },
  line: {
    width: "2px",
    height: "40px",
    marginTop: "5px",
  },
  card: {
    background: "#1f2937",
    padding: "15px 20px",
    borderRadius: "10px",
    marginLeft: "20px",
    minWidth: "250px",
  },
};

export default CaseDetailsPage;