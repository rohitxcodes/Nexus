import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, problem, setCode }) {
  const [value, setValue] = useState("");
  console.log("EDITOR PROBLEM:", problem);
  console.log("EDITOR LANGUAGE:", language);

  useEffect(() => {
    if (!problem) return;

    const prototype = problem?.prototypes?.[language] || "";

    setValue(prototype);
    setCode(prototype);
  }, [problem, language]);

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(val) => {
        setValue(val || "");
        setCode(val || "");
      }}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
