export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // We are switching to 1.5-flash which is much more reliable for free tier
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiResponse });
    } else {
      // This will show us if it's still a quota issue
      res.status(500).json({ error: "Gemini Error: " + (data.error ? data.error.message : "Empty Response") });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
