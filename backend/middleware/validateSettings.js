const { z } = require("zod");

const settingsSchema = z.object({
  modelPreference: z.enum(["Gemini 2.5 Flash", "Gemini 1.5 Pro", "GPT-4o"]).optional(),
  analysisDepth: z.enum(["Standard", "Comprehensive", "Deep Scan"]).optional(),
  simulationMode: z.boolean().optional(),
});

const validateSettings = (req, res, next) => {
  const result = settingsSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ 
      message: "Invalid settings data", 
      errors: result.error.format() 
    });
  }
  
  next();
};

module.exports = validateSettings;