// Nuxt UI v4 のアプリケーション設定。
// primary color を orange に設定し、Tailwind の orange-600 ベースのトーンを基調にする。
// （AIっぽいビビッドさを避けるため、明るすぎる純オレンジではなく落ち着いた orange-600 寄りを採用）
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'slate',
    },
  },
})
