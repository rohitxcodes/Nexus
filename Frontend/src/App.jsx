import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import "./styles/App.css";
import "./styles/index.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
