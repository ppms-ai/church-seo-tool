function generateContent() {
  const url = document.getElementById('youtube-url').value;
  const results = document.getElementById('results');

  if (!url) {
    results.innerHTML = '<p>Please enter a YouTube URL.</p>';
    return;
  }

  results.innerHTML = `<p>⏳ Processing: ${url}</p>`;

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
      const content = data.result || data.message?.content || '⚠️ No content returned.';
      const preview = marked.parse(content); // Convert markdown to HTML

      results.setAttribute("data-markdown", content);
      results.setAttribute("data-html", preview);
      results.innerHTML = `
        <div id="toggle-section" style="margin-top: 1rem;">
          <p>✅ Here is your sermon content:</p>
          <div id="contentDisplay">${preview}</div>
          <div style="margin-top: 10px;">
            <button onclick="toggleView()">🔄 Toggle Markdown/Preview</button>
            <button onclick="copyToClipboard()">📋 Copy to Clipboard</button>
          </div>
        </div>
      `;
    })
    .catch(error => {
      results.innerHTML = `<p style="color:red;">❌ Error sending data: ${error.message}</p>`;
    });
}

function toggleView() {
  const results = document.getElementById("results");
  const contentDiv = document.getElementById("contentDisplay");
  const isHTML = contentDiv.innerHTML === results.getAttribute("data-html");
  contentDiv.innerHTML = isHTML
    ? `<pre>${results.getAttribute("data-markdown")}</pre>`
    : results.getAttribute("data-html");
}

function copyToClipboard() {
  const text = document.getElementById("results").getAttribute("data-markdown");
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
