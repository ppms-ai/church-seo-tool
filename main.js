function generateContent() {
  const url = document.getElementById('youtube-url').value;
  const results = document.getElementById('results');

  if (!url) {
    results.innerHTML = '<p>Please enter a YouTube URL.</p>';
    return;
  }

  results.innerHTML = `<p>Processing: ${url}</p>`;

  // Replace this with your real webhook URL
  const webhookURL = 'https://cpdphai0.rpcld.net/webhook/church-seo-submission';

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ youtube_url: url })
  })
  .then(response => response.json())
  .then(data => {
    results.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  })
  .catch(error => {
    console.error(error);
    results.innerHTML += `<p style="color:red;">Error sending data: ${error}</p>`;
  });
}
