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

const openai = new OpenAI(
});





app.post('/generate', async (req, res) => {
  
  const { siteData, template } = req.body;
  const {name, bio, skills, projects, education, experience}=siteData;


  
  const templateDir = path.join(__dirname, 'templates', template);
  const outputDir = path.join(__dirname, 'output', 'test');

  await fs.copy(templateDir, outputDir);

  const templateHtml = await fs.readFile(path.join(outputDir, 'index.html'), 'utf-8');
  const compiled = handlebars.compile(templateHtml);
  const rendered = compiled(siteData);

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
  console.log("Reached");

  const gptPrompt = `
You are a professional web developer AI assistant.

Based on the following description of a person's background, generate a full, standalone HTML file and very themed with lots of colours and animations for their portfolio website. 
The site must include modern, responsive design, good visual hierarchy, and embedded CSS and javascript (no external stylesheets or js files).
Use semantic HTML5 and apply styling with <style> tags.
Ensure the site includes:
- Header with name and bio
- Section for skills (as badges or list)
- Section for projects (title, description, link)
- Section for education
- Section for experience
- A clean footer

Here is the description:
${message}

Return ONLY the full HTML (starting with <!DOCTYPE html> and including all <html>, <head>, <style>, and <body> content).
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates full HTML portfolio websites based on user descriptions."
        },
        {
          role: "user",
          content: gptPrompt
        }
      ]
    });

    const htmlOutput = completion.choices[0].message.content;
    console.log(htmlOutput);

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlOutput);

  } catch (err) {
    console.error("Error calling OpenAI:", err);
    res.status(500).send("Error generating portfolio site");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

