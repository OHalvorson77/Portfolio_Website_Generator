import React, { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";
import FreeformInput from "./components/FreeFormInput"; // 👈 Import it
import { generateSite } from "./api";

function App() {
  const [formData, setFormData] = useState({});
  const [deployedURL, setDeployedURL] = useState(null);

  // 👇 Merge AI-generated data with existing form data
  const handleStructuredData = (structured) => {
    setFormData((prev) => ({
      ...prev,
      ...structured,
    }));
  };

  

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portfolio Website Generator</h1>

      {/* 👇 Freeform AI Assistant */}
      <FreeformInput setStructuredData={handleStructuredData} />

      




      {/* 👇 Deployment result */}
      {deployedURL && <Result url={deployedURL} />}
    </div>
  );
}

export default App;
