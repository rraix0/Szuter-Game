import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import { zincColors } from "./colors/zinc.ts"; 

import App from "./App";
import "./index.css";


const root = document.documentElement;
Object.entries(zincColors.zinc.gray).forEach(([shade, hex]) => {
  root.style.setProperty(`--color-zinc-${shade}`, hex);
});

 // dodanie w locie koloru zinc

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
