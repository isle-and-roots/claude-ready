---
pdf_options:
  format: A4
  margin:
    top: 25mm
    bottom: 25mm
    left: 20mm
    right: 20mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: '<div style="font-size:8px; width:100%; text-align:right; padding-right:20mm; color:#888;">claude-ready 利用手順書</div>'
  footerTemplate: '<div style="font-size:8px; width:100%; text-align:center; color:#888;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
css: |-
  body {
    font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Meiryo", sans-serif;
    color: #1f2937;
    line-height: 1.8;
    font-size: 10.5pt;
  }
  h1 {
    color: #D97757;
    border-bottom: 3px solid #D97757;
    padding-bottom: 8px;
    margin-top: 2em;
    font-size: 20pt;
  }
  h2 {
    color: #2563eb;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4px;
    margin-top: 1.5em;
    font-size: 14pt;
  }
  h3 {
    color: #374151;
    margin-top: 1.2em;
    font-size: 12pt;
  }
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9.5pt;
  }
  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    font-size: 9pt;
    overflow-x: auto;
  }
  pre code {
    background: none;
    padding: 0;
    color: inherit;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 9.5pt;
  }
  th {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
  }
  td {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
  }
  blockquote {
    border-left: 4px solid #D97757;
    padding-left: 16px;
    margin: 1em 0;
    color: #6b7280;
  }
  .cover-page {
    text-align: center;
    padding-top: 200px;
  }
  .cover-page h1 {
    font-size: 28pt;
    border: none;
  }
---

<div class="cover-page">

# claude-ready 利用手順書

**バージョン: v0.1.0**

2026年2月

isle-and-roots

</div>

<div style="page-break-after: always;"></div>

# 1. はじめに

## claude-ready とは

**claude-ready** は、AI コーディングアシスタント「Claude Code」のセットアップを自動化する CLI ツールです。コマンド1つで、環境チェックからセキュリティ設定、プロジェクト作成まで完了します。

```
npx claude-ready
```

## 対象者

- Claude Code をこれから使い始める開発者
- チームに Claude Code を導入したい技術リーダー
- AI を活用した開発ワークフローに興味のある方

## 所要時間

初回セットアップ: **約 5〜10 分**（API キー取得を含む）

---

# 2. 前提条件

| 項目 | 要件 |
|------|------|
| OS | macOS |
| Node.js | v18 以上 |
| 認証情報 | 選択した認証方法に応じたアカウント（下記参照） |
| インターネット接続 | Claude Code のインストールと API 通信に必要 |

### 認証方法と必要なもの

| 方法 | 料金体系 | 対象者 | 必要なもの |
|------|----------|--------|-----------|
| **サブスクリプション** | 月額定額 | 個人開発者 | Claude Pro / Max 契約 |
| **API キー** | 従量課金 | 個人・チーム | Anthropic Console アカウント |
| **Teams / Enterprise** | 組織契約 | チーム・企業 | 管理者からの招待 |
| **Cloud Provider** | クラウド従量 | 企業・既存クラウドユーザー | AWS / GCP アカウント |

> **Node.js 未インストールの場合**: [nodejs.org](https://nodejs.org/) から LTS 版をダウンロードしてインストールしてください。インストール後、ターミナルで `node -v` を実行してバージョンを確認できます。

---

# 3. インストール・実行方法

## デスクトップアプリ（推奨）

ビジュアルなプログレスバーとマウス操作に対応した、最も簡単な方法です。

### インストール（ワンライナー）

**macOS (Apple Silicon)**:

```bash
curl -fsSL https://raw.githubusercontent.com/isle-and-roots/claude-ready/main/install.sh | bash
```

このスクリプトが自動的にダウンロード・macOS Gatekeeper の隔離フラグ解除・インストールを行います。

### 手動インストールの場合

1. [GitHub Releases](https://github.com/isle-and-roots/claude-ready/releases/latest) から `.dmg` をダウンロード
2. 以下を実行して隔離フラグを解除:

```bash
xattr -dr com.apple.quarantine ~/Downloads/"Claude.Ready_0.1.0_aarch64.dmg"
```

3. `.dmg` を開き、`Claude Ready.app` を `/Applications` にドラッグ
4. アプリを起動

---

## CLI

claude-ready のインストールは不要です。`npx` で直接実行できます:

```bash
npx claude-ready
```

または、グローバルにインストールして使用することもできます:

```bash
npm install -g claude-ready
claude-ready
```

### 日本語で実行する場合

claude-ready は端末の言語設定を自動検出しますが、明示的に指定することもできます:

```bash
npx claude-ready --lang ja
```

---

# 4. セットアップフロー詳細

claude-ready を実行すると、以下の 7 ステップで環境が構築されます。

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 1: エクスペリエンスレベル選択              │
│       ↓                                         │
│  Step 2: 環境チェック (OS / Node.js / CLI)      │
│       ↓                                         │
│  Step 3: Claude Code インストール               │
│       ↓                                         │
│  Step 4: 認証設定                               │
│       ↓                                         │
│  Step 5: セキュリティ設定                       │
│       ↓                                         │
│  Step 6: プロジェクト作成                       │
│       ↓                                         │
│  Step 7: 完了 + 次のステップ                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Step 1: エクスペリエンスレベル選択

最初に、あなたの経験レベルを選択します。選択したレベルに応じて、ガイドの詳しさが変わります。

| レベル | モード | 説明 |
|--------|--------|------|
| **Beginner（初心者）** | フルガイド | ターミナルの使い方、Node.js の説明など、丁寧な解説付き |
| **Intermediate（中級者）** | 標準 | バランスの取れたガイド。要所にヒントを表示 |
| **Advanced（上級者）** | エクスプレス | 最小限の表示。確認をスキップしてスピーディに進行 |

---

## Step 2: 環境チェック

以下の項目を自動的にチェックします:

| チェック項目 | 内容 |
|-------------|------|
| OS | macOS であることを確認 |
| Node.js | v18 以上がインストールされていることを確認 |
| Claude Code | 既にインストール済みかどうかを検出 |

チェックに失敗した場合は、対処方法が表示されます。

---

## Step 3: Claude Code インストール

Claude Code が未インストールの場合、自動でインストールを実行します:

```bash
npm install -g @anthropic-ai/claude-code
```

- 既にインストール済みの場合はスキップされます
- `--dry-run` オプション使用時もスキップされます

---

## Step 4: 認証設定

Claude Code の認証方法を選択して設定します。4つの方法から状況に合わせて選択できます。

### 認証方法の選び方

```
Claude Code を使い始めたい
        |
        +---> 個人で使う?
        |           |
        |           +---> 月額定額が良い → [A] サブスクリプション (Pro / Max)
        |           |
        |           +---> 使った分だけ払いたい → [B] API キー
        |
        +---> 組織・チームで使う?
                    |
                    +---> 管理者から招待あり → [C] Teams / Enterprise
                    |
                    +---> AWS / Google Cloud 利用中 → [D] Cloud Provider
```

---

### 方法 A: サブスクリプション (Pro / Max)

claude.com のサブスクリプション契約を利用してブラウザ認証します。

| プラン | 月額 | 利用量の目安 |
|--------|------|-------------|
| Pro | $20 | 個人開発・学習向け |
| Max 5x | $100 | ヘビーユーザー向け |
| Max 20x | $200 | プロフェッショナル向け |

**手順:**

1. claude-ready が `claude login` を自動実行します
2. ブラウザが開き、claude.com のサインイン画面が表示されます
3. アカウントにサインインして認証を完了します
4. ターミナルに「認証に成功しました」と表示されれば完了

> **重要: API キーとの競合に注意**
>
> 環境変数 `ANTHROPIC_API_KEY` が設定されていると、サブスクリプション認証よりも API キーが優先されます。`.env` ファイルに `ANTHROPIC_API_KEY` が含まれている場合、claude-ready は自動的に警告を表示し、削除の確認を求めます。

---

### 方法 B: API キー（従量課金）

Anthropic Console で発行した API キーを使用します。使った分だけ課金されます。

**手順:**

1. ブラウザが自動的に Anthropic Console（`console.anthropic.com`）を開きます
2. Anthropic アカウントにサインイン（未登録の場合はアカウント作成）
3. **API Keys** セクションで新しいキーを生成
4. 生成されたキー（`sk-ant-` で始まる文字列）をコピー
5. ターミナルに戻り、キーを入力

**キーの保存:**

入力された API キーはプロジェクトディレクトリの `.env` ファイルに保存されます。このファイルはセキュリティ設定により Claude Code からの読み取りが自動的にブロックされます。

> **注意**: API キーは秘密情報です。Git にコミットしないでください（`.gitignore` に自動追加されます）。

---

### 方法 C: Teams / Enterprise

組織の管理者からの招待を受けてログインします。

**手順:**

1. 組織の管理者に Claude Code Teams / Enterprise アカウントへの招待を依頼します
2. 招待メールを受け取ったら、リンクをクリックして組織アカウントを有効化します
3. claude-ready が `claude login` を自動実行します
4. ブラウザで組織アカウントにサインインして認証を完了します

| プラン | 特徴 |
|--------|------|
| Teams | 中小規模チーム向け。管理コンソールで利用状況を管理 |
| Enterprise | 大規模組織向け。SSO 連携・監査ログ・高度なセキュリティ |

---

### 方法 D: Cloud Provider (Bedrock / Vertex AI)

AWS または Google Cloud のインフラ経由で Claude を使用します。

claude-ready はプロバイダーを選択後、必要な環境変数の一覧を表示します。以下の変数をシェルの設定ファイル（`~/.zshrc` など）または `.env` ファイルに設定してください。

**AWS Bedrock:**

```bash
CLAUDE_CODE_USE_BEDROCK=1
AWS_REGION=<your-region>            # 例: us-east-1
AWS_ACCESS_KEY_ID=<your-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret>
```

**Google Cloud Vertex AI:**

```bash
CLAUDE_CODE_USE_VERTEX=1
CLOUD_ML_REGION=<your-region>       # 例: us-east5
ANTHROPIC_VERTEX_PROJECT_ID=<your-project-id>
```

> **注意**: Cloud Provider 認証情報（アクセスキー等）も秘密情報です。`.env` ファイルに記述する場合は `.gitignore` に追加してください。

---

## Step 5: セキュリティ設定

プロジェクトに `.claude/settings.json` を自動生成し、15 のセキュリティルールを適用します。ユーザー操作は不要です。

### 自動適用されるセキュリティルール

| カテゴリ | ルール | 説明 |
|---------|--------|------|
| **読み取り制限** | `Read(.env)` | 環境変数ファイルの読み取りを禁止 |
| | `Read(.env.*)` | 環境変数ファイル（派生）の読み取りを禁止 |
| | `Read(.env.local)` | ローカル環境変数の読み取りを禁止 |
| | `Read(**/secrets/**)` | secrets ディレクトリの読み取りを禁止 |
| | `Read(**/*credential*)` | 認証情報ファイルの読み取りを禁止 |
| **コマンド制限** | `Bash(rm -rf /)` | ルートディレクトリの削除を禁止 |
| | `Bash(rm -rf ~)` | ホームディレクトリの削除を禁止 |
| | `Bash(sudo *)` | sudo コマンドの実行を禁止 |
| | `Bash(curl * \| bash)` | パイプ経由のスクリプト実行を禁止 |
| **書き込み制限** | `Write(.env)` | 環境変数ファイルへの書き込みを禁止 |
| | `Write(.env.*)` | 環境変数ファイル（派生）への書き込みを禁止 |
| | `Write(.env.local)` | ローカル環境変数への書き込みを禁止 |
| | `Write(*.pem)` | 証明書ファイルへの書き込みを禁止 |
| | `Write(**/*credential*)` | 認証情報ファイルへの書き込みを禁止 |
| | `Write(.ssh/*)` | SSH 鍵ファイルへの書き込みを禁止 |

---

## Step 6: プロジェクト作成

4 種類のプロジェクトテンプレートから選択できます:

| テンプレート | 技術スタック | 生成されるファイル |
|-------------|-------------|-------------------|
| **Website** | HTML + CSS + JS | `index.html`, `style.css`, `script.js`, `.gitignore`, `CLAUDE.md` |
| **Webapp** | React 18 + Vite 5 | `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`, `CLAUDE.md` |
| **CLI Tool** | Node.js (ESM) | `package.json`, `src/index.js`, `.gitignore`, `CLAUDE.md` |
| **General** | なし | `CLAUDE.md` のみ（既存プロジェクトへの導入向け） |

各テンプレートには、プロジェクトタイプに応じた `CLAUDE.md`（Claude Code へのガイドライン）が自動生成されます。

---

## Step 7: 完了 + 次のステップ

セットアップが完了すると、以下の情報が表示されます:

- **プロジェクトの開始方法**: 作成したディレクトリへの移動コマンド
- **Claude Code の起動方法**: 対話的に AI とコーディングを開始する方法
- **コミュニティリンク**: Discord、GitHub リポジトリへのリンク

---

# 5. CLI オプション一覧

| オプション | 説明 | 使用例 |
|-----------|------|--------|
| `--help`, `-h` | ヘルプを表示 | `npx claude-ready --help` |
| `--version`, `-v` | バージョンを表示 | `npx claude-ready --version` |
| `--lang <locale>` | 言語を指定（`en` / `ja`） | `npx claude-ready --lang ja` |
| `--dry-run` | ファイル書き込みなしで実行 | `npx claude-ready --dry-run` |
| `--share` | SNS 共有テキストを生成 | `npx claude-ready --share` |
| `--cost` | コスト見積もりを表示 | `npx claude-ready --cost` |
| `--learn` | 学習ジャーニーを表示 | `npx claude-ready --learn` |
| `--events` | イベント情報を表示 | `npx claude-ready --events` |

---

# 6. 生成ファイル一覧

claude-ready が生成・変更するファイルの一覧です:

| ファイル | 説明 |
|---------|------|
| `.env` | Anthropic API キー（`ANTHROPIC_API_KEY=sk-ant-...`） |
| `.claude/settings.json` | セキュリティ設定（deny ルール） |
| `CLAUDE.md` | Claude Code へのプロジェクトガイドライン |
| プロジェクトファイル | テンプレートに応じた初期ファイル群 |

### .env ファイルのセキュリティ

`.env` ファイルは機密情報を含むため、以下の保護が適用されます:

- `.gitignore` に自動追加（Git 管理対象外）
- Claude Code の deny ルールにより読み書きがブロック
- ファイルパーミッション `0o600`（所有者のみ読み書き可能）

---

# 7. FAQ / トラブルシューティング

## Q: macOS で「"Claude Ready" は壊れているため開けません」と表示される

**A**: macOS Sequoia (15) 以降の Gatekeeper によるブロックです。インストールスクリプトを使うと自動解決します:

```bash
curl -fsSL https://raw.githubusercontent.com/isle-and-roots/claude-ready/main/install.sh | bash
```

すでに手動インストール済みの場合は、以下で隔離フラグを除去してください:

```bash
xattr -cr "/Applications/Claude Ready.app"
```

**原因**: Apple Developer ID による署名がないため、ダウンロードされたファイルに `com.apple.quarantine` 属性が付与されます。上記のコマンドで除去すると以降は通常通り起動できます。

## Q: Node.js がインストールされていません

**A**: [nodejs.org](https://nodejs.org/) から LTS 版をダウンロードしてインストールしてください。

```bash
# Homebrew を使用する場合
brew install node

# インストール確認
node -v    # v18.0.0 以上が必要
npm -v     # npm も同時にインストールされます
```

## Q: API キーのエラーが表示されます

**A**: 以下を確認してください:

1. キーが `sk-ant-` で始まっていること
2. キーをコピーする際に余分な空白が含まれていないこと
3. Anthropic コンソールでキーが有効（Active）な状態であること
4. アカウントにクレジットが残っていること

## Q: サブスクリプションと API キーの違いは何ですか？

**A**: 主な違いは料金体系です:

| | サブスクリプション | API キー |
|---|---|---|
| 料金 | 月額定額（$20〜） | 使用量に応じた従量課金 |
| 対象 | 個人向け claude.com プラン | 開発者向け Anthropic Console |
| 管理 | claude.com で管理 | Anthropic Console で管理 |

## Q: サブスクリプション契約しているのに API 料金が発生します

**A**: 環境変数 `ANTHROPIC_API_KEY` が設定されていると、サブスクリプション認証より API キー認証が優先されます。

確認手順:
1. プロジェクトの `.env` ファイルを確認して `ANTHROPIC_API_KEY` が含まれていないかチェック
2. シェルの設定ファイル（`~/.zshrc` 等）で `export ANTHROPIC_API_KEY=...` が設定されていないか確認
3. 設定されている場合は削除して `claude login` を再実行

## Q: Teams アカウントへの招待が届きません

**A**: 組織の管理者に以下を確認してください:

1. 管理者が Claude Code Teams 管理コンソールにアクセスできるか
2. 招待先のメールアドレスが正しいか
3. 迷惑メールフォルダを確認するよう依頼

## Q: Cloud Provider 認証が通りません

**A**: 各プロバイダーの確認事項:

**AWS Bedrock:**
- `AWS_REGION` で指定したリージョンで Claude モデルが利用可能か確認
- IAM ロール / ユーザーに `bedrock:InvokeModel` 権限があるか確認
- AWS 側で Bedrock の Claude モデルアクセスが有効化されているか確認

**Google Cloud Vertex AI:**
- `ANTHROPIC_VERTEX_PROJECT_ID` のプロジェクトで Vertex AI API が有効か確認
- サービスアカウントに `roles/aiplatform.user` 権限があるか確認
- `CLOUD_ML_REGION` がサポートされているリージョンか確認

## Q: ネットワークエラーが発生します

**A**: 以下を確認してください:

1. インターネットに接続されていること
2. プロキシ環境の場合、`HTTP_PROXY` / `HTTPS_PROXY` 環境変数が設定されていること
3. ファイアウォールが npm レジストリ（`registry.npmjs.org`）や Anthropic API（`api.anthropic.com`）をブロックしていないこと

## Q: --dry-run とは何ですか？

**A**: `--dry-run` オプションを使用すると、実際のファイル書き込みやインストールを行わずにセットアップフローを体験できます。チームへのデモや事前確認に便利です。

```bash
npx claude-ready --dry-run
```

## Q: 既存プロジェクトに導入できますか？

**A**: はい。テンプレート選択で「General（セットアップのみ）」を選択すると、`CLAUDE.md` と `.claude/settings.json` のみが生成されます。既存のプロジェクト構造には影響しません。

---

# 8. セキュリティ情報

## 設計方針

claude-ready は「セキュリティ・バイ・デフォルト」の設計思想に基づいています:

- **ゼロコンフィグ**: セキュリティ設定はユーザーの操作なしに自動適用
- **最小権限の原則**: Claude Code が必要としないファイルへのアクセスを制限
- **機密情報の保護**: `.env`、認証情報、SSH 鍵などへのアクセスを deny ルールでブロック
- **危険なコマンドの防止**: `rm -rf /`、`sudo`、パイプ経由のスクリプト実行を禁止

## 設定ファイルの場所

```
<プロジェクトルート>/
└── .claude/
    └── settings.json    ← deny ルールが記載
```

## 認証方式の優先順位

Claude Code は以下の優先順位で認証を判断します:

1. `ANTHROPIC_API_KEY` 環境変数（設定されている場合は最優先）
2. `claude login` によるブラウザ認証（サブスクリプション / Teams）
3. Cloud Provider 環境変数（`CLAUDE_CODE_USE_BEDROCK=1` 等）

> **注意**: サブスクリプション契約がある場合でも、`ANTHROPIC_API_KEY` が設定されていると API キー認証が優先され、別途従量課金が発生する可能性があります。

## カスタマイズ

セキュリティルールは `.claude/settings.json` を直接編集することで追加・変更できます。ただし、デフォルトの deny ルールの削除は推奨しません。

---

# 付録: サポート・コミュニティ

| リソース | URL |
|---------|-----|
| GitHub リポジトリ | https://github.com/isle-and-roots/claude-ready |
| npm パッケージ | https://www.npmjs.com/package/claude-ready |
| ライセンス | MIT |

---

*本手順書は claude-ready v0.1.0 に基づいて作成されています。*
