import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('');

  const BACKEND_URL = 'https://qwertytrewq98798.idontwannabedoxxedplsandthx.workers.dev';

  const handleFetch = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setContent('');
    setContentType('');

    try {
      const response = await fetch(`${BACKEND_URL}?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error ${response.status}: ${errorText}`);
        setLoading(false);
        return;
      }

      const contentTypeHeader = response.headers.get('content-type') || '';
      setContentType(contentTypeHeader);

      if (contentTypeHeader.includes('text/html')) {
        const html = await response.text();
        setContent(html);
      } else if (contentTypeHeader.includes('application/json')) {
        const json = await response.json();
        setContent(JSON.stringify(json, null, 2));
      } else if (contentTypeHeader.includes('text')) {
        const text = await response.text();
        setContent(text);
      } else {
        setContent('[Binary content - cannot display in browser]');
      }
    } catch (err) {
      setError(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Fetch Proxy</h1>
        <p className="subtitle">Fetch any website through your proxy backend</p>

        <form onSubmit={handleFetch}>
          <div className="input-group">
            <input
              type="url"
              placeholder="Enter a URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        {content && (
          <div className="result">
            <div className="result-header">
              <h2>Result</h2>
              <span className="content-type">{contentType || 'Unknown'}</span>
            </div>
            {contentType.includes('text/html') ? (
              <iframe
                title="result"
                srcDoc={content}
                className="iframe-preview"
              />
            ) : (
              <pre className="content-preview">{content}</pre>
            )}
          </div>
        )}

        {!content && !error && !loading && (
          <div className="empty-state">
            <p>Enter a URL and click "Fetch" to see the content</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
