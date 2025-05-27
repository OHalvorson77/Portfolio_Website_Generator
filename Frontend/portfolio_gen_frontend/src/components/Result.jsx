export default function Result({ url }) {
  return (
    <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
      <p>🎉 Your site is ready:</p>
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
        {url}
      </a>
    </div>
  );
}
