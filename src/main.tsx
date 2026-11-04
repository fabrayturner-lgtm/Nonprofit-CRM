import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both a getter and setter so browser extensions can safely hook it
try {
  let customFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'fetch', {
      get: () => customFetch,
      set: (fn) => {
        customFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (_) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
