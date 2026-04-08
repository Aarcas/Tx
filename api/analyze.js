export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Gemini returns data in 'candidates' instead of 'content'
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiResponse });
    } else {
      res.status(500).json({ error: "Gemini Error: " + JSON.stringify(data) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
