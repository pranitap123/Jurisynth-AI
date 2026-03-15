const Case = require("../models/Case");
const User = require("../models/User");
const fs = require("fs");
const pdfParse = require("pdf-parse"); 
const mammoth = require("mammoth"); 

const apiKey = process.env.GEMINI_API_KEY;

exports.generateSummary = async (req, res) => {
  console.log(">>> Pipeline Started for Case:", req.params.caseId);
  try {
    const { caseId } = req.params;
    
    const [caseData, userData] = await Promise.all([
      Case.findById(caseId),
      User.findById(req.user.id)
    ]);

    if (!caseData || caseData.user.toString() !== req.user.id) {
      console.error(">>> Unauthorized or Case Not Found");
      return res.status(404).json({ message: "Case not found or unauthorized" });
    }

     const selectedModel = userData.aiSettings?.modelPreference === "Gemini 1.5 Pro"
      ? "gemini-2.5-pro"
      : "gemini-2.5-flash"; 

 const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;    
    console.log(">>> Initiating secure AI analysis request...");

    if (!caseData.documents || caseData.documents.length === 0) {
      return res.status(400).json({ message: "No documents found. Please upload evidence first." });
    }

    let combinedText = `Case Title: ${caseData.title}\nDescription: ${caseData.description}\n\n`;

    for (const doc of caseData.documents) {
      try {
        const dataBuffer = fs.readFileSync(doc.path);
        
        if (doc.filename.toLowerCase().endsWith(".pdf")) {
          const pdfData = await pdfParse(dataBuffer);
          combinedText += `--- Content from ${doc.filename} ---\n${pdfData.text}\n\n`;
        } 
        else if (doc.filename.toLowerCase().endsWith(".docx")) {
          const docxData = await mammoth.extractRawText({ path: doc.path });
          combinedText += `--- Content from ${doc.filename} ---\n${docxData.value}\n\n`;
        } 
        else {
          combinedText += `--- Content from ${doc.filename} ---\n${dataBuffer.toString()}\n\n`;
        }
      } catch (err) {
        console.error(`Error reading ${doc.filename}:`, err.message);
      }
    }

    const safetyLimit = 25000;
    const truncatedText = combinedText.length > safetyLimit 
      ? combinedText.substring(0, safetyLimit) + "... [Text Truncated for Analysis]" 
      : combinedText;

    console.log(">>> Document Text Extracted. Length:", truncatedText.length);

    const systemPrompt = "You are a senior legal analyst. Summarize the provided documents into a JSON object with two keys: 'summary' (professional paragraph) and 'keyPoints' (array of 5 strings).";

    const payload = {
      contents: [{ parts: [{ text: `Analyze these legal documents and provide insights:\n\n${truncatedText}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(">>> Gemini Raw Response received");

    if (!response.ok) {
      console.error(">>> Gemini API Error:", result.error);
      throw new Error(result.error?.message || "AI Analysis Failed");
    }

    let rawOutput = result.candidates[0].content.parts[0].text;
    
    rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    const aiOutput = JSON.parse(rawOutput);
    console.log(">>> Successfully parsed AI JSON");

    caseData.aiSummary = aiOutput.summary;
    caseData.keyPoints = aiOutput.keyPoints;
    caseData.status = "ready"; 
    await caseData.save();

    console.log(">>> Pipeline Complete. DB Updated.");
    res.status(200).json(caseData);

  } catch (error) {
    console.error("!!! CRITICAL PIPELINE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getSummaryByCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    if (caseData.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json({ 
      summary: caseData.aiSummary, 
      keyPoints: caseData.keyPoints,
      status: caseData.status 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};