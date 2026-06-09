# DBスキーマ

PostgreSQL + Prisma を使用。

## ER図

```
User 1 ──< Transaction >── 1 Category
```

- User : Transaction = 1 : N
- Category : Transaction = 1 : N

## テーブル定義

### User

ユーザー情報。MVPではseedで1件のみ投入。論理削除対応。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | String (cuid) | PK | ユーザーID |
| email | String | UNIQUE, NOT NULL | メールアドレス |
| name | String | NOT NULL | 表示名 |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |
| deletedAt | DateTime | NULL許容 | 削除日時。NULL=有効、値あり=論理削除済み |

### Category

カテゴリマスタ。seedで初期データを投入。ユーザーによる追加は当面サポートしないが、将来的な追加・削除に備えて他テーブルと同じタイムスタンプ系カラムを揃える。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | String (cuid) | PK | カテゴリID |
| name | String | NOT NULL | カテゴリ名 |
| type | Enum (`income` / `expense`) | NOT NULL | 収入用か支出用か |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |
| deletedAt | DateTime | NULL許容 | 削除日時。NULL=有効、値あり=論理削除済み |

#### 初期データ（seed）

支出カテゴリ:
- 食費 / 交通費 / 住居費 / 光熱費 / 通信費 / 娯楽費 / 医療費 / 衣服費 / その他

収入カテゴリ:
- 給与 / 賞与 / 副業 / その他

### Transaction

取引（収支）データ。論理削除対応。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | String (cuid) | PK | 取引ID |
| userId | String | FK (User.id), NOT NULL | 所有ユーザー |
| categoryId | String | FK (Category.id), NOT NULL | カテゴリ |
| amount | Int | NOT NULL, > 0 | 金額（円・正の整数） |
| date | DateTime | NOT NULL | 取引日 |
| memo | String | NULL許容 | メモ |
| type | Enum (`income` / `expense`) | NOT NULL, DEFAULT `expense` | 収支種別。MVPでは`expense`固定 |
| isFixed | Boolean | NOT NULL, DEFAULT false | 固定費フラグ |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |
| deletedAt | DateTime | NULL許容 | 削除日時。NULL=有効、値あり=論理削除済み |

## Enum定義

```
enum TransactionType {
  income
  expense
}
```

`Category.type` と `Transaction.type` で共通利用する。

## 論理削除の運用

- 全テーブル（User / Category / Transaction）で `deletedAt` を持ち、削除は物理削除ではなく `deletedAt` に削除日時を記録する形で実装する
- 取得系クエリは原則 `deletedAt IS NULL` で絞り込む
- Prismaの拡張（`$extends`）またはService層のヘルパーでデフォルトの絞り込みを共通化する
- Categoryは現フェーズではユーザー操作による削除機能を提供しないが、スキーマは他テーブルに揃えておく

## 拡張余地

- **収入機能**: `Transaction.type` カラムを既に持っているため、UI/APIで`income`を受け付けるよう変更すれば対応可能
- **カテゴリのユーザー所有**: `Category` に `userId` (NULL許容) を追加し、NULL=共通マスタ / 値あり=ユーザー固有として運用する想定
- **タグ・繰り返し**: 別テーブルとして追加可能

## バリデーションルール

| 項目 | ルール |
|---|---|
| amount | 1以上の整数 |
| date | 未来日も許容（予定として登録するケースを想定） |
| memo | 最大255文字程度を想定 |
| categoryId | 同じ `type` のカテゴリのみ紐付け可能（Transaction.type と Category.type が一致すること） |

バリデーションはZodスキーマで定義し、フロント/バック双方で再利用する。
