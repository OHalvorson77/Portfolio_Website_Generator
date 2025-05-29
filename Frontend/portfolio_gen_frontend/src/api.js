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
  return await res.json();
}

