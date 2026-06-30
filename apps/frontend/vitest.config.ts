// https://nuxt.com/docs/getting-started/testing
// @nuxt/test-utils が提供する defineVitestConfig で Nuxt 環境を再現する。
// environment: 'nuxt' を指定すると、テスト中にも Nuxt の Auto Imports
// (ref, computed, useFetch等) と composable が使えるようになる。
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
  },
});
