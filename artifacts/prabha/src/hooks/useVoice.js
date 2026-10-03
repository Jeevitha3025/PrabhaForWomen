import { useCallback, useMemo, useState } from "react";
import { getSpeechAudio } from "../services/api";

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const isSupported = useMemo(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window), []);
  const startListening = useCallback((lang, onResult) => {
    if (!isSupported) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN";
    recognition.onresult = (event) => onResult(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }, [isSupported]);
  const stopListening = useCallback(() => setIsListening(false), []);
  const speak = useCallback(async (text, lang) => {
  try {
    const data = await getSpeechAudio(text, lang);

    const binaryString = window.atob(data.audioBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes], {
      type: data.mimeType || "audio/wav",
    });

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();
  } catch (error) {
    console.error("Sarvam speech playback error:", error);
  }
}, []);
  return { startListening, stopListening, speak, isListening, isSupported };
}