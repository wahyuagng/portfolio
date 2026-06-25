import type { SupabaseClient } from '@supabase/supabase-js';

import { AuthMethodEnum } from '@auth/enums';
import { createClient } from '@supabase/supabase-js';

import { CONFIG } from '../../global-config';

// ----------------------------------------------------------------------

const isSupabase = sessionStorage.authMethod === AuthMethodEnum.SUPABASE;

const supabaseUrl = CONFIG.supabase.url;
const supabaseKey = CONFIG.supabase.key;

export const supabase = isSupabase
    ? createClient(supabaseUrl, supabaseKey)
    : ({} as SupabaseClient<any, 'public', any>);
