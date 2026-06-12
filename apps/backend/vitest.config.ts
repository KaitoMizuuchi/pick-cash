import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
  },
  // Vitest 4のデフォルトトランスフォーマOxcを無効化し、SWCに任せる
  // SWCはNestJSのデコレータメタデータ (emitDecoratorMetadata) を保持できる
  esbuild: false,
  oxc: false,
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
