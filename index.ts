// index.ts
import GoogleTagManager from "./src/GoogleTagManager";
import NoScript from "./src/NoScript";
export { GoogleTagManager, NoScript };
export { sendGTMEvent, configureGTM } from "./src/sendGTMEvent";
export * from "./src/utils/trackEvents";
export type { GTMEvent, GTMConfig } from "./src/sendGTMEvent";
export type { GoogleTagManagerProps } from "./src/GoogleTagManager";
export type { NoScriptProps } from "./src/NoScript";