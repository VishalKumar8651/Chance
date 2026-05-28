// Render entry — API + static frontend. Not exported (Vercel uses api/ + public/ only).
const path = require('path');
const express = require('express');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const publicDir = path.join(__dirname, 'public');

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
app.use(express.static(publicDir));

app.ready
  .then(() => {
    if (app.getInitError()) {
      process.exit(1);
    }
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(() => process.exit(1));
