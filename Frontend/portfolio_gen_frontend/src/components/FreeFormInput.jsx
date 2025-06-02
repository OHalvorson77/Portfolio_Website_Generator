import React, { useState, useRef } from "react";
import { analyzeDescription, uploadResumePdf } from "../api";
import TemplateSelector from "./TemplateSelector";
import { useNavigate } from 'react-router-dom';


export default function FreeformInput({ setStructuredData }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [template, setTemplate] = useState("classic");
  const [previewHtml, setPreviewHtml] = useState(null);
  const [uploading, setUploading] = useState(false);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();


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
      recognitionRef.current?.stop();
      setListening(false);
    } else {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await uploadResumePdf(formData);
      setText(response.text);  // assuming backend returns extracted text
    } catch (error) {
      alert("Error uploading resume");
      console.error(error);
    }
    setUploading(false);
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

      <div className="flex flex-wrap gap-2 mt-2">
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

        <label className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
          📄 Upload Resume
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {uploading && <span className="text-sm text-gray-600">Uploading...</span>}

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
