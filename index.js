const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/chat', async (req, res) => {
  const { message, imageData, imageType } = req.body;
  
  const content = [];
  if (imageData) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: imageType, data: imageData }
    });
  }
  content.push({ type: 'text', text: message || 'Analyze this.' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: 'You are a professional AI accountant. Help users with taxes, invoices, expenses and bookkeeping. Be clear and professional.',
      messages: [{ role: 'user', content }]
    })
  });

  const data = await response.json();
  res.json({ reply: data.content[0].text });
});

app.listen(3000, () => console.log('Running!'));
