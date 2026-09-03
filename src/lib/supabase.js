import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When credentials are absent (e.g. a fork without the project's .env), fall
// back to a no-op client so the site still renders and only Supabase-backed
// content comes up empty.
const createStubClient = () => {
  const result = Promise.resolve({ data: [], error: null });
  const query = new Proxy(result, {
    get: (target, prop) =>
      prop in target ? Reflect.get(target, prop).bind(target) : () => query,
  });
  return { from: () => query };
};

let client;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env variables are missing — running without a Supabase connection."
  );
  client = createStubClient();
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
