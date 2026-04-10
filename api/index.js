export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'API is running!' });
  }

  try {
    const { message } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a professional AI accountant. Help users with taxes, invoices, expenses and bookkeeping. Be clear and professional.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1024
      })
    });
    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    return res.status(200).json({ reply: 'Sorry I could not process that. Please try again.' });
  }
}
