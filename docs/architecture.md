# アーキテクチャ

## 技術スタック

### フロントエンド

- Nuxt 3 (Vue 3)
- TypeScript
- VeeValidate + @vee-validate/zod + Zod（フォームバリデーション）
- Nuxt標準の `$fetch` / `useFetch`（API通信）
- 必要に応じて `@tanstack/vue-query`（キャッシュ・楽観的更新が必要になった場合に導入）
- Vitest + @nuxt/test-utils + @vue/test-utils（テスト）

### バックエンド

- NestJS
- TypeScript
- Prisma（ORM）
- PostgreSQL
- nestjs-zod + Zod（バリデーション・スキーマ定義）
- Vitest（テスト）

### 共通

- Biome（フォーマッタ・リンタ）
- pnpm（パッケージマネージャ）
- Docker / docker-compose（ローカルDB）

## モノレポ構成

```
pick-cash/
├─ apps/
│  ├─ frontend/   ← Nuxt
│  └─ backend/    ← NestJS
├─ packages/
│  └─ shared/     ← フロント/バック共有の型・Zodスキーマ
├─ docs/          ← 設計ドキュメント
├─ docker-compose.yml
├─ pnpm-workspace.yaml
└─ package.json
```

pnpm workspaces で `apps/*` と `packages/*` を管理する。

## 通信パターン

フロントエンドのブラウザから直接NestJS APIを叩く構成（Pattern A）を採用する。

```
ブラウザ(Nuxt) ──$fetch──▶ NestJS API ──Prisma──▶ PostgreSQL
```

### 採用理由

- CRUDが目的のシンプルな構成のため、BFFを挟む必要性が薄い
- 馴染みがあり学習コストが低い

### 注意点

- ローカル開発時、フロント（例: `localhost:3000`）とバック（例: `localhost:3001`）でオリジンが異なるため、NestJS側でCORS設定が必要
- 認証導入時にはトークンの保持方法（HttpOnly Cookie推奨）を別途検討

## 認証方針

### 現フェーズ（MVP）

- ユーザーテーブルは作成する
- seedで仮ユーザー1名（固定ID）を投入
- バックエンドは認証ミドルウェアで `req.userId` に仮ユーザーのIDを注入
- フロントエンドはログイン済み想定で動作

### 将来フェーズ

- Better Auth等の認証ライブラリを導入
- 既存の認証ミドルウェアを差し替える形で対応可能にしておく

## エラーハンドリング方針

### バックエンド

- 詳細なエラー情報は `console.error` で出力（スタックトレース・原因を含む）
- HTTPレスポンスは汎用的なメッセージとステータスコードのみ返す
  - 例: `400 { message: 'Bad Request' }` / `500 { message: 'Internal Server Error' }`
- NestJSのGlobalExceptionFilterで統一的に処理する
- 業務例外は個別の例外クラスに分け、Filter側でステータスコードへマップする

### フロントエンド

- APIエラーは握りつぶさず、UI（トースト等）でユーザーに通知する
- 詳細はコンソールに出力する

## ディレクトリレイヤー構成

### バックエンド（NestJS）

機能ごとにModuleを作成し、各Module配下にレイヤー別ファイルを配置する。

```
apps/backend/src/
├─ main.ts
├─ app.module.ts
├─ common/                  ← 横断的関心事
│  ├─ filters/              ← GlobalExceptionFilter等
│  ├─ middlewares/          ← 認証ミドルウェア等
│  └─ pipes/                ← Zodバリデーションパイプ等
├─ prisma/                  ← PrismaService
└─ modules/
   ├─ transactions/
   │  ├─ transactions.module.ts
   │  ├─ transactions.controller.ts
   │  ├─ transactions.service.ts
   │  ├─ transactions.repository.ts
   │  └─ transactions.dto.ts
   └─ categories/
      ├─ categories.module.ts
      ├─ categories.controller.ts
      ├─ categories.service.ts
      └─ categories.repository.ts
```

レイヤー責務:

- **Controller**: HTTPエンドポイントの定義、リクエスト/レスポンスの変換のみ。ビジネスロジック禁止
- **Service**: ビジネスロジックを担う。DB操作は直接Prismaを呼ばずRepositoryに委譲する
- **Repository**: PrismaClientを経由したDB操作を集約。論理削除フィルタ（`deletedAt IS NULL`）の強制もここで行う
- **DTO**: リクエスト/レスポンスの型・Zodスキーマ
- **Module**: 機能単位のDIコンテナ

#### Repository層を入れる理由

- Prismaは型安全だが、ServiceにPrismaを直接書くと「論理削除フィルタの付け忘れ」「複雑なクエリの散在」が起きやすい
- Repositoryに集約することで、Serviceは「業務ロジックだけ」「DBの具体に依存しない」状態を保ちやすくなる
- Repositoryをモックすればテストが軽くなる（Prismaを立ち上げずService単体テスト可能）

#### Repositoryの実装方針

- クラスベース（`@Injectable()`）で実装し、`PrismaService` をコンストラクタで注入
- 取得系メソッドは原則 `deletedAt: null` でフィルタする
- 削除メソッドは物理削除ではなく `deletedAt` に削除日時をセット
- 共通の論理削除フィルタは、必要に応じてヘルパー関数または基底クラスで共通化する（最初は素直に各Repositoryで書いて、重複が出てから抽出）

### フロントエンド（Nuxt）

```
apps/frontend/
├─ pages/                   ← ルーティング
├─ components/              ← UI部品（PascalCase）
├─ composables/             ← ロジック再利用（useXxx）
├─ stores/                  ← Pinia（必要になったら）
├─ utils/                   ← 汎用ユーティリティ
├─ types/                   ← フロント固有の型
└─ assets/                  ← スタイル・画像
```

API呼び出しは composables に集約し、pages/components から直接 `$fetch` を呼ばない。

### 共有パッケージ

```
packages/shared/src/
├─ schemas/                 ← Zodスキーマ（Transaction等）
└─ types/                   ← 型定義（z.infer から導出）
```

フロント/バックの両方から `import` できるようにする。
