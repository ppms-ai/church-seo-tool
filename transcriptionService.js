const GLADIA_API_KEY = process.env.GLADIA_API_KEY;

export async function transcribeAudio(audioUrl) {
  const response = await fetch('https://api.gladia.io/audio/text/audio-transcription/', {
    method: 'POST',
    headers: {
      'x-gladia-key': GLADIA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });

  const data = await response.json();
  return data;
}
