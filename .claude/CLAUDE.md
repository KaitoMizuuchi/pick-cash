# プロジェクト概要

個人の収支管理アプリ。固定費・変動費を区別して支出を記録し、将来は収入も含めた管理に拡張する。

詳細な要件・設計は `docs/` を参照。

- `docs/requirements.md` — 機能要件
- `docs/architecture.md` — 技術スタック・モノレポ構成・通信パターン・認証方針・エラーハンドリング
- `docs/dbSchema.md` — DBスキーマ
- `docs/apiEndpoints.md` — APIエンドポイント仕様

# 取り組むにあたって

このプロジェクトは案件で使用するVue.js / Nuxt / NestJSの学習に利用します。

# フォルダ構成 / スタック / コマンド

## フォルダ構成

```
pick-cash/
├─ apps/        ← frontend / backend を配置予定
├─ packages/    ← shared を配置予定
├─ docs/        ← 設計ドキュメント
└─ .claude/
```

## スタック・コマンド

依存パッケージとスクリプトは各 `package.json` を参照する。

- ルート: `/package.json`
- 各app/package: `apps/*/package.json` / `packages/*/package.json`

# レイヤー構成

## バックエンド（NestJS）

機能ごとにModuleを切り、配下に以下のレイヤーを置く。

- **Controller**: HTTPエンドポイント。リクエスト/レスポンスの変換のみ。ビジネスロジックを書かない
- **Service**: ビジネスロジック・Prisma経由のDB操作
- **DTO**: リクエスト/レスポンスの型・Zodスキーマ
- **Module**: 機能単位のDIコンテナ

横断的関心事は `src/common/` 配下に置く（filters / middlewares / pipes）。

## フロントエンド（Nuxt）

- **pages/**: ルーティング
- **components/**: UI部品
- **composables/**: ロジック再利用。API呼び出しもここに集約する
- **stores/**: Pinia（必要になったら導入）
- **utils/**: 汎用ユーティリティ
- **types/**: フロント固有の型

`pages` / `components` から直接 `$fetch` を呼ばない。必ず `composables` 経由。

## 共有パッケージ

- **packages/shared/**: フロント/バックで共有するZodスキーマと型

# コーディング規約

Biomeで自動整形・チェックする項目（インデント・クォート・セミコロン・未使用変数・import順序など）はここに書かない。

## 型・TypeScript

- `any` 禁止。どうしても必要なら `unknown` 経由で扱う
- 型は使う場所の近くに定義し、共有が必要になったら `packages/shared` へ移動
- Zodスキーマから型を導出（`z.infer<typeof schema>`）して二重定義を避ける

## 関数・ロジック

- 早期returnで `if-else` のネストを浅くする
- 関数は動詞始まり（`fetchTransactions`, `calculateTotal`）
- booleanは `is` / `has` / `can` プレフィックス（`isFixed`, `hasError`）
- マジックナンバー・マジック文字列は定数化する
- 副作用（API呼び出し・DOM操作）は関数の入口/出口に寄せ、中核は純粋関数寄りに保つ
- 同じコードが3箇所に出てきたら共通化を検討する（Rule of Three）。2回目までは許容
- "便利関数" を即 `utils` に投げる前に本当に汎用かを判断する。特定ドメインのものは該当機能のディレクトリに置く

## エラーハンドリング

### バックエンド

- 詳細なエラーは `console.error` に出力する
- HTTPレスポンスは汎用的なメッセージとステータスコードのみ返す
- 例外はGlobalExceptionFilterで一元処理する
- catchで握りつぶさない（空catch禁止）

### フロントエンド

- APIエラーは握りつぶさず、UI（トースト等）でユーザーに通知する
- 詳細はコンソールに出力する

## コメント

- 「なぜ」を書く。「何を」はコードで読めるので書かない
- TODOには理由と日付を付ける

## 命名規則

ファイル命名（Biome管轄外）:

- **基本はcamelCase**。kebab-caseは使わない
- NestJSのみレイヤー識別のためのドット区切り表記を許容する
  - 例: `transactions.controller.ts` / `userProfile.service.ts`
- Vueコンポーネントファイル: PascalCase（`TransactionList.vue`）
- composable: `useXxx.ts`（camelCase）

変数・関数:

- 変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE（モジュールスコープの不変値のみ）
- 型・クラス・コンポーネント: PascalCase
- 配列変数は複数形（`transactions` であって `transactionList` ではない）

## API通信

- フロントエンドのAPI呼び出しは `composables/` に集約する
- 共通のリクエスト/レスポンス型は `packages/shared` のZodスキーマから導出する

# 全体方針

- 推測で実装を進めず、不明点はユーザーに確認する
- 既存ファイルの編集を優先し、新規ファイルは必要な場合のみ作る
- 既存ドキュメント（`docs/`）と矛盾する変更を加えるときは、ドキュメントも併せて更新する
