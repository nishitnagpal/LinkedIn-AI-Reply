import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './style.css'; 

// Create a root for the main React app
const rootElement = document.getElementById('root');

if (rootElement) {
  const reactRoot = ReactDOM.createRoot(rootElement);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
