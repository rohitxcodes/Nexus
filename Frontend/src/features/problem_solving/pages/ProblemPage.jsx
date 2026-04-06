import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createSubmission, getSubmissionResult } from "../api/submissionAPI";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import { getProblem } from "../api/problemAPI";
import SuccessPopup from "../components/SuccessPopup";
import { API_BASE } from "../../../utils/api";

export default function ProblemPage() {
  const { levelNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [xpData, setXpData] = useState({ xpEarned: 0, totalXp: 0 });
  const [judgeStats, setJudgeStats] = useState({ runtime: null, memory: null });
  const [showLevelEntryPopup, setShowLevelEntryPopup] = useState(false);
  const [shopItemCounts, setShopItemCounts] = useState({
    hint: 0,
    debug: 0,
    doubleXp: 0,
    skip: 0,
  });
  const [popupSelectedKeys, setPopupSelectedKeys] = useState([]);
  const [activeShopItems, setActiveShopItems] = useState([]);

  const shopItems = [
    {
      key: "hint",
      label: "AI Hint",
      description: "Use guided hint support during this level.",
    },
    {
      key: "debug",
      label: "AI Debugging",
      description: "Use debugging assistance for your code.",
    },
    {
      key: "doubleXp",
      label: "Double XP",
      description: "Activate XP booster for this run.",
    },
    {
      key: "skip",
      label: "Skip Level",
      description: "Enable level skip power for this stage.",
    },
  ];

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

  useEffect(() => {
    const loadLevelPopupData = async () => {
      if (!problem) return;

      try {
        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const meData = await meRes.json();
        if (!meRes.ok) {
          throw new Error(meData?.message || "Failed to load user data");
        }

        const purchasesForLevel =
          meData?.user?.purchases?.[String(levelNumber)] || {};

        const counts = {
          hint: Number(purchasesForLevel.hint || 0),
          debug: Number(purchasesForLevel.debug || 0),
          doubleXp: Number(purchasesForLevel.doubleXp || 0),
          skip: Number(purchasesForLevel.skip || 0),
        };

        setShopItemCounts(counts);

        const incomingSelected = Array.isArray(
          location.state?.selectedShopItems,
        )
          ? location.state.selectedShopItems
          : [];

        const selectedKeysFromIncoming = incomingSelected
          .map((item) => {
            const found = shopItems.find(
              (shopItem) =>
                shopItem.label.toLowerCase() === String(item).toLowerCase() ||
                shopItem.key === String(item),
            );
            return found?.key;
          })
          .filter(Boolean)
          .filter((itemKey) => counts[itemKey] > 0);

        setPopupSelectedKeys(selectedKeysFromIncoming);
      } catch {
        setShopItemCounts({ hint: 0, debug: 0, doubleXp: 0, skip: 0 });
        setPopupSelectedKeys([]);
      }

      setActiveShopItems([]);
      setShowLevelEntryPopup(true);
    };

    loadLevelPopupData();
  }, [problem, levelNumber]);

  const togglePopupItem = (itemKey) => {
    if (Number(shopItemCounts[itemKey] || 0) <= 0) return;

    setPopupSelectedKeys((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey],
    );
  };

  const handleStartLevelFromPopup = () => {
    const selectedItems = popupSelectedKeys
      .map((itemKey) => shopItems.find((item) => item.key === itemKey))
      .filter(Boolean);
    setActiveShopItems(selectedItems);
    setShowLevelEntryPopup(false);
  };

  const runCode = async (isSubmit = false) => {
    try {
      setStatus("Submitting...");
      setOutput("");
      console.log("1. Starting code submission...");

      const submissionResponse = await createSubmission({
        levelNumber: Number(levelNumber),
        language,
        code,
        isSubmit,
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
        `Runtime: ${result.runtime || "-"}s | Memory: ${result.memory || "-"} KB`,
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
    <>
      <div className="h-screen grid grid-cols-2 w-screen">
        <div className="border-r border-gray-700">
          <ProblemDescription problem={problem} />
          {activeShopItems.length ? (
            <div className="mx-4 mb-4 rounded-lg border border-yellow-300/40 bg-yellow-100/10 p-3 text-sm text-yellow-100">
              <p className="font-semibold">Active Shop Powers</p>
              <p className="mt-1">
                {activeShopItems.map((item) => item.label).join(", ")}
              </p>
            </div>
          ) : null}
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

      {showLevelEntryPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Level {levelNumber}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose which powers to activate for this game.
            </p>

            <div className="mt-4 space-y-3">
              {shopItems.map((item) => {
                const ownedCount = Number(shopItemCounts[item.key] || 0);
                const active = popupSelectedKeys.includes(item.key);
                const canUse = ownedCount > 0;

                return (
                  <div
                    key={item.key}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          Owned:{" "}
                          <span className="font-semibold">{ownedCount}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePopupItem(item.key)}
                        disabled={!canUse}
                        className={`rounded-md px-3 py-2 text-sm font-semibold ${
                          !canUse
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : active
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : "bg-blue-600 text-white hover:bg-blue-500"
                        }`}
                      >
                        {!canUse
                          ? "Not Owned"
                          : active
                            ? "Activated"
                            : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setShowLevelEntryPopup(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                onClick={handleStartLevelFromPopup}
              >
                Start Level
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
