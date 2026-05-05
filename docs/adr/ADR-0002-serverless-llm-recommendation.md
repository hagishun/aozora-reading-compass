# ADR-0002: 推薦経路をサーバーレス関数経由のLLM呼び出しとする

- Status: Accepted
- Date: 2026-05-05
- 関連handbook原則: [llm-grounding](https://github.com/hagishun/hagishun-handbook/blob/main/principles/llm-grounding.md)

## Context

[ADR-0001](ADR-0001-use-aozora-csv-for-grounding.md) で「推薦は実在リストでgroundingする」ことは決めたが、**LLMをいつ・どこで呼ぶか** は未決定だった。

本プロジェクトは [README](../../README.md) の「やらないこと」でアカウント・課金・大規模Web化を禁じている一方、LinkedIn 等で公開してエンジニア読者に見せる以上、**「AIが効いている体験」が一発で伝わる導線** が必要。ルールベースだけのフィルタでは「ただのタグ検索」に見えてしまい、プロジェクトの主題（AI×OSSで文化資産アクセスを滑らかにする）が伝わらない。

同時に、LLM呼び出しは以下の地雷を抱える:
- APIキーの保護（フロントに置けない）
- 公開URLゆえの濫用リスク（rate limit 必須）
- レイテンシ（数秒待つUX）
- LLM応答の grounding 整合（リスト外作品の幻覚）

これらをどう扱うかで、配布形態とコスト構造が大きく変わる。

## Decision

**推薦経路を Cloudflare Workers 上のサーバーレス関数に置き、Workers AI 経由でLLMを呼ぶ。リスト照合・rate limit・fallback はすべて関数側で行う。**

具体的には:

- フロント (Cloudflare Pages) は state / 任意の自由記述を受け、`/api/pick` を叩くだけ
- Workers 関数が `data/works.yml`（初期は27件）を context に LLM呼び出し
- LLM応答を works.yml に照合し、リスト外なら最大2回までリトライ
- 全部外れたら works.yml からルールベースで1件選んで返す（graceful degradation）
- IP単位の日次クォータで rate limit
- 応答には `reason`（LLM生成の3行コメント）と `fallback: bool` を含める

## Alternatives

- **案B1: BYOK（フロントから直接LLM）**
  - 却下理由: 訪問者にAPIキー入力を強いると離脱率が高く、LinkedIn からの初訪問者にAI体験を届けられない。「やらないこと」で禁じたアカウント機能ではないが、実質同等の摩擦が出る
- **案B2: 事前生成型（Actionsで日次バッチ→静的JSON配信）**
  - 却下理由: コストとリアルタイム性は最良だが、ハマりどころが少なく学びが薄い。本プロジェクトはOSS実験という位置付けであり、「サーバーレス＋公開LLM＋認証なし」の地雷を踏んで知見化することの方が価値が高い。将来の負荷削減策として B2 を後段で組み合わせる余地は残す
- **案: ルールベースのみ（LLMを呼ばない）**
  - 却下理由: 公開時の主題訴求が弱い。最初のスライスでは内部fallbackとして使うが、表向きの推薦はLLM経由を主とする

## Consequences

### 良いこと
- LinkedIn 等への公開時に「ボタン1つでAI推薦が出る」体験を提供できる
- サーバーレス関数の rate limit / シークレット管理 / grounding 照合 / graceful degradation という、実運用で必須の課題を一通り経験できる
- フロントは静的のままなので、Cloudflare Pages の無料枠で配信可能

### 悪いこと / 制約
- Workers AI の無料枠（日次10,000 Neurons）を超えた場合の挙動を設計する必要がある（ルールベース fallback で吸収）
- LLM応答のレイテンシ（数秒）UXを設計する必要がある
- 濫用対策（rate limit, Turnstile等）を継続的にメンテする責任が生じる

### 今後の縛り
- 推薦経路を新設する場合も、必ず Workers 関数を経由しリスト照合を通す（フロント直叩きは禁止）
- LLM応答は必ず `data/works.yml` または青空文庫CSVに照合してから返す（ADR-0001 の縛りを継承）
- LLMが落ちている / クォータ切れ / 全リトライ失敗の3ケースで、必ずルールベースfallbackに落ちる設計を維持する

## 改訂履歴

- 2026-05-05: 初版
