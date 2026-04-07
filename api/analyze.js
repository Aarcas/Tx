export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620', // Using the most stable model name
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    // THIS IS THE FIX: If there is an error, send the message as TEXT
    if (data.error) {
      return res.status(400).json({ 
        error: { message: data.error.message || "Unknown API Error" } 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
