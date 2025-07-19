import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from "react-router-dom";
import App from './App.tsx';
import './index.css';

const container = document.getElementById("root");
if (!container) throw new Error('Root element not found'); // Evita errores de inicialización

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter basename="/"> {/* basename="/" para simplicidad */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
