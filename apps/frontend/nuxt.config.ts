// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
