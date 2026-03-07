// backend/utils/promptBuilder.js

const buildLegalPrompt = (documentText, settings) => {
  const basePrompt = `You are a senior legal analyst. Analyze the following legal documents:\n\n${documentText}\n\n`;

  const depthInstructions = {
    "Standard": "Provide a concise 3-paragraph executive summary of the core legal issue.",
    "Comprehensive": "Extract a timeline of events, list all participating parties, and summarize the primary legal arguments.",
    "Deep Scan": "Perform a critical analysis. Identify potential contradictions in witness testimony, highlight missing evidence, and suggest 3 follow-up questions for cross-examination."
  };

  const instruction = depthInstructions[settings.analysisDepth] || depthInstructions["Standard"];
  
  return `${basePrompt} TASK: ${instruction} Output MUST be a JSON object with keys: 'summary' (string) and 'keyPoints' (array of 5 strings).`;
};

// CRITICAL: Must be exported like this
module.exports = buildLegalPrompt;