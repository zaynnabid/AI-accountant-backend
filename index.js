export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

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
}
