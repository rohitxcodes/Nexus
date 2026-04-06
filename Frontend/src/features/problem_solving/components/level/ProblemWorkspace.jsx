import { useEffect, useState } from "react";
import CodeEditor from "../CodeEditor";
import OutputPanel from "../OutputPanel";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function ProblemWorkspace({
  language,
  setLanguage,
  problem,
  code,
  setCode,
  status,
  output,
  isHintActive,
  editorHeight,
  workspaceRef,
  onEditorResizeStart,
  onRun,
  onSubmit,
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ];

    if (hours > 0) {
      parts.unshift(hours.toString().padStart(2, "0"));
    }

    return parts.join(":");
  };

  return (
    <div
      ref={workspaceRef}
      className="flex h-full min-h-0 flex-1 min-w-0 flex-col overflow-hidden py-0"
    >
      <div className="relative flex items-center justify-between gap-3 bg-gray-800 p-2">
        <div className="flex items-center gap-2">
          <select
            className="bg-gray-900 p-1 text-white"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={onRun}
            className="rounded bg-green-600 px-4 py-1 hover:bg-green-700"
          >
            Run
          </button>

          <button
            onClick={onSubmit}
            className="rounded bg-blue-600 px-4 py-1 hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 flex translate-x-0 -translate-y-1/2 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-white">
          <span className="min-w-19 font-mono text-sm tracking-wide text-green-300">
            {formatTime(elapsedSeconds)}
          </span>

          <button
            type="button"
            onClick={() => setIsRunning(true)}
            className="rounded-md p-1.5 text-green-300 hover:bg-white/10"
            aria-label="Start timer"
          >
            <Play size={16} fill="currentColor" />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(false)}
            className="rounded-md p-1.5 text-yellow-300 hover:bg-white/10"
            aria-label="Pause timer"
          >
            <Pause size={16} fill="currentColor" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setElapsedSeconds(0);
            }}
            className="rounded-md p-1.5 text-red-300 hover:bg-white/10"
            aria-label="Reset timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden min-w-0">
        <div
          className="min-h-55 w-full overflow-hidden"
          style={{ flex: `0 0 ${editorHeight}%` }}
        >
          <CodeEditor
            language={language}
            problem={problem}
            code={code}
            setCode={setCode}
          />
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          onMouseDown={onEditorResizeStart}
          className="h-1 cursor-row-resize bg-gray-700/70 hover:bg-blue-500"
        />

        <div className="min-h-0 flex-1 overflow-hidden w-full">
          <OutputPanel status={status} output={output} />
        </div>
      </div>
    </div>
  );
}
