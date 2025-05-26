const express = require('express');
const multer = require('multer');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const simpleGit = require('simple-git');



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
