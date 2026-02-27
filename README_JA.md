# claude-ready

[![npm](https://img.shields.io/npm/v/claude-ready)](https://www.npmjs.com/package/claude-ready)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)]()

**Claude Code のセットアップを3分で。設定不要、セキュリティは最初から。**

> 🇺🇸 English version: [README.md](README.md)

---

## これは何？

**[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** は、Anthropic が開発したAIコーディングアシスタントです。ターミナル（黒い画面）の中で動作し、あなたの代わりにコードを書いたり、バグを修正したりします。

セットアップには、APIキーの設定・セキュリティルールの適用・プロジェクト構成の準備が必要で、通常は知識と時間が必要です。

**claude-ready** はそれを自動化します。3つの質問に答えるだけで、数分後にはAIで開発を始められます。

---

## インストール

### macOS — デスクトップアプリ（初心者におすすめ）

ターミナルの操作が不要です。ビジュアルなウィザード形式でセットアップできます。

```bash
curl -fsSL https://raw.githubusercontent.com/isle-and-roots/claude-ready/main/install.sh | bash
```

> **手動インストールの場合**: [Releases](https://github.com/isle-and-roots/claude-ready/releases/latest) から `.dmg` をダウンロード後、以下を実行してから開いてください:
> ```bash
> xattr -dr com.apple.quarantine ~/Downloads/"Claude.Ready_0.1.0_aarch64.dmg"
> ```
> Windows (.exe) と Linux (.AppImage) も Releases ページからダウンロードできます。

### CLI — 全プラットフォーム対応

```bash
npx claude-ready
```

---

## 使い方

```
1. 3つの質問に答える  →   経験レベル・認証方法・プロジェクト種別
2. claude-ready が実行  →   設定ファイル生成・15個のセキュリティルール適用・フック設定
3. 開発スタート       →   プロジェクトフォルダを開いて `claude` を実行するだけ
```

たったこれだけです。所要時間は約3分です。

---

## 機能

- 🚀 **ゼロ設定セットアップ** — 3つの質問だけ。3分で完了
- 🔒 **最初からセキュア** — 15個のセキュリティルールを自動適用
- 🖥️ **デスクトップアプリ** — ターミナル不要（macOS・Windows・Linux）
- 🤖 **CLI** — `npx claude-ready` でパワーユーザー・自動化にも対応
- 🌏 **日本語・英語対応** — システム言語を自動検出
- 🎣 **フックプリセット** — 自動フォーマット、安全コミットなど
- 📊 **コスト管理** — `--cost` でトークン使用量を確認
- 🎴 **シェアカード** — セットアップ完了をコミュニティにシェア（`--share`）

---

## セキュリティ

セットアップ時に `.claude/settings.json` へ以下のセキュリティルールが自動で書き込まれます:

| 種別 | ルール |
|------|--------|
| **読み取り禁止** | `.env`, `.env.*`, `.env.local`, `**/secrets/**`, `**/*credential*` |
| **書き込み禁止** | `.env`, `.env.*`, `.env.local`, `*.pem`, `**/*credential*`, `.ssh/*` |
| **実行禁止** | `rm -rf /`, `rm -rf ~`, `sudo *`, `curl * | bash` |

Claude はあなたの秘密情報を読めず、重要なファイルに書き込めず、危険なコマンドを実行できません。

詳しくは [docs/TRUST.md](docs/TRUST.md)（英語）をご覧ください。

---

## 初めての方へ

ターミナルを使ったことがない方でも大丈夫です。

### ターミナルとは？
macOS の「ターミナル」アプリ（Spotlight で「ターミナル」と検索）のことです。黒または白い画面にコマンドを入力するツールです。

### 手順

1. macOS の場合、上記の `curl` コマンドをターミナルに貼り付けて Enter
2. **デスクトップアプリ**が起動し、ビジュアルなウィザードが表示されます
3. 画面の指示に従って進めるだけ — コマンドの入力は不要です

> **Claude Code とは何ですか？**
> AIがあなたのコードエディタの中に住んでいるようなものです。「〇〇を作って」と伝えると、コードを書いてくれます。claude-ready は最初から安全に使えるように設定を整えます。

---

## 開発者向け

### CLI オプション

```bash
npx claude-ready              # インタラクティブなセットアップ
npx claude-ready --dry-run    # ファイルを書かずにプレビューのみ
npx claude-ready --lang ja    # 日本語を強制
npx claude-ready --lang en    # 英語を強制
npx claude-ready --share      # シェアテキストを生成
npx claude-ready --cost       # コスト試算を表示
npx claude-ready --learn      # 学習ジャーニーを表示
npx claude-ready --events     # 近日イベントを表示
```

### フックプリセット

`.claude/settings.json` に追加できるオプションの自動化フック:

| フック | 動作 |
|--------|------|
| `auto-format` | ファイル編集後に Prettier を自動実行 |
| `safe-commit` | 編集後に自動コミット（チェックポイント方式） |
| `dangerous-cmd-block` | 危険なシェルコマンドを実行前にブロック |
| `cost-tracker` | トークン使用量を `usage.log` に記録 |
| `notification` | タスク完了時にデスクトップ通知 |

### プロジェクト構成

```
claude-ready/
├── packages/
│   ├── cli/          # メイン CLI (npx claude-ready)
│   ├── gui/          # デスクトップアプリ (Tauri v2 + React)
│   ├── shared/       # 共通ロジック (セキュリティ・フック・i18n)
│   └── skill/        # スキル統合
├── docs/
│   ├── guide-ja.md   # 日本語セットアップガイド（詳細版）
│   └── TRUST.md      # 透明性レポート（英語）
└── templates/        # プロジェクトスターターテンプレート
```

### ローカル開発

```bash
git clone https://github.com/isle-and-roots/claude-ready.git
cd claude-ready
pnpm install
pnpm build
pnpm test
pnpm dev
```

---

## ドキュメント

- [日本語セットアップガイド（詳細版）](docs/guide-ja.md) — ターミナルの使い方から丁寧に解説
- [TRUST.md](docs/TRUST.md) — 何がどこに書き込まれるか、完全な透明性レポート（英語）

---

## コミュニティ

- **Claude Code Meetup Japan #3** — 2026年3月12日開催予定
  - Claude Code を使う開発者・非開発者が集まるオフラインイベント
  - 詳細は [GitHub](https://github.com/isle-and-roots/claude-ready) で発表予定
- 質問・フィードバック・使用報告: [Issue を開く](https://github.com/isle-and-roots/claude-ready/issues)

---

## コントリビュート

プルリクエスト歓迎です！

1. リポジトリをフォーク
2. フィーチャーブランチを作成（`git checkout -b feature/amazing`）
3. 変更をコミット
4. Push してプルリクエストを作成

---

## ライセンス

MIT — 詳細は [LICENSE](LICENSE) をご覧ください。

---

Claude Code コミュニティのために作られました。
