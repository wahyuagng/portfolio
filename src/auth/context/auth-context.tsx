import type { AuthContextValue } from '@auth/types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
