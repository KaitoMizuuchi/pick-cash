// Vitest + @nuxt/test-utils が動作することを確認するためのダミーテスト。
// features/transactions の実装に着手したら削除する（学習用に残しておきたい場合は別途判断）。
import { describe, expect, it } from 'vitest'

describe('sample', () => {
  it('Vitest が動作する', () => {
    expect(1 + 1).toBe(2)
  })

  it('Nuxt 環境で ref() が直接呼び出せる (Auto Imports 確認)', () => {
    // vitest.config.ts で environment: 'nuxt' を設定しているため、
    // import を書かずに ref などの Vue/Nuxt の API が使えるはず。
    const count = ref(0)
    count.value++
    expect(count.value).toBe(1)
  })
})
