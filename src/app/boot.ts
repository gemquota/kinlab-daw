import { APP_CONFIG } from "./config";
import { getAllFeatureFlags } from "./featureFlags";

/**
 * Application boot sequence.
 * Called once before the first render.
 */
export function boot(): void {
  if (import.meta.env.DEV) {
    console.log(
      `%c${APP_CONFIG.name} v${APP_CONFIG.version}`,
      "color: #3b82f6; font-weight: bold; font-size: 14px;",
    );
    console.log("Feature flags:", getAllFeatureFlags());
  }
}
