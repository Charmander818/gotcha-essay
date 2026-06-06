import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill Promise.try for @google/genai SDK in older browser environments
if (typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function<T>(callback: () => T | PromiseLike<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        resolve(callback());
      } catch (e) {
        reject(e);
      }
    });
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);