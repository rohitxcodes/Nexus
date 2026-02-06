export default function ProblemDescription({ problem }) {
  return (
    <div
      className="p-4 overflow-y-auto h-full"
      style={{ backgroundColor: "#001F3D" }}
    >
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-2 text-[#F8FAFC]">
        {problem.title}
      </h1>

      {/* DIFFICULTY */}
      <span className="text-green-500 text-sm">{problem.difficulty}</span>

      {/* DESCRIPTION */}
      <pre className="mt-4 text-sm whitespace-pre-wrap text-[#F8FAFC]">
        {problem.description}
      </pre>

      {/* TAGS */}
      {problem.tags?.length > 0 && (
        <div className="mt-4 text-xs text-blue-300">
          Tags: {problem.tags.join(", ")}
        </div>
      )}

      {/* CONSTRAINTS */}
      {problem.constraints && (
        <div className="mt-4">
          <h3 className="font-semibold text-[#E6EAF0]">Constraints</h3>
          <pre className="bg-gray-900 p-3 rounded mt-2 text-sm text-[#F5F5F5] whitespace-pre-wrap">
            {problem.constraints}
          </pre>
        </div>
      )}

      {/* EXAMPLES */}
      {problem.examples?.map((ex, i) => (
        <div key={i} className="mt-6">
          <h3 className="font-semibold text-[#E6EAF0]">Example {i + 1}</h3>

          <pre className="bg-gray-900 p-3 rounded mt-2 text-sm text-[#F5F5F5]">
            {`Input:
${ex.input}

Output:
${ex.output}

${ex.explanation || ""}`}
          </pre>
        </div>
      ))}

      {/* TEST CASES (only visible ones) */}
      {problem.testCases?.filter((tc) => !tc.isHidden).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-[#E6EAF0]">Test Cases</h3>

          {problem.testCases
            .filter((tc) => !tc.isHidden)
            .map((tc, i) => (
              <pre
                key={i}
                className="bg-gray-900 p-3 rounded mt-2 text-sm text-[#F5F5F5]"
              >
                {`Input:
${tc.input}

Expected Output:
${tc.expectedOutput}`}
              </pre>
            ))}
        </div>
      )}
    </div>
  );
}
