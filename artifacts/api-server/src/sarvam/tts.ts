type SarvamTTSResponse = {
  request_id?: string;
  audios?: string[];
};

export async function synthesizeSpeech(
  text: string,
  languageCode = "kn-IN",
): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  if (!text.trim()) {
    throw new Error("Text is required");
  }

  if (text.length > 2500) {
    throw new Error("Text is too long for Sarvam TTS");
  }

  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
    },
    body: JSON.stringify({
      text,
      language_code: languageCode,
      speaker: "kavitha",
      model: "bulbul:v3",
      output_audio_codec: "wav",
      speech_sample_rate: 24000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Sarvam TTS error (${response.status}): ${errorText}`,
    );
  }

  const data = (await response.json()) as SarvamTTSResponse;

  if (!data.audios?.[0]) {
    throw new Error("Sarvam returned no audio");
  }

  return data.audios[0];
}