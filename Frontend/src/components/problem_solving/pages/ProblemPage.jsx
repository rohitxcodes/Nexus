import { useState } from "react";
import { problem } from "../data/problem";

import ProblemDescription from "../comp/ProblemDescription";
import CodeEditor from "../comp/CodeEditor";
import OutputPanel from "../comp/OutputPanel";


export default function ProblemPage() {
  
  const style = {
    fontStyle:{
      fontFamily:"arial",
    }
  }
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setStatus("Running...");
    setTimeout(() => {
      setStatus("Accepted");
      setOutput("Output: [0,1]");
    }, 800);
  };

  return (
    <div className="h-screen grid grid-cols-2 w-screen" style={style.fontStyle}>
      
      {/* Left */}
      <div className="border-r border-gray-700">
        <ProblemDescription problem={problem} />
      </div>

      {/* Right */}
      <div className="flex flex-col py-0">
        <div className="p-2 flex gap-2 bg-gray-800">
          <select
            className="bg-gray-900 text-white p-1"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={runCode}
            className="bg-green-600 px-4 py-1 rounded"
          >
            Run
          </button>

          <button
            onClick={runCode}
            className="bg-blue-600 px-4 py-1 rounded"
          >
            Submit
          </button>
        </div>

        <CodeEditor language={language} setCode={setCode} />
        <OutputPanel status={status} output={output} />
      </div>
    </div>
  );
}
