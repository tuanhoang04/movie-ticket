import './global.css';

import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';

createRoot(document.getElementById("admin-root")).render(
    <StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StrictMode>
);
