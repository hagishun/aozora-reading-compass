# ADR Index

このプロジェクトの設計判断 (Architecture Decision Records) の一覧。

各ADRは「**この aozora-reading-compass で**何をどう決めたか」を記録する。プロジェクト横断の原則は [hagishun-handbook/principles/](https://github.com/hagishun/hagishun-handbook/tree/main/principles) を参照。

## 採択中

| ID | タイトル | ステータス | 関連handbook原則 |
|---|---|---|---|
| [ADR-0001](ADR-0001-use-aozora-csv-for-grounding.md) | 青空文庫の公開CSVをLLM推薦のgrounding sourceとする | Accepted | [llm-grounding](https://github.com/hagishun/hagishun-handbook/blob/main/principles/llm-grounding.md) |
| [ADR-0002](ADR-0002-serverless-llm-recommendation.md) | 推薦経路をサーバーレス関数経由のLLM呼び出しとする | Accepted | [llm-grounding](https://github.com/hagishun/hagishun-handbook/blob/main/principles/llm-grounding.md) |
| [ADR-0003](ADR-0003-tech-stack.md) | 技術スタックを Astro + Cloudflare Pages/Workers/Workers AI とする | Accepted | [free-tier-first](https://github.com/hagishun/hagishun-handbook/blob/main/principles/free-tier-first.md) |

## テンプレート

新しいADRを書くときは [hagishun-handbook/templates/adr-template.md](https://github.com/hagishun/hagishun-handbook/blob/main/templates/adr-template.md) をコピーする。
