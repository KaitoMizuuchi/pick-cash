# 明日やること

セットアップは一気に進めず、**ステップごとに動作確認しながら少しずつ**進める。
各ステップ完了時に「動くこと」を確認してから次へ。

## 進め方の原則

- 1ステップ終わったらメインセッションで動作確認してから次のステップに進む
- 詰まったら無理に進めず、要件・設計に立ち戻る
- ステップの間で適宜コミット（Conventional Commits / 本文は日本語）

---

## STEP 1: モノレポ土台だけ作る

ゴール: `pnpm install` が通ってルート構成ができている状態。

- [ ] ルート `package.json` 作成
- [ ] `pnpm-workspace.yaml` で `apps/*` `packages/*` を登録
- [ ] `.gitignore` / `.editorconfig` 整備
- [ ] `apps/` `packages/` の空ディレクトリだけ作る

動作確認: `pnpm install` がエラーなく終わる。

---

## STEP 2: Biome導入

ゴール: ルートで `pnpm format` / `pnpm lint` が動く。

- [ ] Biomeをルートに導入
- [ ] `biome.json` 設定
- [ ] ルートの `package.json` に scripts 追加

動作確認: 適当なtsファイルを置いて整形・リントが効く。

---

## STEP 3: ローカルDB

ゴール: PostgreSQLがDockerで立ち上がる。

- [ ] `docker-compose.yml` で PostgreSQL 定義
- [ ] `.env.example` を整備（`DATABASE_URL`）

動作確認: `docker compose up -d` でDB起動、`docker compose ps` で確認。

---

## STEP 4: backend初期化（NestJSだけ立ち上げ）

ゴール: `pnpm --filter backend dev` でNestJSが起動して `GET /` が返る。

- [ ] `apps/backend` をNestJS CLIで初期化
- [ ] ルートの scripts から起動できるよう調整

動作確認: ブラウザ or curl で `http://localhost:3001` にアクセスできる。

---

## STEP 5: Prisma導入 + スキーマ定義

ゴール: マイグレーションが通り、DBにテーブルができる。

- [ ] Prisma導入
- [ ] `prisma/schema.prisma` に User / Category / Transaction を定義
  - `docs/dbSchema.md` の通り（`deletedAt` 含む）
  - enum `TransactionType`
- [ ] 初回マイグレーション

動作確認: `psql` や Prisma Studio でテーブルが見える。

---

## STEP 6: seed投入

ゴール: 仮ユーザーとカテゴリマスタがDBに入る。

- [ ] seedスクリプト作成
  - 仮ユーザー1名（固定ID）
  - カテゴリマスタ（`docs/requirements.md` の初期カテゴリ）
- [ ] `pnpm --filter backend db:seed` 等で実行できる

動作確認: DBに想定通りのレコードが入っている。

---

## STEP 7以降（先の見通しだけメモ）

明日中にどこまで行けるかはペース次第。無理せず止める。

- nestjs-zod / Vitest 導入
- 仮認証ミドルウェア + GlobalExceptionFilter
- Category API（GET）
- Transaction API（CRUD・論理削除）
- `packages/shared` でZodスキーマ共有
- frontend (Nuxt) 初期化
- 一覧画面 → 登録モーダル → 編集モーダル → 削除

---

## 各ステップ後にCLAUDE.mdへ追記する内容

セットアップが進むごとに少しずつ反映:

- フォルダ構成（実態に合わせて）
- スタック（package.json から読める粒度）
- 実行可能コマンド

---

## 着手前に決めたい点

明日の最初に確認:

- ポート割り当て: frontend=3000 / backend=3001 / db=5432 でいい？
- Prismaのソフトデリート: `$extends` で共通化するか、Service層で都度書くか
- frontendの状態管理: 最初はcomposablesだけ vs Piniaを最初から
