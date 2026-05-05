# Copilot Instructions — aozora-reading-compass

このリポジトリで Copilot / Claude などのAIエージェントが作業するときの指針。

## このプロジェクトの目的

青空文庫の作品の中から「今日の自分に合う一冊」に出会うための発見導線を、AIと制約付き推薦で提供するOSS実験。本文は青空文庫へのリンクのみを扱う。

## 設計判断 (ADR)

- 設計判断は [`docs/adr/`](../docs/adr/) に格納している
- 実装前に関連ADRを確認すること
- ADRに反する実装をする場合は、先にADRのステータスを更新すること
- ADR一覧は [`docs/adr/INDEX.md`](../docs/adr/INDEX.md) を参照

## 関連ナレッジ (handbook)

- 横断原則は `../hagishun-handbook/principles/` を参照
  （VS Code Multi-root Workspace に同居している場合のみ。なければスキップ）
- 公開URL: https://github.com/hagishun/hagishun-handbook
- 各ADRは関連する handbook 原則をヘッダで明示している。原則に従うこと

## このプロジェクト特有のルール

- 青空文庫の本文を自前ホスティング・自前表示しない（リンクのみ）
- 推薦は実在リストでgroundingする（[ADR-0001](../docs/adr/ADR-0001-use-aozora-csv-for-grounding.md)）
- 著作権保護期間が満了した作品のみを扱う
- スクレイピングは最小限。青空文庫運営にトラフィック負荷をかけない
- 課金・アカウント機能・大規模Webアプリ化はやらない（README「やらないこと」参照）

## 書くべきでないコード

- 青空文庫本文の取得・要約・再配布
- LLMが推薦した作品をリスト照合せずそのまま提示する処理
- ユーザーアカウント・課金・SNS機能

## トーン

- READMEや公開ドキュメントは技術者にも文学好きにも読めるトーン
- 押しつけがましくない、実験としての謙虚さ
- 過度な誇張や「革命的」のような語は避ける
