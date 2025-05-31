import { useEffect, useState } from 'react';
import { updateCode } from "../api";

const PreviewPage = () => {
  const [html, setHtml] = useState('');
  const [improveText, setImproveText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedHtml = localStorage.getItem('previewHtml');
    setHtml(storedHtml || '');
  }, []);

  const handleImprove = async () => {
    let tempHtml = html;
    setHtml(null);
    setLoading(true);
    try {
      const html = await updateCode(improveText, tempHtml);
      setHtml(html);
    } catch (error) {
      alert("Error generating preview");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = () => {
    window.opener?.postMessage({ type: 'deploy' }, '*');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', position: 'relative' }}>
      {loading && html === null ? (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 10
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#666' }}>
            Loading...
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <button
          onClick={handleImprove}
          style={{
            padding: '10px',
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            height: '40px'
          }}
        >
          Improve
        </button>

        <textarea
          placeholder="Describe what to improve..."
          value={improveText}
          onChange={(e) => setImproveText(e.target.value)}
          style={{
            width: '400px',
            height: '100px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
        />

        <button
          onClick={handleDeploy}
          style={{
            padding: '10px',
            backgroundColor: 'purple',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            height: '40px'
          }}
        >
          Deploy
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
