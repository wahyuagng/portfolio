import { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { EnvironmentEnum } from '@common/enums/environment.enum';

import App from './app';
import { CONFIG } from './global-config';

// ----------------------------------------------------------------------

if (CONFIG.appEnvironment === EnvironmentEnum.PRODUCTION) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
}

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <StrictMode>
        <BrowserRouter>
            <Suspense>
                <App />
            </Suspense>
        </BrowserRouter>
    </StrictMode>
);
