import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx';
import './index.css';

// 1. Se crea el router
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      // Si en el futuro tienes más páginas (ej: /sobre-mi), las añades aquí
    },
  ],
  {
    // 2. Se le dice al router que la página base es /sandinowebtest/
    basename: "/sandinowebtest", 
  }
);

// 3. Se renderiza la aplicación usando el router
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
