function generateContent() {
  const url = document.getElementById('youtube-url').value;
  const results = document.getElementById('results');

  if (!url) {
    results.innerHTML = '<p>Please enter a YouTube URL.</p>';
    return;
  }

  results.innerHTML = `<p>Processing: ${url}</p><p>(This is where your AI-generated content will go!)</p>`;

  // ✨ We'll plug in the webhook fetch code here next
}
