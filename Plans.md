# claude-ready — Plans.md

> "Type one command. Start building with AI."

## Status Summary

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Done | Monorepo scaffolding (Turborepo + pnpm) |
| Phase 1 | ✅ Done | Core CLI flow (7 steps, i18n, security, tests) |
| Phase 2 | ✅ Done | Polish + Community features + FinanceOps |
| Phase 3 | ✅ Done | Landing page + npm publish + GitHub公開 |
| Phase 3.5 | ✅ Done | Multi-Auth Support（認証方法の多様化） |
| Phase 5.1 | ✅ Done | README + ブランディング刷新 |
| Phase 5.2 | ✅ Done | Hooks プリセット |
| Phase 5.3 | 🔲 TODO | Tauri v2 デスクトップアプリ |
| Phase 5.4 | 🔲 TODO | MCP 推奨セットアップ |
| Phase 5.5 | 🔲 TODO | Skills プリセット |
| Phase 5.6 | 🔲 TODO | Windows/Linux 対応 |

---

## Phase 2: Polish + Community + FinanceOps

### 2.1 CLI Polish & Experience Level Differentiation
- [x] **Beginner mode: 追加説明の挿入** `[feature:a11y]`
  - welcome.ts で level='beginner' 時にターミナルの使い方を補足表示
  - env-check.ts で「Node.js とは何か」の1行説明
  - api-key.ts でスクリーンショット付き手順（テキスト版）
- [x] **Express mode: スキップロジック**
  - level='advanced' 時に確認プロンプトを最小化
  - 環境チェック結果をまとめて1行表示
- [x] **エラーハンドリング強化** `[feature:tdd]`
  - Node.js 未インストール時の案内メッセージ
  - ネットワークエラー時のリトライ/オフライン案内
  - API キー検証失敗時の具体的エラーメッセージ

### 2.2 FinanceOps（コスト管理）
- [x] **コスト計算ロジック** `[feature:tdd]`
  - packages/shared/src/finance.ts 新規作成
  - トークン使用量の概算計算関数
  - 日次/月次予算の設定・読み込みロジック
- [x] **`/cost` コマンド相当の表示**
  - `npx claude-ready --cost` フラグ追加
  - 累計コスト・予算残の表示 UI
- [x] **段階的コスト通知ロジック**
  - $5 超過: 料金の仕組みを通知
  - $20 超過: 日次予算設定を提案

### 2.3 Community Features
- [x] **`--share` の強化**
  - 実際の projectType と setup 時間を反映
  - クリップボードコピー機能（pbcopy 連携）
- [x] **/learn 学習ジャーニー**
  - packages/cli/src/steps/learn.ts 新規作成
  - 5段階レベル表示（Setup → First Build → Custom Commands → Advanced → Contributor）
  - 進捗の永続化（~/.claude-ready/progress.json）
- [x] **Meetup 連携**
  - リモート JSON からイベント情報取得
  - `npx claude-ready --events` フラグ
  - フォールバック: ハードコード値

### 2.4 i18n 拡張
- [x] **翻訳カバレッジ 100%**
  - エラーメッセージの多言語化
  - FinanceOps メッセージの多言語化
  - /learn メッセージの多言語化

---

## Phase 3: Landing Page + Release

### 3.1 Landing Page (Astro)
- [x] **website/ ディレクトリ初期化**
  - Astro 5 プロジェクトセットアップ
  - pnpm-workspace.yaml に追加済み
- [x] **ヒーローセクション**
  - 「npx claude-ready」のコピー可能コードブロック
  - 3ステップ説明（Experience → API Key → Build）
  - Claude amber (#D97757) ブランドカラー
- [x] **機能セクション**
  - Zero-Decision Setup / Security / i18n / Community
- [x] **Vercel デプロイ設定**
  - vercel.json 作成
  - プレビューデプロイ確認

### 3.2 npm Publish 準備
- [x] **package.json 最終調整** `[feature:security]`
  - repository, homepage, bugs フィールド追加
  - keywords 最適化
  - engines: { node: ">=18" } 追加
- [x] **npm pack 検証**
  - パッケージサイズ 200KB 以下確認（CLI: 8.2KB, shared: 14.0KB ✓）
  - dist/ 内容の確認
  - LICENSE, README.md 含まれること確認
- [x] **npx 動作テスト**
  - ローカルで `npm link` → `npx claude-ready` 実行
  - 全フローのE2Eウォークスルー

### 3.3 GitHub リリース
- [x] **GitHub リポジトリ作成**
  - gh repo create isle-and-roots/claude-ready --public
  - main ブランチ push
- [x] **GitHub Actions CI 動作確認**
  - Node 20 + 22 で CI グリーン確認
- [x] **v0.1.0 リリース**
  - git tag v0.1.0
  - GitHub Release 作成（CHANGELOG 付き）

---

## Phase 3.5: Multi-Auth Support（認証方法の多様化）

> **背景**: 現在の CLI は API キー（`sk-ant-`）のみ対応。Claude Code は Pro/Max サブスクリプション、Teams/Enterprise、Cloud Provider（Bedrock, Vertex AI, Foundry）にも対応しており、これらを CLI と手順書の両方でカバーする。

### 3.5.1 CLI: 認証ステップのリファクタリング `[feature:security]`

**対象ファイル**: `packages/cli/src/steps/api-key.ts` → `auth.ts` にリネーム

- [x] **認証方法の選択 UI 追加**
  - Step 4 を「API キー設定」から「認証設定」に変更
  - `@clack/prompts` の `select` で以下を表示:
    1. サブスクリプション（Pro / Max）— `claude login` で認証
    2. API キー（従量課金）— 現在のフロー
    3. Teams / Enterprise — 管理者からの招待 + `claude login`
    4. Cloud Provider（Bedrock / Vertex AI / Foundry）— 環境変数設定ガイド
  - Beginner モードでは各選択肢に1行の説明を追加

- [x] **サブスクリプション認証フロー（新規）**
  - `claude login` の存在確認（`which claude`）→ 未インストール時は Step 3 に戻す
  - `execSync('claude login')` を実行（ブラウザが自動で開く）
  - 認証成功後、`.env` に `ANTHROPIC_API_KEY` を書き込まない（サブスクリプション利用のため）
  - **競合検出**: 既存の `ANTHROPIC_API_KEY` が `.env` にある場合は警告を表示
    - 「API キーが設定されています。サブスクリプションを使用する場合は `.env` から `ANTHROPIC_API_KEY` を削除してください」
    - 削除するかどうかを `confirm` で確認

- [x] **Teams / Enterprise フロー（新規）**
  - 管理者招待の案内テキスト表示
  - `claude login` を実行（サブスクリプションと同じブラウザ認証）
  - 認証後に組織名を確認表示

- [x] **Cloud Provider フロー（新規）**
  - Bedrock / Vertex AI / Foundry の選択 UI
  - 必要な環境変数の一覧表示（設定手順ガイド）
  - 実際の環境変数設定は手動（ユーザーに委任）
  - Bedrock: `CLAUDE_CODE_USE_BEDROCK=1`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - Vertex AI: `CLAUDE_CODE_USE_VERTEX=1`, `CLOUD_ML_REGION`, `ANTHROPIC_VERTEX_PROJECT_ID`
  - `.env` への書き込みはユーザー確認後

- [x] **既存 API キーフローの維持**
  - 現在の `sk-ant-` バリデーション + `.env` 書き込みはそのまま
  - リファクタリングしてサブ関数に分離

### 3.5.2 i18n: 認証関連メッセージ追加

**対象ファイル**: `packages/shared/src/i18n.ts`

- [x] **I18nMessages 型に `auth` セクション追加**
  ```typescript
  auth: {
    methodQuestion: string;        // "認証方法を選択してください"
    subscription: string;          // "サブスクリプション (Pro / Max)"
    subscriptionDesc: string;      // "月額定額制。claude.com で契約済みの方"
    apiKey: string;                // "API キー（従量課金）"
    apiKeyDesc: string;            // "Anthropic Console で API キーを発行して使用"
    teams: string;                 // "Teams / Enterprise"
    teamsDesc: string;             // "組織の管理者から招待を受けた方"
    cloudProvider: string;         // "Cloud Provider (Bedrock / Vertex AI)"
    cloudProviderDesc: string;     // "AWS / Google Cloud 経由で利用"
    loginRunning: string;          // "ブラウザで認証しています..."
    loginSuccess: string;          // "認証に成功しました！"
    loginFailed: string;           // "認証に失敗しました"
    apiKeyConflict: string;        // "API キーが検出されました。サブスクリプション..."
    removeApiKey: string;          // ".env から ANTHROPIC_API_KEY を削除しますか？"
    teamsInviteGuide: string;      // "管理者に招待してもらってください"
    cloudProviderSelect: string;   // "クラウドプロバイダーを選択"
    cloudProviderEnvGuide: string; // "以下の環境変数を設定してください"
    beginnerAuthGuide: string[];   // 初心者向け認証方法の比較解説
  }
  ```
- [x] **EN / JA の翻訳追加**（各20メッセージ程度）

### 3.5.3 手順書の更新

**対象ファイル**: `docs/guide-ja.md`

- [x] **前提条件セクション更新**
  - 「Anthropic アカウント」を「認証方法に応じたアカウント」に変更
  - 認証方法の比較表追加（方法、料金体系、対象者、必要なもの）

- [x] **Step 4 を全面書き換え**
  - タイトルを「API キー設定」→「認証設定」に変更
  - 4 つの認証パスそれぞれの手順を詳述:
    - **方法 A: サブスクリプション（Pro / Max）**: 料金プラン比較、`claude login` 手順、競合注意
    - **方法 B: API キー**: 現行の手順（ほぼ変更なし）
    - **方法 C: Teams / Enterprise**: 管理者招待フロー、Teams vs Enterprise の違い
    - **方法 D: Cloud Provider**: Bedrock / Vertex AI / Foundry の環境変数一覧
  - 認証方法の選び方フローチャート（テキスト図）

- [x] **FAQ セクション追加**
  - Q: サブスクリプションと API キーの違いは？
  - Q: サブスクリプションなのに課金されている
  - Q: Teams アカウントの招待方法
  - Q: Cloud Provider の認証が通らない

- [x] **セキュリティ情報セクション追加**
  - `ANTHROPIC_API_KEY` と サブスクリプション認証の優先順位
  - Cloud Provider 認証情報の取り扱い注意

### 3.5.4 テスト更新

**対象ファイル**: `packages/cli/src/__tests__/steps.test.ts`, `packages/shared/src/__tests__/i18n.test.ts`

- [x] **認証選択のユニットテスト追加**
  - サブスクリプション選択時のフロー
  - API キー選択時のフロー（既存テスト維持）
  - API キー競合検出テスト
  - Cloud Provider 選択時のフロー
  - キャンセル時の UserCancelledError テスト
- [x] **i18n テスト更新**
  - `auth` セクションの翻訳存在確認（EN/JA）

### 3.5.5 PDF 再生成 + Release 更新

- [x] `pnpm docs:pdf` で PDF を再生成
- [x] `gh release upload v0.1.0 docs/guide-ja.pdf --clobber` で上書き

---

### Phase 3.5 Feature Priority Matrix

| Priority | Feature | Section | Effort |
|----------|---------|---------|--------|
| **Required** | 認証方法選択 UI | 3.5.1 | M |
| **Required** | サブスクリプション認証フロー | 3.5.1 | M |
| **Required** | 手順書 Step 4 全面書き換え | 3.5.3 | M |
| **Required** | i18n メッセージ追加 | 3.5.2 | S |
| **Recommended** | API キー競合検出・警告 | 3.5.1 | S |
| **Recommended** | Teams / Enterprise フロー | 3.5.1 | S |
| **Recommended** | FAQ 追加 | 3.5.3 | S |
| **Optional** | Cloud Provider フロー | 3.5.1 | M |
| **Optional** | Cloud Provider 環境変数設定ガイド | 3.5.3 | S |
| **Required** | テスト更新 | 3.5.4 | S |
| **Required** | PDF 再生成 + Release 更新 | 3.5.5 | S |

**Effort**: S = ~1h, M = 2~4h

### 実行順序

```
3.5.2 (i18n 型定義・メッセージ)
  ↓
3.5.1 (CLI 認証ステップ)
  ↓
3.5.4 (テスト)
  ↓
3.5.3 (手順書更新)
  ↓
3.5.5 (PDF + Release)
```

i18n を先に定義 → CLI が参照 → テストで検証 → 手順書で説明 → PDF 配布の順。

---

## Phase 5: Secure Claude Code Onboarding Kit

### 5.1 README + ブランディング刷新 (P0) ✅
- [x] README.md 全面書き換え (Onboarding Kit ポジショニング、Trust セクション)
- [x] docs/TRUST.md 作成 (透明性ドキュメント)
- [x] website index.astro 更新 (Hooks/MCP カード追加)

### 5.2 Hooks プリセット (P0) ✅
- [x] hooks.ts — 5プリセット定義 + 生成ロジック (auto-format, safe-commit, dangerous-cmd-block, cost-tracker, notification)
- [x] security.ts 拡張 — hooks パラメータ追加 (後方互換維持)
- [x] i18n.ts — hooks セクション EN/JA 追加
- [x] CLI hooks ステップ — multiselect UI + securityStep 統合
- [x] hooks.test.ts — 20テスト (プリセット生成、マージ、プラットフォーム別通知)
- [x] pnpm build + test 全222テスト通過

### 5.3 Tauri v2 デスクトップアプリ (P1) `cc:TODO`
- [ ] packages/gui/ 初期化 (Tauri v2 + React)
- [ ] src-tauri/ Rust バックエンド (shell plugin → @claude-ready/shared)
- [ ] src/ React フロントエンド (8ステップコンポーネント)
- [ ] lib/bridge.ts (Tauri invoke() ラッパー)
- [ ] ステップフロー UI (Welcome → Env → Install → Auth → Hooks → Security → Project → Complete)
- [ ] macOS DMG ビルド設定
- [ ] テスト + 統合検証

### 5.4 MCP 推奨セットアップ (P1) `cc:TODO`
- [ ] packages/shared/src/mcp.ts — MCP プリセット定義 (sequential-thinking, filesystem, github, memory, fetch)
- [ ] .mcp.json 生成ロジック
- [ ] CLI MCP 選択ステップ (packages/cli/src/steps/mcp.ts)
- [ ] i18n MCP メッセージ追加
- [ ] mcp.test.ts テスト

### 5.5 Skills プリセット (P2) `cc:TODO`
- [ ] packages/skill/SKILL.md — /setup スキル作成
- [ ] セキュリティ設定適用フロー
- [ ] CLAUDE.md テンプレート選択・適用
- [ ] テスト

### 5.6 Windows/Linux 対応 (P2) `cc:TODO`
- [ ] env-checks.ts プラットフォーム拡張 (Windows/Linux 検出)
- [ ] install.ts — winget / apt 対応
- [ ] hooks.ts — プラットフォーム別コマンド検証
- [ ] notification — Windows toast / Linux notify-send 実テスト
- [ ] CI マトリクス追加 (ubuntu-latest, windows-latest)
- [ ] テスト
