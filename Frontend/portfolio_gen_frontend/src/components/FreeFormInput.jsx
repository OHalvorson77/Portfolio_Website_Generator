import React, { useState, useRef } from "react";
import { analyzeDescription } from "../api";

export default function FreeformInput({ setStructuredData }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeDescription(text);
    setStructuredData(result);
    setLoading(false);
  };

  return (
    <div className="my-6">
      <label className="font-semibold text-lg mb-1 block">Describe yourself:</label>
      <textarea
        className="w-full p-3 border rounded"
        placeholder="Talk about your background, skills, experience..."
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded text-white ${
            listening ? "bg-red-600" : "bg-indigo-600"
          }`}
        >
          {listening ? "Stop Recording" : "🎤 Start Talking"}
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Generate with AI"}
        </button>
      </div>
    </div>
  );
}
