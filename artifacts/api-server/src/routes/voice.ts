import { Router, type IRouter } from "express";
import { synthesizeSpeech } from "../sarvam/tts.js";

const router: IRouter = Router();

router.post("/tts", async (req, res) => {
  try {
    const { text, languageCode = "kn-IN" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const audioBase64 = await synthesizeSpeech(text, languageCode);

    return res.json({
      audioBase64,
      mimeType: "audio/wav",
    });
  } catch (error) {
    console.error("TTS error:", error);

   return res.status(500).json({
  error: "Unable to generate speech",
  details: error instanceof Error ? error.message : String(error),
});
  }
});

export default router;