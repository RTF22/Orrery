import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

/**
 * Einstiegspunkt der Anwendung.
 *
 * Hier wird nur der React-Wurzelknoten samt einer vollflächigen Canvas-
 * Platzhalterfläche montiert. Der eigentliche Renderer folgt erst in
 * einer späteren Aufgabe — an dieser Stelle wird bewusst nicht vorgegriffen.
 */
function App(): React.JSX.Element {
  return <canvas style={{ width: '100%', height: '100%', display: 'block' }} />;
}

const wurzelElement = document.getElementById('root');
if (wurzelElement === null) {
  throw new Error('Wurzelelement "#root" wurde nicht gefunden.');
}

createRoot(wurzelElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
