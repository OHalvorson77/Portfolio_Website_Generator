import React, { useState } from "react";
import Form from "./components/Form";
import TemplateSelector from "./components/TemplateSelector";
import Result from "./components/Result";
import { generateSite } from "./api";

function App() {
  const [formData, setFormData] = useState({});
  const [template, setTemplate] = useState("classic");
  const [deployedURL, setDeployedURL] = useState(null);

  const handleSubmit = async () => {
    const result = await generateSite({ ...formData, template });
    setDeployedURL(result.url);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portfolio Website Generator</h1>
      <Form setFormData={setFormData} />
      <TemplateSelector template={template} setTemplate={setTemplate} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Generate & Deploy
      </button>
      {deployedURL && <Result url={deployedURL} />}
    </div>
  );
}

export default App;
