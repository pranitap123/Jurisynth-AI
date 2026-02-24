const Case = require("../models/Case");
const fs = require("fs");
const pdf = require("pdf-parse");

const apiKey = ""; // Provided by environment
const MODEL_ID = "gemini-2.5-flash-preview-09-2025";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

exports.generateSummary = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId);

    if (!caseData || caseData.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Case not found or unauthorized" });
    }

    if (!caseData.documents || caseData.documents.length === 0) {
      return res.status(400).json({ message: "No documents found. Please upload evidence first." });
    }

    let combinedText = `Case Title: ${caseData.title}\nDescription: ${caseData.description}\n\n`;

    for (const doc of caseData.documents) {
      try {
        const dataBuffer = fs.readFileSync(doc.path);
        if (doc.filename.toLowerCase().endsWith(".pdf")) {
          const pdfData = await pdf(dataBuffer);
          combinedText += `--- Content from ${doc.filename} ---\n${pdfData.text}\n\n`;
        } else {
          combinedText += `--- Content from ${doc.filename} ---\n${dataBuffer.toString()}\n\n`;
        }
      } catch (err) {
        console.error(`Error reading ${doc.filename}:`, err);
      }
    }

    const systemPrompt = "You are a senior legal analyst. Summarize the provided documents into a JSON object with two keys: 'summary' (professional paragraph) and 'keyPoints' (array of 5 strings).";

    const payload = {
      contents: [{ parts: [{ text: `Analyze these documents:\n\n${combinedText}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            keyPoints: { type: "ARRAY", items: { type: "STRING" } }
          }
        }
      }
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "AI Analysis Failed");

    const aiOutput = JSON.parse(result.candidates[0].content.parts[0].text);

    caseData.aiSummary = aiOutput.summary;
    caseData.keyPoints = aiOutput.keyPoints;
    caseData.status = "ready";
    await caseData.save();

    res.status(200).json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSummaryByCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    res.json({ summary: caseData.aiSummary, keyPoints: caseData.keyPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};