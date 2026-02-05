export default function OutputPanel({ output, status }) {
  return (
    <div className="bg-black text-white p-3 h-32" >
      <p>Status: <span className="text-green-400">{status}</span></p>
      <pre className="mt-2 text-sm">{output}</pre>
    </div>
  );
}
