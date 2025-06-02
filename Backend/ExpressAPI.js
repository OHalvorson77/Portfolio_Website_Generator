const express = require('express');

const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');


const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

require("dotenv").config();
const app = express();

const cors = require("cors");
const upload = multer();


app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({apiKey:''
});


app.use(express.json());

const GITHUB_TOKEN = '';
const REPO_OWNER = 'OHalvorson77';
const REPO_NAME = 'html-previews';


app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to parse PDF");
  }
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


app.post('/deploy', async (req, res) => {
  const { html } = req.body;
  const filename = `${uuidv4()}.html`;
  const contentEncoded = Buffer.from(html).toString('base64');

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
      {
        message: `Deploy ${filename}`,
        content: contentEncoded,
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    const url = `https://${REPO_OWNER}.github.io/${REPO_NAME}/${filename}`;
    res.json({ url });
  } catch (error) {
    console.error('Error uploading to GitHub:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to deploy HTML' });
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


app.post("/api/update", async (req, res) => {
  const code =req.body.code;
  const message = req.body.message;
  console.log("Reached");

  const gptPrompt = `
You are a professional web developer AI assistant.

Based on the following code presentend, update it to fit the requested requirements. 

Here is the code:
${code}

Here is the update requirements:
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

