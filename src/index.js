import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, BrowserRouter } from "react-router";
import { configure } from "mobx";
import "./i18n"

configure({ enforceActions: "never" });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
      <App />
  </HashRouter>
);
