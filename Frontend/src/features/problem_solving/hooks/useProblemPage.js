import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createSubmission, getSubmissionResult } from "../api/submissionAPI";
import { getProblem } from "../api/problemAPI";
import { API_BASE } from "../../../utils/api";

export const SHOP_ITEMS = [
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

function countPurchases(purchases) {
  return Object.values(purchases || {}).reduce(
    (acc, levelBucket) => {
      if (!levelBucket || typeof levelBucket !== "object") return acc;

      acc.hint += Number(levelBucket.hint || 0);
      acc.debug += Number(levelBucket.debug || 0);
      acc.doubleXp += Number(levelBucket.doubleXp || 0);
      acc.skip += Number(levelBucket.skip || 0);
      return acc;
    },
    { hint: 0, debug: 0, doubleXp: 0, skip: 0 },
  );
}

function resolveSelectedItems(selectedItems, counts) {
  const incomingSelected = Array.isArray(selectedItems) ? selectedItems : [];

  const selectedKeysFromIncoming = incomingSelected
    .map((item) => {
      const found = SHOP_ITEMS.find(
        (shopItem) =>
          shopItem.label.toLowerCase() === String(item).toLowerCase() ||
          shopItem.key === String(item),
      );
      return found?.key;
    })
    .filter(Boolean)
    .filter((itemKey) => counts[itemKey] > 0);

  return selectedKeysFromIncoming
    .map((itemKey) => SHOP_ITEMS.find((item) => item.key === itemKey))
    .filter(Boolean);
}

export function useProblemPage() {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopItemCounts, setShopItemCounts] = useState({
    hint: 0,
    debug: 0,
    doubleXp: 0,
    skip: 0,
  });
  const [activeShopItems, setActiveShopItems] = useState([]);
  const [aiHint, setAiHint] = useState("");
  const [aiHintStatus, setAiHintStatus] = useState("idle");
  const [showAiHintPopup, setShowAiHintPopup] = useState(false);
  const [usingPower, setUsingPower] = useState(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(48);
  const [editorHeight, setEditorHeight] = useState(72);
  const [resizeMode, setResizeMode] = useState(null);
  const workspaceRef = useRef(null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const startLeftResize = () => setResizeMode("left");
  const startEditorResize = () => setResizeMode("editor");

  useEffect(() => {
    if (!resizeMode) return;

    const handleMove = (event) => {
      if (resizeMode === "left") {
        const nextWidth = (event.clientX / window.innerWidth) * 100;
        setLeftPaneWidth(clamp(nextWidth, 30, 65));
        return;
      }

      if (resizeMode === "editor") {
        const rect = workspaceRef.current?.getBoundingClientRect();
        if (!rect) return;

        const relativeY = event.clientY - rect.top;
        const nextHeight = (relativeY / rect.height) * 100;
        setEditorHeight(clamp(nextHeight, 35, 85));
      }
    };

    const handleUp = () => setResizeMode(null);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [resizeMode]);

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

        const counts = countPurchases(meData?.user?.purchases);
        setShopItemCounts(counts);
        setActiveShopItems(
          resolveSelectedItems(location.state?.selectedShopItems, counts),
        );
      } catch {
        setShopItemCounts({ hint: 0, debug: 0, doubleXp: 0, skip: 0 });
        setActiveShopItems([]);
      }

      setShowLevelEntryPopup(true);
    };

    loadLevelPopupData();
  }, [problem, levelNumber, location.state?.selectedShopItems]);

  const handleStartLevelFromPopup = () => {
    setShowLevelEntryPopup(false);
  };

  const usePower = async (itemKey) => {
    const ownedCount = Number(shopItemCounts[itemKey] || 0);
    if (ownedCount <= 0) return;

    try {
      setUsingPower(itemKey);

      const payload =
        itemKey === "hint" || itemKey === "debug" || itemKey === "skip"
          ? {
              itemKey,
              levelNumber: Number(levelNumber),
              ...(itemKey === "hint" || itemKey === "debug"
                ? {
                    codeSnippet: code,
                    language,
                    problemId: problem?._id,
                    problemTitle: problem?.title,
                    problemDescription: problem?.description,
                    constraints: problem?.constraints,
                    examples: Array.isArray(problem?.examples)
                      ? problem.examples.slice(0, 3)
                      : [],
                  }
                : {}),
            }
          : { itemKey };

      const res = await fetch(`${API_BASE}/api/shop/use`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || `Failed to use ${itemKey}`);
      }

      const remaining = Number(data?.remainingOwnedTotal);
      if (Number.isFinite(remaining)) {
        setShopItemCounts((prev) => ({ ...prev, [itemKey]: remaining }));
      } else {
        setShopItemCounts((prev) => ({
          ...prev,
          [itemKey]: Math.max(0, Number(prev[itemKey] || 0) - 1),
        }));
      }

      if (itemKey === "hint") {
        setAiHintStatus(data?.source === "fallback" ? "error" : "success");
        setAiHint(data?.hint || data?.message || "No hint returned");
        setShowAiHintPopup(true);
      } else if (itemKey === "debug") {
        setOutput(data?.debug || data?.message || "No debug feedback returned");
      } else if (itemKey === "skip") {
        const previousLevel = Number(data?.previousLevel);
        const immediateNextLevel = Number.isFinite(previousLevel)
          ? previousLevel + 1
          : NaN;
        const nextLevel = Number(data?.nextLevel);
        if (Number.isFinite(immediateNextLevel) && immediateNextLevel > 0) {
          navigate(`/levels/${immediateNextLevel}`);
        } else if (Number.isFinite(nextLevel) && nextLevel > 0) {
          navigate(`/levels/${nextLevel}`);
        } else {
          setOutput(data?.message || "Level skipped");
        }
      } else {
        setOutput(data?.message || `${itemKey} used`);
      }
    } catch (err) {
      if (itemKey === "hint") {
        setAiHintStatus("error");
        setAiHint(err?.message || "Failed to use hint");
        setShowAiHintPopup(true);
      } else {
        setOutput(err?.message || `Failed to use ${itemKey}`);
      }
    } finally {
      setUsingPower(null);
    }
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

  return {
    levelNumber,
    problem,
    language,
    setLanguage,
    code,
    setCode,
    status,
    output,
    showSuccess,
    setShowSuccess,
    xpData,
    judgeStats,
    showLevelEntryPopup,
    setShowLevelEntryPopup,
    sidebarOpen,
    setSidebarOpen,
    shopItemCounts,
    activeShopItems,
    aiHint,
    aiHintStatus,
    handleStartLevelFromPopup,
    usePower,
    runCode,
    handleReplay,
    handleNextLevel,
    isHintActive: activeShopItems.some((item) => item.key === "hint"),
    showAiHintPopup,
    setShowAiHintPopup,
    usingPower,
    shopItems: SHOP_ITEMS,
    leftPaneWidth,
    editorHeight,
    workspaceRef,
    startLeftResize,
    startEditorResize,
  };
}
