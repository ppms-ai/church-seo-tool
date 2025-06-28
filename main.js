function generateContent() {
  const url = document.getElementById('youtube-url').value;
  const results = document.getElementById('results');

  if (!url) {
    results.innerHTML = '<p>Please enter a YouTube URL.</p>';
    return;
  }

  results.innerHTML = `<p>Processing: ${url}</p>`;

  fetch('https://cpdphai0.rpcld.net/webhook/church-seo-submission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ youtubeUrl: url })
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      results.innerHTML = `<p>✅ Success! Here's what came back:</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch(error => {
      results.innerHTML = `<p style="color:red;">❌ Error sending data: ${error.message}</p>`;
    });
}
