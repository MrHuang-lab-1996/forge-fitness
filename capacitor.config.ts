import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.forge.fitnesstracker",
  appName: "FORGE 健身计划",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  android: {
    buildOptions: {
      signingType: "apk",
    },
  },
};

export default config;
