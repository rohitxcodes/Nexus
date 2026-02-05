export default function ProblemDescription({ problem }) {
  return (
    <div className="p-4 overflow-y-auto h-full" style={{backgroundColor:"#001F3D"}}>
      <h1 className="text-5xl font-bold mb-2 text-[#F8FAFC]" >{problem.title}</h1>
      <span className="text-green-500 text-sm">{problem.difficulty}</span>

      <pre className="mt-4 text-sm whitespace-pre-wrap text-[#F8FAFC]">
        {problem.description}
      </pre>

      <h3 className="mt-4 font-semibold text-[#E6EAF0]">Example</h3>
      <pre className="bg-gray-900 p-3 rounded mt-2 text-sm text-[#F5F5F5]" >
        {problem.example}
      </pre>
    </div>
  );
}
