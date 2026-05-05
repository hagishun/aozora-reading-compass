# ADR-0003: 技術スタックを Astro + Cloudflare Pages/Workers/Workers AI とする

- Status: Accepted
- Date: 2026-05-05
- 関連handbook原則: [free-tier-first](https://github.com/hagishun/hagishun-handbook/blob/main/principles/free-tier-first.md)

## Context

[ADR-0002](ADR-0002-serverless-llm-recommendation.md) で「推薦経路はサーバーレス関数経由のLLM呼び出し」と決定した。これを実装する具体的なホスティング・フロント・LLMプロバイダを選定する必要がある。

選定の前提:

- README の「やらないこと」で課金・アカウント・大規模Web化を禁じているため、**個人OSS実験として無料枠で完結する** ことが必須
- LinkedIn 公開を見据え、初訪問者がキー入力等の準備なしで AI 体験できること
- フロント・サーバーレス関数・LLMが**1つのプラットフォーム**で完結する方が、シークレット管理・CORS・デプロイの摩擦が少ない
- LLMは「リストから選ばせる」grounding 前提（ADR-0001）なので、文学的ニュアンスの精度よりも**指示追従と速度**を優先できる

## Decision

以下のスタックを採用する:

- **ホスティング**: Cloudflare Pages（静的配信） + Cloudflare Workers（API）
- **LLM**: Cloudflare Workers AI、初期モデルは `@cf/meta/llama-3.1-8b-instruct`
- **フロントフレームワーク**: Astro
- **Rate limit / 状態管理**: Cloudflare KV または Workers Rate Limiting API
- **LLMプロバイダ抽象化**: Workers 関数内に薄いインターフェース層を置き、後から Gemini / OpenRouter 等に差し替えられるようにする

## Alternatives

### ホスティング
- **Vercel + Vercel Functions**
  - 却下理由: 無料枠は十分だが、LLM を使うには別途 OpenAI 等のキー管理が必要。Cloudflare に寄せた方がワンプラットフォームで完結する
- **Netlify Functions**
  - 却下理由: 同上。かつ edge ランタイムの選択肢が CF より弱い

### LLM プロバイダ
- **Google Gemini API (Flash)**
  - 却下理由: 無料枠は厚く日本語精度も高いが、別プラットフォームのキー管理が必要。比較対象として後から追加する候補に残す
- **Groq (Llama 3.3 70B 等)**
  - 却下理由: 速度は魅力だが、キー管理 + rate limit が別プラットフォーム管理になる。比較対象として後から追加可能
- **OpenAI / Anthropic 有料API**
  - 却下理由: 無料枠縛りに反する。LinkedIn からの想定外バーストでキーが燃えるリスクが高い

### フロントフレームワーク
- **素のHTML + JS**
  - 却下理由: 軽量だが、後から state 管理や複数ページに育てるときに自分で土台を作り直すことになる
- **Next.js / SvelteKit**
  - 却下理由: オーバースペック。本プロジェクトは数ページ規模の静的サイトに API を1本つけるだけ
- **Astro**
  - 採用理由: 静的優先 + 必要箇所だけ islands でJS。学習コスト低、Cloudflare Pages に公式対応、見た目のシンプルさが「読書」テーマと相性が良い

## Consequences

### 良いこと
- すべて Cloudflare 1社のダッシュボードで完結する（ログ・シークレット・デプロイ・課金状況）
- 無料枠内で LinkedIn 公開直後のバーストにも耐えられる想定
- Workers AI なら API キー管理不要（`env.AI.run()` で呼べる）
- フロントは Astro なので、後から記事ページ・ADR 紹介ページ等を追加しやすい

### 悪いこと / 制約
- Cloudflare に強くロックインされる（脱出時はホスティング・LLM・KV をすべて移す必要がある）
- Llama 3.1 8B の日本語精度は GPT-4 / Claude Sonnet クラスより低い。grounding で殺せるとはいえ、`reason` 文の質には限界がある
- Workers の実行時間制限（CPU time）に LLM レイテンシが収まる前提で組む必要がある

### 今後の縛り
- 新しい依存を入れるときは、まず「Cloudflare のサービスで代替できないか」を確認する
- LLM プロバイダを追加する場合も、Workers 関数内の抽象化層を経由する（フロントから直接叩かない）
- モデル変更（8B → 別モデル）は ADR を改訂せず、Decision セクションの「初期モデル」記述を更新するに留める。プロバイダ自体の変更は新ADRを起こす

## 改訂履歴

- 2026-05-05: 初版
