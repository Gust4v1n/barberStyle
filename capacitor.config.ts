import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.senai.barberstyle', appName: 'BarberStyle', webDir: 'dist',
  plugins: { SplashScreen: { launchShowDuration: 2000, launchAutoHide: true, backgroundColor: '#211e1a', androidSplashResourceName: 'splash', androidScaleType: 'CENTER_CROP', showSpinner: false } }
};
export default config;
