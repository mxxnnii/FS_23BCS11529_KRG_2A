const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let cards = [];
let nextId = 1;

app.post('/cards', (req, res) => {
  const { suit, rank } = req.body;
  if (!suit || !rank) return res.status(400).json({ error: 'Suit and rank are required' });
  const newCard = { id: nextId++, suit, rank };
  cards.push(newCard);
  res.status(201).json(newCard);
});

app.get('/cards', (req, res) => {
  res.json(cards);
});

app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

app.put('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Card not found' });
  const { suit, rank } = req.body;
  if (!suit || !rank) return res.status(400).json({ error: 'Suit and rank are required' });
  cards[index] = { id, suit, rank };
  res.json(cards[index]);
});

app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Card not found' });
  cards.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
