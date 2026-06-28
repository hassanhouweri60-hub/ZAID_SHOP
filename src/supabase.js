import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwiwljzkkufjfsfveapm.supabase.co';
const supabaseKey = 'sb_publishable_3naBswhqHAfIXQS1pHBZcg_5GVZmXcA';

export const supabase = createClient(supabaseUrl, supabaseKey);