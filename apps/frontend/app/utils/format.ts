// 表示用のフォーマッタ群。
// app/utils/ 配下に置くと Nuxt の自動インポート対象になり、コンポーネントから import 不要で使える。

// ISO日付文字列 → "M/D" の短縮表記。
// 一覧では年は省略する想定（家計簿は日付の視認性を優先する）。
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

// 金額 → "¥XX,XXX" の表示。
// tabular-nums クラスを当てる前提で、数値はカンマ区切りで素直に出す。
export const formatAmount = (amount: number): string => `¥${amount.toLocaleString('ja-JP')}`;
