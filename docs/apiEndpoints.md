# API エンドポイント

NestJSが提供するREST APIの仕様。ベースURLは開発環境で `http://localhost:3001` を想定。

## 認証

- MVPでは認証ミドルウェアで仮ユーザーIDをリクエストに注入する
- 将来Better Auth等で本実装に置き換える
- 各エンドポイントは `req.userId` を前提に動作する

## 共通仕様

### レスポンス形式

ステータスはHTTPステータスコードで表現し、ボディには重複させない。

成功時:

```json
{ "data": <任意の構造> }
```

削除（204）など、ボディを持たないレスポンスもある。

エラー時:

```json
{ "message": "汎用メッセージ" }
```

詳細なエラー情報はサーバー側のログ（`console.error`）にのみ出力する。

### ステータスコード

| コード | 用途 |
|---|---|
| 200 | 取得・更新成功 |
| 201 | 作成成功 |
| 204 | 削除成功（ボディなし） |
| 400 | バリデーションエラー |
| 401 | 認証エラー（将来用） |
| 404 | リソース未存在 |
| 500 | サーバー内部エラー |

## エンドポイント一覧

### Transaction

#### `GET /transactions`

ログインユーザーの取引一覧を取得。日付降順。

クエリパラメータ（任意）:

| パラメータ | 型 | 説明 |
|---|---|---|
| type | `income` / `expense` | 種別での絞り込み |
| isFixed | `true` / `false` | 固定/変動での絞り込み |
| from | ISO日付 | 期間開始 |
| to | ISO日付 | 期間終了 |

レスポンス:

```json
{
  "data": [
    {
      "id": "...",
      "amount": 1200,
      "date": "2026-06-01T00:00:00.000Z",
      "memo": "ランチ",
      "type": "expense",
      "isFixed": false,
      "category": { "id": "...", "name": "食費", "type": "expense" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### `GET /transactions/:id`

取引の詳細取得。他ユーザーの取引にアクセスした場合は404を返す。

#### `POST /transactions`

取引の新規作成。

リクエストボディ:

```json
{
  "amount": 1200,
  "date": "2026-06-01",
  "memo": "ランチ",
  "type": "expense",
  "isFixed": false,
  "categoryId": "..."
}
```

レスポンス: `201` + 作成された取引

#### `PATCH /transactions/:id`

取引の部分更新。リクエストボディは作成時の全項目が任意。

レスポンス: `200` + 更新後の取引

#### `DELETE /transactions/:id`

取引の削除。物理削除ではなく論理削除（`deletedAt` に削除日時を記録）を行う。

レスポンス: `204`

### Category

#### `GET /categories`

カテゴリマスタの一覧取得。

クエリパラメータ（任意）:

| パラメータ | 型 | 説明 |
|---|---|---|
| type | `income` / `expense` | 種別での絞り込み |

レスポンス:

```json
{
  "data": [
    { "id": "...", "name": "食費", "type": "expense" }
  ]
}
```

## バリデーション

- リクエスト/レスポンスのZodスキーマは `packages/shared` で定義し、フロント/バック双方で利用する
- バリデーション失敗時は `400` + 汎用メッセージを返す（詳細はサーバーログに出力）

## 将来追加予定

- `POST /auth/login` 等の認証系
- `GET /transactions/summary` 等の集計系
- `POST /categories` 等のユーザー固有カテゴリ管理系
