import Editor from "@monaco-editor/react";

const boilerplate = {
  javascript: `function twoSum(nums, target) {
  
}`,
  python: `def twoSum(nums, target):
    pass`,
  
};

export default function CodeEditor({ language, setCode }) {
  return (
    <Editor
      height="70vh"
      language={language}
      defaultValue={boilerplate[language]}
      theme="vs-dark"
      onChange={(value) => setCode(value)}
    />
  );
}
