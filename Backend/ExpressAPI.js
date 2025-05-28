const express = require('express');
const multer = require('multer');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const simpleGit = require('simple-git');

const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

require("dotenv").config();
const app = express();

const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
});





app.post('/generate', async (req, res) => {
  const userData = req.body; // name, projects, templateChoice, etc.
  
  const templateDir = path.join(__dirname, 'templates', userData.template);
  const outputDir = path.join(__dirname, 'output', userData.username);

  await fs.copy(templateDir, outputDir);

  const templateHtml = await fs.readFile(path.join(outputDir, 'index.html'), 'utf-8');
  const compiled = handlebars.compile(templateHtml);
  const rendered = compiled(userData);

  await fs.writeFile(path.join(outputDir, 'index.html'), rendered);

  res.status(200).json({ message: 'Site generated', outputPath: outputDir });
});



app.post('/deploy/github', async (req, res) => {
  const { username, repo, token } = req.body;
  const localPath = path.join(__dirname, 'output', username);
  const git = simpleGit();

  try {
    await git.cwd(localPath);
    await git.init();
    await git.addRemote('origin', `https://${token}@github.com/${username}/${repo}.git`);
    await git.add('.');
    await git.commit('Initial portfolio site');
    await git.push(['-u', 'origin', 'main', '--force']);
    res.json({ success: true, url: `https://${username}.github.io/${repo}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/analyze", async (req, res) => {
  const message = req.body.message;

  const gptPrompt = `
Extract portfolio data from this description:
${message}

Return JSON with fields:
- name
- bio
- skills (array)
- projects (array of {title, description, link})
- education (array of {school, degree, years})
- experience (array of {title, company, duration})
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts structured data from descriptions."
        },
        {
          role: "user",
          content: gptPrompt
        }
      ]
    });

    const aiResponse = completion.choices[0].message.content;

    try {
      const parsed = JSON.parse(aiResponse);
      res.json(parsed);
    } catch (jsonErr) {
      res.send(aiResponse); // fallback if not valid JSON
    }

  } catch (err) {
    console.error("Error calling OpenAI:", err);
    res.status(500).send("Error generating portfolio data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

