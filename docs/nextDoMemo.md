# 次にやること

## 進め方の原則

- 1ステップ終わったらメインセッションで動作確認してから次のステップに進む
- 詰まったら無理に進めず、要件・設計に立ち戻る
- ステップの間で適宜コミット（Conventional Commits / 本文は日本語）

---

## 完了済み（セットアップ）

- モノレポ土台
- Biome導入
- ローカルDB
- backend初期化（NestJS）
- Prisma導入 + スキーマ定義 + マイグレーション
- seed投入（仮ユーザー / カテゴリマスタ）
- nestjs-zod / zod 導入（ZodベースのDTO・バリデーション基盤）

---

## STEP 1: Vitest 導入

ゴール: バックエンドでVitestテストが動く状態。

- [ ] Vitest と関連パッケージを導入（NestJSデフォルトのJestは使わずクリーンに）
- [ ] `vitest.config.ts` を作成（NestJS の `paths` や `experimentalDecorators` を考慮）
- [ ] 動作確認用の最小テスト1本書いて `pnpm test` が通る

動作確認: `pnpm --filter @pick-cash/backend test` が成功。

---

## STEP 2: packages/shared セットアップ

ゴール: フロント/バックで共有するZodスキーマの置き場ができる。

- [ ] `packages/shared` 初期化（`package.json` / `tsconfig.json`）
- [ ] `@pick-cash/shared` をbackendとfrontendから import 可能に
- [ ] Transaction / Category のZodスキーマ定義（リクエスト/レスポンス型）

動作確認: backend から `@pick-cash/shared` を import してビルドが通る。

---

## STEP 3: 仮認証ミドルウェア + GlobalExceptionFilter

ゴール: リクエストに `userId` が注入され、例外が一元処理される。

- [ ] 仮認証ミドルウェアを作成（`seed_user_dev` をハードコード）
- [ ] GlobalExceptionFilter で全例外を補足し、汎用メッセージと適切なステータスを返す
- [ ] 詳細は `console.error` に出力

動作確認: 既存の `GET /` で `req.userId` が取れる / 例外を投げると整形されて返る。

---

## STEP 4: Category API (GET)

ゴール: `GET /categories` でカテゴリ一覧が取得できる。

- [ ] CategoriesModule / Controller / Service / Repository を作成
- [ ] クエリパラメータ `type` で income / expense 絞り込み
- [ ] レスポンスは `{ data: [...] }` 形式
- [ ] テスト（Service or Repositoryレベル）

動作確認: `curl http://localhost:3001/categories` で 13件、`?type=expense` で 9件。

---

## STEP 5: Transaction API (CRUD・論理削除)

ゴール: Transactionの作成・取得・更新・削除（論理）がAPIで動く。

- [ ] TransactionsModule / Controller / Service / Repository を作成
- [ ] `GET /transactions` 一覧（仮userIdで絞り込み・日付降順）
- [ ] `GET /transactions/:id` 詳細
- [ ] `POST /transactions` 作成（Zodバリデーション）
- [ ] `PATCH /transactions/:id` 更新
- [ ] `DELETE /transactions/:id` 論理削除（`deletedAt` セット）
- [ ] Repository層で `deletedAt IS NULL` フィルタを強制
- [ ] テスト

動作確認: curlで一通りのCRUDが動く。

---

## STEP 6: frontend (Nuxt) 初期化

ゴール: Nuxtが起動して `localhost:3000` でページ表示。

- [ ] `apps/frontend` を Nuxt 3 で初期化
- [ ] VeeValidate + @vee-validate/zod + Zod 導入
- [ ] Vitest + @nuxt/test-utils + @vue/test-utils 導入
- [ ] `runtimeConfig` で `apiBase` を設定

動作確認: `pnpm dev:frontend` で起動 → 初期ページが表示。

---

## STEP 7: 一覧画面

ゴール: `GET /transactions` を叩いて一覧表示する画面ができる。

- [ ] 一覧ページ作成（日付降順）
- [ ] composable で API 呼び出しを集約
- [ ] エラー時はトーストでユーザー通知

動作確認: ブラウザで一覧が見える。

---

## STEP 8: 登録モーダル

ゴール: モーダルで新規取引を追加できる。

- [ ] モーダルコンポーネント
- [ ] フォーム（VeeValidate + sharedのZodスキーマ）
- [ ] POST後に一覧を再取得 or 楽観的更新

動作確認: 登録した取引が一覧に反映される。

---

## STEP 9: 編集モーダル + 削除

ゴール: 既存取引の編集・削除ができる。

- [ ] 編集モーダル（登録モーダルと共通化検討）
- [ ] PATCH 連携
- [ ] 一覧の各行から DELETE を呼べる

動作確認: 編集・削除が反映される。

---

## 着手前に決めたい点

各ステップ着手時に確認:

- Prismaのソフトデリート: `$extends` で共通化するか、Repository層で都度書くか（STEP 5で判断）
- frontendの状態管理: 最初はcomposablesだけ vs Piniaを最初から（STEP 7で判断）
- ポート: frontend=3000 / backend=3001 / db=5432（決定済み）
