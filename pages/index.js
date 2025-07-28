// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [embed, setEmbed] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);
    setEmbed(null);
    const res = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();
    if (data.error) setError(data.error);
    else setEmbed(data.embed);
  };

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Discord Embed Preview</h1>
      <textarea
        rows={16}
        style={{ width: '100%', fontFamily: 'monospace' }}
        placeholder="Wklej kod z EmbedBuilder..."
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleGenerate} style={{ marginTop: 10 }}>
        Generuj embed
      </button>

      {error && <pre style={{ color: 'red' }}>{error}</pre>}

      {embed && (
        <div
          style={{
            marginTop: 30,
            borderLeft: `4px solid ${embed.color ? `#${embed.color.toString(16)}` : '#2b2d31'}`,
            background: '#2f3136',
            padding: 16,
            color: 'white',
            borderRadius: 4,
            maxWidth: 600
          }}
        >
          {embed.title && <h2>{embed.title}</h2>}
          {embed.description && <p style={{ whiteSpace: 'pre-wrap' }}>{embed.description}</p>}
          {embed.fields?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {embed.fields.map((f, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <strong>{f.name}</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{f.value}</p>
                </div>
              ))}
            </div>
          )}
          {embed.image?.url && (
            <img
              src={embed.image.url}
              alt=""
              style={{ marginTop: 10, maxWidth: '100%', borderRadius: 4 }}
            />
          )}
          {embed.footer?.text && (
            <div style={{ marginTop: 10, fontSize: '0.9em', color: '#aaa' }}>
              {embed.footer.icon_url && (
                <img
                  src={embed.footer.icon_url}
                  alt=""
                  style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 6 }}
                />
              )}
              {embed.footer.text}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

