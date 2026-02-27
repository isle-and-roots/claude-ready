# claude-ready — Plans.md

> "Type one command. Start building with AI."

## Status Summary

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Done | Monorepo scaffolding (Turborepo + pnpm) |
| Phase 1 | ✅ Done | Core CLI flow (7 steps, i18n, security, tests) |
| Phase 2 | ✅ Done | Polish + Community features + FinanceOps |
| Phase 3 | 🔲 Planned | Landing page + npm publish + GitHub公開 |
| Phase 4 | 🔲 Future | GUI app (Tauri) + /setup skill + 拡張 |

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
- [ ] **website/ ディレクトリ初期化**
  - Astro 5 プロジェクトセットアップ
  - pnpm-workspace.yaml に追加済み
- [ ] **ヒーローセクション**
  - 「npx claude-ready」のコピー可能コードブロック
  - 3ステップ説明（Experience → API Key → Build）
  - Claude amber (#D97757) ブランドカラー
- [ ] **機能セクション**
  - Zero-Decision Setup / Security / i18n / Community
- [ ] **Vercel デプロイ設定**
  - vercel.json 作成
  - プレビューデプロイ確認

### 3.2 npm Publish 準備
- [ ] **package.json 最終調整** `[feature:security]`
  - repository, homepage, bugs フィールド追加
  - keywords 最適化
  - engines: { node: ">=18" } 追加
- [ ] **npm pack 検証**
  - パッケージサイズ 200KB 以下確認（現在 8.4KB ✓）
  - dist/ 内容の確認
  - LICENSE, README.md 含まれること確認
- [ ] **npx 動作テスト**
  - ローカルで `npm link` → `npx claude-ready` 実行
  - 全フローのE2Eウォークスルー

### 3.3 GitHub リリース
- [ ] **GitHub リポジトリ作成**
  - gh repo create claude-ready --public
  - main ブランチ push
- [ ] **GitHub Actions CI 動作確認**
  - push 後に CI グリーン確認
- [ ] **v0.1.0 リリース**
  - git tag v0.1.0
  - npm publish
  - GitHub Release 作成（CHANGELOG 付き）

---

## Phase 4: GUI + 拡張 (Post-MVP)

### 4.1 Tauri v2 macOS アプリ
- [ ] packages/gui/ ディレクトリ初期化 (Tauri v2 + React)
- [ ] CLI と同じ CX フローを GUI で実装
- [ ] ~5MB ネイティブアプリとしてビルド
- [ ] DMG/pkg インストーラー作成

### 4.2 /setup スラッシュコマンド
- [ ] packages/skill/SKILL.md 作成
  - 既存 Claude Code ユーザー向け環境最適化
  - セキュリティ設定の適用
  - CLAUDE.md テンプレートの選択・適用

### 4.3 プラットフォーム拡張
- [ ] Windows 対応 (env-checks, install ロジック)
- [ ] Linux 対応
- [ ] 1Password / AWS Secrets Manager 連携

### 4.4 コミュニティ拡張
- [ ] リーダーボード機能
- [ ] テンプレートマーケットプレイス
- [ ] チームオンボーディングモード

---

## Feature Priority Matrix

| Priority | Feature | Phase | Effort |
|----------|---------|-------|--------|
| **Required** | Experience level differentiation | 2.1 | S |
| **Required** | Error handling 強化 | 2.1 | S |
| **Required** | npm publish + npx 動作確認 | 3.2 | S |
| **Required** | GitHub リリース | 3.3 | S |
| **Recommended** | FinanceOps コスト計算 | 2.2 | M |
| **Recommended** | /learn 学習ジャーニー | 2.3 | M |
| **Recommended** | Landing page | 3.1 | M |
| **Recommended** | --share クリップボードコピー | 2.3 | S |
| **Optional** | Meetup リモート連携 | 2.3 | S |
| **Optional** | Tauri GUI | 4.1 | L |
| **Optional** | /setup skill | 4.2 | M |
| **Optional** | Windows/Linux 対応 | 4.3 | L |

**Effort**: S = 〜1h, M = 2〜4h, L = 1日+

---

## Technical Debt & Quality

- [ ] CLI integration test（実際の npx 実行をモック付きで E2E テスト）
- [x] `--dry-run` フラグ（ファイル書き込みをスキップしてフロー確認）
- [x] shared パッケージの 100% テストカバレッジ確認
- [x] TypeScript strict mode の lint エラー 0 件確認
