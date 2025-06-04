const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const rankingFile = path.join(__dirname, 'ranking.json');

app.use(express.static(__dirname));
app.use(express.json());

app.get('/ranking', (req, res) => {
  fs.readFile(rankingFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json([]);
    let ranking = [];
    try { ranking = JSON.parse(data); } catch {}
    res.json(ranking);
  });
});

app.post('/ranking', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).send('Invalid data');
  }
  fs.readFile(rankingFile, 'utf8', (err, data) => {
    let ranking = [];
    if (!err) {
      try { ranking = JSON.parse(data); } catch {}
    }
    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    fs.writeFile(rankingFile, JSON.stringify(ranking, null, 2), err => {
      if (err) return res.status(500).send('Failed to save');
      res.json(ranking);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
