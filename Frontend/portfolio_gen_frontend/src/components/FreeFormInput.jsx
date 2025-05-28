import React, { useState } from "react";
import { analyzeDescription } from "../api";

export default function FreeformInput({ setStructuredData }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeDescription(text);
    setStructuredData(result);
    setLoading(false);
  };

  return (
    <div className="my-6">
      <textarea
        className="w-full p-3 border rounded"
        placeholder="Tell us about yourself..."
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Generate Portfolio Data with AI"}
      </button>
    </div>
  );
}
