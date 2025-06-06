/* eslint-disable check-file/filename-naming-convention */
import "@mantine/code-highlight/styles.css";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
