import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from "react-router-dom"; // <--- CAMBIO IMPORTANTE
import App from './App.tsx';
import './index.css';

const container = document.getElementById("root")!;
const root = createRoot(container);

// Se renderiza la aplicación usando HashRouter
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
