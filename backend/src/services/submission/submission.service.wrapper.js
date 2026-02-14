// backend/src/services/submission/submission.service.wrapper.js

function escapeForCompiledLanguages(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildWrappedCode({ language, userCode, problem }) {
  const boilerplate = problem.boilerplates?.[language];

  if (!boilerplate) {
    throw new Error("NO_BOILERPLATE_FOR_LANGUAGE");
  }

  let wrappedCode = boilerplate.replace("{{USER_CODE}}", userCode);

  if (language === "cpp") {
    const cppCases = problem.testCases
      .map((tc) => `"${escapeForCompiledLanguages(tc.input)}"`)
      .join(",");

    wrappedCode = wrappedCode.replace("{{TEST_CASES_CPP}}", cppCases);
  } else if (language === "java") {
    const javaCases = problem.testCases
      .map((tc) => `"${escapeForCompiledLanguages(tc.input)}"`)
      .join(",");

    wrappedCode = wrappedCode.replace("{{TEST_CASES_JAVA}}", javaCases);
  } else {
    wrappedCode = wrappedCode.replace(
      "{{TEST_CASES}}",
      JSON.stringify(problem.testCases),
    );
  }

  return wrappedCode;
}

module.exports = { buildWrappedCode };
