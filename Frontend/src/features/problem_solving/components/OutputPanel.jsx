export default function OutputPanel({ output, status }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-black text-white">
      <div className="border-b border-white/10 p-3">
        <p>
          Status: <span className="text-green-400">{status}</span>
        </p>
        <pre className="mt-2 max-h-16 overflow-y-auto text-sm">{output}</pre>
      </div>
    </div>
  );
}
