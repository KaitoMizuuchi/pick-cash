// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt UI v4 と VeeValidate を Nuxt モジュール経由で導入。
  // - @nuxt/ui: UI コンポーネントライブラリ。app.config.ts で primary color を指定する。
  // - @vee-validate/nuxt: <Form> / <Field> / <ErrorMessage> や useForm / useField を自動インポート。
  //   shared の Zod スキーマは @vee-validate/zod の toTypedSchema() で包んで使う。
  modules: ['@nuxt/ui', '@vee-validate/nuxt'],

  // Tailwind CSS v4 のエントリCSSを全ページに適用。
  // @import "tailwindcss" を含むファイルを Nuxt 全体の CSS として読み込む。
  css: ['~/assets/css/main.css'],

  // Tailwind v4 は Vite プラグインとして動かすのが公式推奨。
  // postcss を経由せず、Vite が直接 utility クラスを解析・生成する。
  vite: {
    plugins: [tailwindcss()],
  },

  // 個人の収支管理アプリは認証必須・SEO不要・公開ページなしのため SPA で動かす。
  // すべてクライアント側で描画され、サーバーは空のHTMLを返すだけになる。
  // 将来公開ページが必要になったら hybrid に切り替える（routeRules で個別指定可能）。
  ssr: false,

  // 環境変数を安全にアプリへ届ける仕組み。
  // - public 配下の値はクライアントにも露出する（コンポーネントから useRuntimeConfig() で参照）。
  // - public ではない値はサーバー専用。SPAモードでは使う場面はないが、将来BFF的に使う場合に備えて
  //   位置だけ用意しておく方針。
  // .env で NUXT_PUBLIC_API_BASE のようにアッパースネークで上書き可能。
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001',
    },
  },

  // 機能モジュールを縦割りで管理するため、features/ 配下の components / composables も
  // 自動インポート対象に含める。デフォルトの ~/components / ~/composables も維持する。
  // pathPrefix: false でディレクトリ名がコンポーネント名にprefixされないようにする
  // （例: features/transactions/components/TransactionList.vue → <TransactionList /> として利用可能）。
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/features', pathPrefix: false },
  ],
  imports: {
    dirs: [
      'composables/**',
      'features/**/composables',
    ],
  },
})
