export default function AiHintPopup({ isOpen, hint, status, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-yellow-300/20 bg-[#0f172a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-yellow-200">AI Hint</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-100/60">
              {status === "loading" ? "Generating" : "Ready"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 text-sm leading-6 text-yellow-50">
          {status === "loading" ? (
            <p>Generating hint...</p>
          ) : hint ? (
            <pre className="whitespace-pre-wrap font-inherit">{hint}</pre>
          ) : (
            <p>No hint available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
