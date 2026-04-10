export default async function handler(req, res) {
  // CORS headers to allow requests from different domains
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle pre-flight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle non-POST requests with a simple status
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'API is running!' });
  }

  // Try processing the incoming POST request
  try {
    const { message } = req.body;

    // Log the incoming message for debugging
    console.log('Received message:', message);

    // Call the Groq API to get a response
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY  // Use your Groq API key
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',  // Specify the model
        messages: [
          { role: 'system', content: 'You are a professional AI accountant. Help users with taxes, invoices, expenses and bookkeeping. Be clear and professional.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1024
      })
    });

    // Check if the Groq API response was successful
    if (!response.ok) {
      throw new Error('Groq API call failed');
    }

    const data = await response.json();

    // Check if 'choices' exists and has a valid response
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(200).json({ reply: 'Sorry I could not process that. Please try again.' });
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error('Error processing request:', err);
    return res.status(200).json({ reply: 'Sorry I could not process that. Please try again.' });
  }
}
