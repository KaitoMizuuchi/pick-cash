# 次にやること

## 進め方の原則

- 1ステップ終わったらメインセッションで動作確認してから次のステップに進む
- 詰まったら無理に進めず、要件・設計に立ち戻る
- ステップの間で適宜コミット（Conventional Commits / 本文は日本語）

---

## 完了済み（セットアップ）

### バックエンド
- モノレポ土台
- Biome導入
- ローカルDB
- backend初期化（NestJS）
- Prisma導入 + スキーマ定義 + マイグレーション
- seed投入（仮ユーザー / カテゴリマスタ / Transaction 10件）
- nestjs-zod / zod 導入（ZodベースのDTO・バリデーション基盤）
- Vitest 導入（unplugin-swc でデコレータメタデータ保持、`@nestjs/testing` 連携）
- packages/shared セットアップ（Category / TransactionのZodスキーマを共有）
- 仮認証Middleware + GlobalExceptionFilter（`req.userId` 注入、例外を汎用メッセージで整形）
- Category API (GET `/categories`) 実装
- Transaction API CRUD 実装（GET / POST / PATCH / DELETE、論理削除、findUniqueOrThrow と Prisma エラーマッピングで 404 対応）
- SWC builder 有効化（`pnpm dev:backend` のホットリロード安定化）
- CRUDメソッド命名を流派A（findAll/findOne）に統一

### フロントエンド
- Nuxt 4 初期化（apps/frontend、`@pick-cash/frontend`）
- SPA モード + runtimeConfig（apiBase）
- `@pick-cash/shared` 依存追加（workspace 依存）
- features/ 配下の自動インポート設定
- Tailwind CSS v4 導入（`@tailwindcss/vite` + `app/assets/css/main.css`）
- VeeValidate 導入（`@vee-validate/nuxt` + `@vee-validate/zod`）
- Vitest + `@nuxt/test-utils` + `@vue/test-utils` + happy-dom 導入
- ルート `package.json` に dev:frontend / build:frontend / test:frontend / preview:frontend 追加

### 横断
- 学習ナレッジHTML（docs/knowledge/index.html）と GitHub Pages 自動デプロイ
- save-knowledge スキル（プロジェクトローカル）

---

## STEP 1: 一覧画面

ゴール: `GET /transactions` を叩いて一覧表示する画面ができる。

- [ ] 一覧ページ作成（日付降順）
- [ ] composable で API 呼び出しを集約
- [ ] エラー時はトーストでユーザー通知

動作確認: ブラウザで一覧が見える。

---

## STEP 2: 登録モーダル

ゴール: モーダルで新規取引を追加できる。

- [ ] モーダルコンポーネント
- [ ] フォーム（UForm + sharedのZodスキーマ）
- [ ] POST後に楽観的更新

動作確認: 登録した取引が一覧に反映される。

### 解決済み

- shared パッケージの CJS/ESM 問題: exports に `"import": "./src/index.ts"` を追加し、Vite にはソース TypeScript を、backend には CJS dist を返す方式で解決
- backend の DI エラー: Biome の `useImportType` ルールが DI 対象クラスの import を `import type` に書き換えていた → backend 向けに無効化が必要（対応中）
- 登録モーダルの動作確認: 表示・登録ともに動作確認済み

---

## STEP 3: 編集モーダル + 削除

ゴール: 既存取引の編集・削除ができる。

- [ ] 編集モーダル（登録モーダルと共通化検討）
- [ ] PATCH 連携
- [ ] 一覧の各行から DELETE を呼べる

動作確認: 編集・削除が反映される。

---

## 残課題・後回し

直近着手しないが忘れないように残しておくもの:

- [ ] backend の Transactions Service / Repository のテストを書く（Categories と同水準に）
- [ ] backend の `pnpm dev:backend` を本番風で起動したいときの手順整備（nest start --watch は SWC builder で安定化済み、`pnpm build:backend && pnpm start:backend` でも可）

---

## 着手前に決めたい点

各ステップ着手時に確認:

- frontendの状態管理: 最初はcomposablesだけ vs Piniaを最初から（STEP 1 で判断）
- ポート: frontend=3000 / backend=3001 / db=5432（決定済み）

### 決定済み（参考）

- Prismaのソフトデリート → Repository層で `deletedAt: null` フィルタを都度書く方式を採用（`$extends` での共通化は今のところ不要）
