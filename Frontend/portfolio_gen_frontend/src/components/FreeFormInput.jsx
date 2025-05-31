import React, { useState, useRef } from "react";
import { analyzeDescription } from "../api";
import TemplateSelector from "./TemplateSelector";
import { useNavigate } from 'react-router-dom';


export default function FreeformInput({ setStructuredData }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [template, setTemplate] = useState("classic");
  const [previewHtml, setPreviewHtml] = useState(null);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Initialize SpeechRecognition once on first start
  const initRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API not supported in this browser.");
      return null;
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

    return recognition;
  };

  const toggleListening = () => {
    if (listening) {
      // Stop if currently listening
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      // Start listening if not already started
      if (!recognitionRef.current) {
        recognitionRef.current = initRecognition();
      }
      recognitionRef.current?.start();
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setPreviewHtml(null);
    try {
      const html = await analyzeDescription(text);
      setPreviewHtml(html);
    } catch (error) {
      alert("Error generating preview");
      console.error(error);
    }
    setLoading(false);
  };

  const handlePreview = () => {
  localStorage.setItem('previewHtml', previewHtml);
  navigate('/preview');
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
          onClick={toggleListening}
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

        {previewHtml && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handlePreview}
          >
            Preview
          </button>
        )}
      </div>

      <TemplateSelector template={template} setTemplate={setTemplate} />
    </div>
  );
}
