import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('assets/android', { recursive: true });
// Custom mode keeps the supplied splash instead of deriving it from icon.png.
await copyFile('assets/icon.png', 'assets/android/icon-only.png');
await copyFile('assets/icon.png', 'assets/android/icon-foreground.png');
await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#211e1a' } }).png().toFile('assets/android/icon-background.png');
await copyFile('assets/splash.png', 'assets/android/splash.png');
await copyFile('assets/splash.png', 'assets/android/splash-dark.png');
