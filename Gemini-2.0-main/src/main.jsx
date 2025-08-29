import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ContextProvider from "./context/context";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
