import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import router from "./app/router";
import "./styles/App.css";
import "./styles/index.css";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#08111f] text-white">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm tracking-wide text-white/80 shadow-2xl backdrop-blur">
              Loading application...
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Analytics />
    </>
  );
}

export default App;
