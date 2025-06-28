export default async function handler(req, res) {
  const { videoUrl } = req.body;

  try {
    const response = await fetch("https://api.gladia.io/audio/text/audio-transcription/", {
      method: "POST",
      headers: {
        "x-gladia-key": process.env.GLADIA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: videoUrl,
        language: "english"
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
}
