import { useEffect, useState } from 'react';

const PreviewPage = () => {
  const [html, setHtml] = useState('');
  const [improveText, setImproveText] = useState('');

  useEffect(() => {
    const storedHtml = localStorage.getItem('previewHtml');
    setHtml(storedHtml || '');
  }, []);

  const handleImprove = () => {
    // Send the custom improveText to the parent window
    window.opener?.postMessage({ type: 'improve', text: improveText }, '*');
  };

  const handleDeploy = () => {
    window.opener?.postMessage({ type: 'deploy' }, '*');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <button
          onClick={handleImprove}
          style={{ padding: '10px', backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', height: '40px' }}
        >
          Improve
        </button>

        <textarea
          placeholder="Describe what to improve..."
          value={improveText}
          onChange={(e) => setImproveText(e.target.value)}
          style={{ width: '400px', height: '100px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
        />

        <button
          onClick={handleDeploy}
          style={{ padding: '10px', backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px', height: '40px' }}
        >
          Deploy
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
