export default function TemplateSelector({ template, setTemplate }) {
  return (
    <div className="mt-4">
      <label>Select a Template:</label>
      <select
        className="block mt-1 p-2 border"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
      >
        <option value="classic">Classic Resume</option>
        <option value="modern-cards">Modern Cards</option>
        <option value="sidebar">Sidebar Layout</option>
        <option value="minimal">Minimalist</option>
        <option value="dark-dev">Dark Dev</option>
      </select>
    </div>
  );
}
