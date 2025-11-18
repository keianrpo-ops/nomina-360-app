
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';   // ⬅️ AÑADE ESTA LÍNEA

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
