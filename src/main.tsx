import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from "react-router-dom";
import App from './App.tsx';
import './index.css';

const container = document.getElementById("root")!;
const root = createRoot(container);

// Simplemente envolvemos la App principal en el HashRouter
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
