import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9a729dea12bc449085e58f35e89429e8',
  appName: 'Tidrapportering - Byggfirma Nord',
  webDir: 'dist',
  server: {
    url: 'https://9a729dea-12bc-4490-85e5-8f35e89429e8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e40af", // Primary blue color
      showSpinner: false
    }
  }
};

export default config;