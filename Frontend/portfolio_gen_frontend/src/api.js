export async function generateSite(payload, template) {
  const res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({siteData: payload, template:template}),
  });
  return await res.json();
}

export async function analyzeDescription(text) {
  const res = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  const html = await res.text();
  
  console.log(html); // not JSON anymore
  return html;
}

export async function updateCode(text, code) {
  const res = await fetch("http://localhost:3000/api/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, code:code }),
  });

  const html = await res.text();
  
  console.log(html); // not JSON anymore
  return html;
}

// POST /upload-resume
export async function uploadResumePdf(formData) {
  const response = await fetch("http://localhost:3000/upload-resume", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Upload failed");
  return await response.json(); // should return: { text: "Extracted text" }
}



