import ProblemDescription from "../components/ProblemDescription";
import SuccessPopup from "../components/SuccessPopup";
import ProblemWorkspace from "../components/level/ProblemWorkspace";
import ShopSidebar from "../components/level/ShopSidebar";
import LevelEntryPopup from "../components/level/LevelEntryPopup";
import AiHintPopup from "../components/level/AiHintPopup";
import { useProblemPage } from "../hooks/useProblemPage";

export default function ProblemPage() {
  const {
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
    showAiHintPopup,
    setShowAiHintPopup,
    usingPower,
    handleStartLevelFromPopup,
    usePower,
    runCode,
    handleReplay,
    handleNextLevel,
    isHintActive,
    shopItems,
    leftPaneWidth,
    editorHeight,
    workspaceRef,
    startLeftResize,
    startEditorResize,
  } = useProblemPage();

  if (!problem) {
    return <div className="p-6">Loading problem data...</div>;
  }

  return (
    <>
      <style>{`\n        .powers-scroll {\n          -ms-overflow-style: none;\n          scrollbar-width: none;\n        }\n        .powers-scroll::-webkit-scrollbar {\n          display: none;\n        }\n      `}</style>
      <style>{`\n        .problem-scroll {\n          -ms-overflow-style: none;\n          scrollbar-width: none;\n        }\n        .problem-scroll::-webkit-scrollbar {\n          display: none;\n        }\n      `}</style>

      <div className="flex h-screen w-screen items-stretch overflow-hidden bg-[#0f172a]">
        <div
          className="h-full min-w-[320px] max-w-[70vw] overflow-hidden border-r border-gray-700"
          style={{ width: `${leftPaneWidth}%` }}
        >
          <ProblemDescription problem={problem} />
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={startLeftResize}
          className="w-1 cursor-col-resize bg-gray-700/70 hover:bg-blue-500"
        />

        <ProblemWorkspace
          language={language}
          setLanguage={setLanguage}
          problem={problem}
          code={code}
          setCode={setCode}
          status={status}
          output={output}
          isHintActive={isHintActive}
          editorHeight={editorHeight}
          workspaceRef={workspaceRef}
          onEditorResizeStart={startEditorResize}
          onRun={() => runCode(false)}
          onSubmit={() => runCode(true)}
        />

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

      <ShopSidebar
        sidebarOpen={sidebarOpen}
        shopItems={shopItems}
        shopItemCounts={shopItemCounts}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onUsePower={usePower}
        usingPower={usingPower}
      />

      <LevelEntryPopup
        isOpen={showLevelEntryPopup}
        levelNumber={levelNumber}
        shopItems={shopItems}
        shopItemCounts={shopItemCounts}
        activeShopItems={activeShopItems}
        onClose={() => setShowLevelEntryPopup(false)}
        onStart={handleStartLevelFromPopup}
      />

      <AiHintPopup
        isOpen={showAiHintPopup}
        hint={aiHint}
        status={aiHintStatus}
        onClose={() => setShowAiHintPopup(false)}
      />
    </>
  );
}
