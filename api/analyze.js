export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // We are switching to gemini-1.5-flash which has a much more stable free tier
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
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
    } else if (data.error) {
      // This will help us see if it's STILL a quota issue
      res.status(429).json({ error: "Google Quota Error: " + data.error.message });
    } else {
      res.status(500).json({ error: "Unknown Gemini Response Format" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
