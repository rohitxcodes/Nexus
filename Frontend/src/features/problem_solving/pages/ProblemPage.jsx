import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSubmission, getSubmissionResult } from "../api/submissionAPI";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import { getProblem } from "../api/problemAPI";
import SuccessPopup from "../components/SuccessPopup";
import { API_BASE } from "../../../utils/api";

export default function ProblemPage() {
  const { levelNumber } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [xpData, setXpData] = useState({ xpEarned: 0, totalXp: 0 });
  const [judgeStats, setJudgeStats] = useState({ runtime: null, memory: null });

  
  useEffect(() => {
    const loadProblem = async () => {
      try {
        const data = await getProblem(levelNumber);
        setProblem(data.problem);
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
    };
    
    if (levelNumber) {
      loadProblem();
    }
  }, [levelNumber]);

  const runCode = async (isSubmit = false) => {
  try {
    setStatus("Submitting...");
    setOutput("");
    console.log("1. Starting code submission...");

    
    const submissionResponse = await createSubmission({
      levelNumber: Number(levelNumber),
      language,
      code,
      isSubmit
    });
    console.log("2. Submission response:", submissionResponse);
    
    const submissionId = submissionResponse.submissionId;
    console.log("3. Submission ID:", submissionId);

    if (!submissionId) {
      throw new Error("No submission ID received");
    }

    setStatus("Running on judge...");
    console.log("4. Getting submission result...");
    
  
    const result = await getSubmissionResult(submissionId);
    console.log("5. Raw submission result:", result);
    
    if (!result) {
      throw new Error("No result returned from the server");
    }

  
    const statusText = result.status || "Unknown Status";
    const isAccepted = statusText === "ACCEPTED";
    
    console.log("6. Status:", statusText);
    
   
    setStatus(statusText);
    setOutput(
      `Runtime: ${result.runtime || "-"}s | Memory: ${result.memory || "-"} KB`
    );

    setJudgeStats({
      runtime: result.runtime ?? null,
      memory: result.memory ?? null,
    });

    
    if (isSubmit && isAccepted) {
      const difficultyRewardMap = {
        Easy: 30,
        Medium: 40,
        Hard: 60,
      };

      const fallbackXp = difficultyRewardMap[problem?.difficulty] ?? 30;

      const xpEarned = Number.isFinite(submissionResponse?.xpEarned)
        ? submissionResponse.xpEarned
        : fallbackXp;

      let totalXp = Number.isFinite(submissionResponse?.totalXP)
        ? submissionResponse.totalXP
        : undefined;

      if (!Number.isFinite(totalXp)) {
        try {
          const meRes = await fetch(`${API_BASE}/api/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: localStorage.getItem("token")
                ? `Bearer ${localStorage.getItem("token")}`
                : "",
            },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            const dbTotal = meData?.user?.totalXP;
            if (Number.isFinite(dbTotal)) totalXp = dbTotal;
          }
        } catch {
               //
        }
      }

      if (!Number.isFinite(totalXp)) totalXp = xpData.totalXp;

      setXpData({ xpEarned, totalXp });
      setShowSuccess(true);
    }
  } catch (err) {
    console.error("Submission error:", err);
    setStatus("ERROR");
    setOutput("Submission failed: " + (err.message || "Unknown error"));
  }
};

  const handleReplay = () => {
    window.location.reload();
  };

  const handleNextLevel = () => {
    const next = Number(levelNumber) + 1;
    if (Number.isFinite(next)) {
      setShowSuccess(false);
      navigate(`/levels/${next}`);
    }
  };

  if (!problem) {
    return <div className="p-6">Loading problem data...</div>;
  }

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

          <button 
            onClick={() => runCode(false)} 
            className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
          >
            Run
          </button>

          <button 
            onClick={() => runCode(true)} 
            className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

        <CodeEditor 
          language={language} 
          problem={problem} 
          code={code}
          setCode={setCode} 
        />

        <OutputPanel status={status} output={output} />
      </div>

      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onReplay={handleReplay}
        onNextLevel={handleNextLevel}
        levelNumber={levelNumber}
        xpEarned={xpData.xpEarned}
        totalXp={xpData.totalXp}
        runtime={judgeStats.runtime}
        memory={judgeStats.memory}
      />
    </div>
  );
}
