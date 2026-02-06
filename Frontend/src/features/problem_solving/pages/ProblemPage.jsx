import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import { getProblem } from "../api/problemAPI";

export default function ProblemPage() {
  const { levelNumber } = useParams();

  console.log("param:", levelNumber);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");

  // ONLY fetching logic fixed (layout untouched)
  useEffect(() => {
    if (!levelNumber) return;

    const loadProblem = async () => {
      try {
        const data = await getProblem(levelNumber);

        // backend returns { problem: {...} }
        setProblem(data.problem);
        console.log("RAW API RESPONSE:", data);
        console.log("ACTUAL PROBLEM:", data.problem);
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
    };

    loadProblem();
  }, [levelNumber]);

  const runCode = () => {
    setStatus("Running...");

    setTimeout(() => {
      setStatus("Accepted");
      setOutput("Output: [0,1]");
    }, 800);
  };

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-screen grid grid-cols-2 w-screen">
      <div className="border-r border-gray-700">
        <ProblemDescription problem={problem} />
      </div>

      <div className="flex flex-col py-0 h-full min-h-0">
        <div className="p-2 flex gap-2 bg-gray-800">
          <select
            className="bg-gray-900 text-white p-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button onClick={runCode} className="bg-green-600 px-4 py-1 rounded">
            Run
          </button>

          <button onClick={runCode} className="bg-blue-600 px-4 py-1 rounded">
            Submit
          </button>
        </div>

        <CodeEditor language={language} problem={problem} setCode={setCode} />

        <OutputPanel status={status} output={output} />
      </div>
    </div>
  );
}
