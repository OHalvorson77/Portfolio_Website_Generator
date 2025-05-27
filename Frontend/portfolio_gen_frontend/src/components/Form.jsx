import React, { useState } from "react";

export default function Form({ setFormData }) {
  const [localData, setLocalData] = useState({
    name: "",
    bio: "",
    email: "",
    skills: "",
    projects: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = () => {
    // Parse projects and skills from strings to arrays
    const formatted = {
      ...localData,
      skills: localData.skills.split(",").map((s) => s.trim()),
      projects: localData.projects.split("\n").map((line) => {
        const [title, description, link] = line.split("|").map((s) => s.trim());
        return { title, description, link };
      }),
    };
    setFormData(formatted);
  };

  return (
    <div onBlur={handleBlur}>
      <input type="text" name="name" placeholder="Your Name" value={localData.name} onChange={handleChange} className="w-full p-2 mb-2 border" />
      <textarea name="bio" placeholder="Short bio" value={localData.bio} onChange={handleChange} className="w-full p-2 mb-2 border" />
      <input type="email" name="email" placeholder="Email" value={localData.email} onChange={handleChange} className="w-full p-2 mb-2 border" />
      <input type="text" name="skills" placeholder="Skills (comma-separated)" value={localData.skills} onChange={handleChange} className="w-full p-2 mb-2 border" />
      <textarea name="projects" placeholder="Projects (title | description | link per line)" value={localData.projects} onChange={handleChange} className="w-full p-2 mb-2 border" />
    </div>
  );
}
