import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import router from "./router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {router}
  </React.StrictMode>,
);
