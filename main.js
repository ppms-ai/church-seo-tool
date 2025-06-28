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
  const content = data.message.content;

  const preview = marked.parse(content); // Requires marked.js
  const results = document.getElementById("results");
  const toggle = document.getElementById("toggle-section");

  // Set both versions
  results.setAttribute("data-markdown", content);
  results.setAttribute("data-html", preview);
  results.innerHTML = preview;

  toggle.style.display = "block";
})
    .catch(error => {
      results.innerHTML = `<p style="color:red;">❌ Error sending data: ${error.message}</p>`;
    });
}
function toggleView() {
  const results = document.getElementById("results");
  const isHTML = results.innerHTML === results.getAttribute("data-html");
  results.innerHTML = isHTML ? `<pre>${results.getAttribute("data-markdown")}</pre>` : results.getAttribute("data-html");
}

function copyToClipboard() {
  const text = document.getElementById("results").getAttribute("data-markdown");
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
