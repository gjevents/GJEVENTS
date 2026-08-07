import { createClient } from "@base44/sdk";

const base44 = createClient({
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || window.location.origin,
});

export { base44 };
export default base44;
