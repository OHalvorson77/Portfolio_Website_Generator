import React, { useState } from "react";
import Result from "../components/Result";
import FreeformInput from "../components/FreeFormInput"; // 👈 Import it

function Home() {
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
    <div className="app-container">
      <h1 className="app-title">Portfolio Website Generator</h1>

      {/* 👇 Freeform AI Assistant */}
      <FreeformInput setStructuredData={handleStructuredData} />

      {/* 👇 Deployment result */}
      {deployedURL && <Result url={deployedURL} />}
    </div>
  );
}

export default Home;
