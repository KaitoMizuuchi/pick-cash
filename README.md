# pick-cash

NestJS / Nuxt を学習するためのリポジトリ。

## 技術スタック

### 共通

- **言語**: TypeScript
- **パッケージマネージャ**: pnpm（workspace で monorepo 構成）
- **Linter / Formatter**: Biome
- **バリデーション**: Zod

### バックエンド (`apps/backend`)

- **フレームワーク**: NestJS
- **ORM**: Prisma（`@prisma/adapter-pg` 経由で PostgreSQL に接続）
- **DTO / バリデーション**: nestjs-zod
- **テスト**: Vitest（`unplugin-swc` でデコレータメタデータを保持）

### フロントエンド (`apps/frontend`)

- **フレームワーク**: Nuxt 3
- **フォーム / バリデーション**: VeeValidate + `@vee-validate/zod`
- **テスト**: Vitest + `@nuxt/test-utils` + `@vue/test-utils`

### 共有パッケージ (`packages/shared`)

- backend / frontend で共有する Zod スキーマと型
- ビルドはせず TypeScript ソースをそのまま import する

### インフラ / その他

- **DB**: PostgreSQL 17（Docker Compose でローカル起動）

## ディレクトリ構成

```
pick-cash/
├─ apps/
│  ├─ backend/    # NestJS
│  └─ frontend/   # Nuxt
├─ packages/
│  └─ shared/     # 共有Zodスキーマ・型
├─ docs/          # 設計ドキュメント
└─ docker-compose.yml
```

## 必要環境

- Node.js >= 24
- pnpm 11（`packageManager` フィールドで固定）
- Docker / Docker Compose

## 環境構築

```bash
# 1. 依存インストール
pnpm install

# 2. .env を作成
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env

# 3. DB 起動
pnpm db:up

# 4. マイグレーション + 初期データ投入
pnpm db:migrate
pnpm db:seed

# 5. backend 起動
pnpm dev:backend
```

backend は `http://localhost:3001` で起動する。

## よく使うコマンド

### アプリ

| コマンド | 説明 |
|---|---|
| `pnpm dev:backend` | backend を watch モードで起動 |
| `pnpm build:backend` | backend をビルド |
| `pnpm start:backend` | ビルド済み backend を起動 |
| `pnpm test:backend` | backend のテストを実行 |

### DB

| コマンド | 説明 |
|---|---|
| `pnpm db:up` | PostgreSQL コンテナを起動 |
| `pnpm db:down` | コンテナ停止 |
| `pnpm db:logs` | DB ログを追従 |
| `pnpm db:psql` | psql でコンテナに接続 |
| `pnpm db:migrate` | Prisma マイグレーション実行 |
| `pnpm db:generate` | Prisma Client 再生成 |
| `pnpm db:studio` | Prisma Studio 起動 |
| `pnpm db:seed` | 初期データ投入 |

### Lint / Format

| コマンド | 説明 |
|---|---|
| `pnpm format` | Biome で整形 |
| `pnpm format:check` | 整形チェックのみ |
| `pnpm lint` | Lint 実行 |
| `pnpm lint:fix` | Lint 自動修正 |
| `pnpm check` | Lint + Format をまとめて実行 |
| `pnpm check:fix` | Lint + Format をまとめて自動修正 |
