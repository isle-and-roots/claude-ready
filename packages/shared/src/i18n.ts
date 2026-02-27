export type Locale = 'en' | 'ja';

export interface I18nMessages {
  welcome: {
    title: string;
    subtitle: string;
    duration: string;
    levelQuestion: string;
    level: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    beginnerTerminalTips: string;
  };
  envCheck: {
    checking: string;
    macOS: string;
    nodeVersion: string;
    claudeCode: string;
    claudeCodeInstalled: string;
    beginnerNodeNote: string;
    expressSummary: string;
  };
  install: {
    installing: string;
    done: string;
    beginnerProgress: string[];
    expressSkipped: string;
  };
  apiKey: {
    needAccount: string;
    opening: string;
    stepsLabel: string;
    steps: string[];
    prompt: string;
    verified: string;
    alreadyConfigured: string;
    beginnerSteps: string[];
    expressAlreadySet: string;
    aboutApiKeys: string;
    apiKeyLengthError: string;
    apiKeyCharsError: string;
  };
  project: {
    question: string;
    website: string;
    webapp: string;
    cliTool: string;
    justSetup: string;
    directoryExists: string;
  };
  complete: {
    title: string;
    toStart: string;
    trySaying: string;
    suggestions: string[];
  };
  share: {
    label: string;
    copiedToClipboard: string;
    projectTypeWebsite: string;
    projectTypeWebapp: string;
    projectTypeCliTool: string;
    projectTypeGeneral: string;
  };
  community: {
    discord: string;
    star: string;
  };
  cost: {
    title: string;
    estimatedCost: string;
    budget: string;
    thresholdWarning: string;
    noBudget: string;
  };
  learn: {
    title: string;
    currentLevel: string;
    progress: string;
    nextTask: string;
    levels: string;
  };
  errors: {
    fileWriteError: string;
    networkError: string;
    retryGuidance: string;
    apiKeyFormatError: string;
    pathTraversalError: string;
  };
  events: {
    title: string;
    upcoming: string;
    noEvents: string;
    fetchError: string;
    dateLabel: string;
    locationLabel: string;
    urlLabel: string;
  };
  hints: {
    fullGuided: string;
    standard: string;
    express: string;
    htmlCssJs: string;
    reactVite: string;
    nodejs: string;
    noProject: string;
  };
  cancel: string;
  dryRun: {
    mode: string;
    skipInstall: string;
    skipApiKey: string;
    skipSecurity: string;
    skipProject: string;
    complete: string;
  };
  status: {
    notMacOS: string;
    nodeRequired: string;
    installFailed: string;
    projectCreating: string;
    projectCreated: string;
    happyBuilding: string;
  };
}

const en: I18nMessages = {
  welcome: {
    title: 'Welcome to Claude Ready',
    subtitle: "Let's get you building with AI.",
    duration: 'This will take about 3 minutes.',
    levelQuestion: "What's your experience level?",
    level: {
      beginner: "I've never used a terminal before",
      intermediate: 'I code sometimes',
      advanced: "I'm a developer",
    },
    beginnerTerminalTips: 'Terminal basics:\n• Type commands after the $ prompt and press Enter\n• Use ↑/↓ arrow keys to recall previous commands\n• Press Tab to auto-complete file names\n• Type "cd folder-name" to navigate into a folder\n• Type "ls" to see files in the current folder',
  },
  envCheck: {
    checking: 'Checking your environment...',
    macOS: 'macOS detected',
    nodeVersion: 'Node.js {version}',
    claudeCode: 'Claude Code installed',
    claudeCodeInstalled: ', Claude Code installed',
    beginnerNodeNote: 'Node.js is a runtime that lets you run JavaScript outside a browser. Claude Code needs it to work — think of it as the engine under the hood.',
    expressSummary: '✓ {os}, Node {version}, Claude Code installed',
  },
  install: {
    installing: 'Installing Claude Code...',
    done: 'Done',
    beginnerProgress: [
      'Downloading Claude Code from the internet...',
      'This may take a minute depending on your connection.',
      'Claude Code is Anthropic\'s official CLI for AI-assisted coding.',
    ],
    expressSkipped: 'Claude Code already installed — skipping.',
  },
  apiKey: {
    needAccount: "You'll need an Anthropic account.",
    opening: 'Opening anthropic.com in browser',
    steps: [
      'Sign up (or log in)',
      'Go to API Keys',
      'Create a new key',
      'Copy it and paste here',
    ],
    stepsLabel: 'Steps:',
    prompt: 'Paste your API key:',
    verified: 'API key verified!',
    alreadyConfigured: 'API key already configured',
    beginnerSteps: [
      'Think of an API key like a password — it lets Claude Code talk to Anthropic\'s AI on your behalf.',
      'Your key starts with "sk-ant-" and is kept secret (never share it).',
      'We\'ll save it to a .env file so you don\'t have to enter it again.',
    ],
    expressAlreadySet: 'API key already configured — skipping.',
    aboutApiKeys: 'About API Keys',
    apiKeyLengthError: 'API key is too short. Please check that you copied the full key.',
    apiKeyCharsError: 'API key contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed.',
  },
  project: {
    question: 'What would you like to build?',
    website: 'A simple website',
    webapp: 'A web application',
    cliTool: 'A command-line tool',
    justSetup: 'Just set up Claude Code',
    directoryExists: 'Directory "{name}" already exists. Overwrite?',
  },
  complete: {
    title: "You're Claude Ready!",
    toStart: 'To start:',
    trySaying: 'Try saying:',
    suggestions: ['Add a dark mode toggle', 'Make it look beautiful'],
  },
  share: {
    label: 'Share',
    copiedToClipboard: 'Copied to clipboard!',
    projectTypeWebsite: 'Simple Website',
    projectTypeWebapp: 'Web Application',
    projectTypeCliTool: 'CLI Tool',
    projectTypeGeneral: 'Claude Code Setup',
  },
  community: {
    discord: 'Discord',
    star: 'Star us',
  },
  cost: {
    title: 'Cost Estimator',
    estimatedCost: 'Estimated cost per session',
    budget: 'Monthly budget',
    thresholdWarning: 'Budget warning',
    noBudget: 'No spending recorded yet this month.',
  },
  learn: {
    title: 'Learning Journey',
    currentLevel: 'Current level',
    progress: 'Progress',
    nextTask: 'Next tasks',
    levels: 'All levels',
  },
  errors: {
    fileWriteError: 'Could not write file. Check that you have write permissions to this directory.',
    networkError: 'Network error detected. Check your internet connection and try again.',
    retryGuidance: 'You can retry manually: npm install -g @anthropic-ai/claude-code',
    apiKeyFormatError: 'Invalid API key format. Your key must start with "sk-ant-" (e.g. sk-ant-api03-...).',
    pathTraversalError: 'Invalid file path detected. Path must not contain ".." or be an absolute path.',
  },
  events: {
    title: 'Upcoming Events',
    upcoming: 'Next event',
    noEvents: 'No upcoming events found.',
    fetchError: 'Could not fetch events. Showing cached data.',
    dateLabel: 'Date:',
    locationLabel: 'Location:',
    urlLabel: 'URL:',
  },
  hints: {
    fullGuided: 'Full guided mode',
    standard: 'Standard mode',
    express: 'Express mode',
    htmlCssJs: 'HTML + CSS + JS',
    reactVite: 'React / Vite',
    nodejs: 'Node.js',
    noProject: 'No project',
  },
  cancel: 'Setup cancelled.',
  dryRun: {
    mode: 'Dry run mode — no files will be written or packages installed.',
    skipInstall: '[dry-run] Skipping Claude Code install',
    skipApiKey: '[dry-run] Skipping API key setup',
    skipSecurity: '[dry-run] Skipping security settings write',
    skipProject: '[dry-run] Skipping project creation',
    complete: 'Dry run complete — setup flow verified.',
  },
  status: {
    notMacOS: 'Not macOS — some features may be limited',
    nodeRequired: 'Node.js 18+ is required. Please update Node.js.',
    installFailed: 'Could not install Claude Code automatically.',
    projectCreating: 'Creating your first project...',
    projectCreated: 'Project created!',
    happyBuilding: 'Happy building!',
  },
};

const ja: I18nMessages = {
  welcome: {
    title: 'Claude Ready へようこそ',
    subtitle: 'AIと一緒に開発を始めましょう。',
    duration: '約3分で完了します。',
    levelQuestion: 'あなたの経験レベルは？',
    level: {
      beginner: 'ターミナルを使ったことがない',
      intermediate: 'たまにコードを書く',
      advanced: '開発者です',
    },
    beginnerTerminalTips: 'ターミナルの基本:\n• $ の後にコマンドを入力して Enter を押します\n• ↑/↓ キーで過去のコマンドを呼び出せます\n• Tab キーでファイル名を自動補完できます\n• 「cd フォルダ名」でフォルダに移動します\n• 「ls」で現在のフォルダ内のファイルを表示します',
  },
  envCheck: {
    checking: '環境を確認しています...',
    macOS: 'macOS を検出しました',
    nodeVersion: 'Node.js {version}',
    claudeCode: 'Claude Code がインストールされています',
    claudeCodeInstalled: '、Claude Code インストール済み',
    beginnerNodeNote: 'Node.js はブラウザの外でJavaScriptを実行するためのランタイムです。Claude Code が動作するために必要で、エンジンのような役割を果たします。',
    expressSummary: '✓ {os}, Node {version}, Claude Code インストール済み',
  },
  install: {
    installing: 'Claude Code をインストールしています...',
    done: '完了',
    beginnerProgress: [
      'インターネットから Claude Code をダウンロード中...',
      '接続速度によって少し時間がかかる場合があります。',
      'Claude Code は Anthropic 公式のAIコーディングCLIです。',
    ],
    expressSkipped: 'Claude Code はインストール済みです — スキップ。',
  },
  apiKey: {
    needAccount: 'Anthropic アカウントが必要です。',
    opening: 'ブラウザで anthropic.com を開いています',
    steps: [
      'サインアップ（またはログイン）',
      'API Keys ページへ移動',
      '新しいキーを作成',
      'コピーしてここに貼り付け',
    ],
    stepsLabel: '手順:',
    prompt: 'APIキーを貼り付けてください:',
    verified: 'APIキーを確認しました！',
    alreadyConfigured: 'APIキーは設定済みです',
    beginnerSteps: [
      'APIキーはパスワードのようなもので、Claude Code が Anthropic の AI と通信するために使います。',
      'キーは "sk-ant-" で始まり、秘密にしてください（他人と共有しないこと）。',
      '.env ファイルに保存するので、次回以降は入力不要です。',
    ],
    expressAlreadySet: 'APIキーは設定済みです — スキップ。',
    aboutApiKeys: 'APIキーについて',
    apiKeyLengthError: 'APIキーが短すぎます。キー全体をコピーしたか確認してください。',
    apiKeyCharsError: 'APIキーに無効な文字が含まれています。英数字、ハイフン、アンダースコアのみ使用できます。',
  },
  project: {
    question: '何を作りたいですか？',
    website: 'シンプルなウェブサイト',
    webapp: 'ウェブアプリケーション',
    cliTool: 'コマンドラインツール',
    justSetup: 'Claude Code のセットアップだけ',
    directoryExists: 'ディレクトリ "{name}" は既に存在します。上書きしますか？',
  },
  complete: {
    title: 'Claude Ready になりました！',
    toStart: '始めるには:',
    trySaying: '試してみてください:',
    suggestions: ['ダークモードを追加して', '見た目を美しくして'],
  },
  share: {
    label: 'シェア',
    copiedToClipboard: 'クリップボードにコピーしました！',
    projectTypeWebsite: 'シンプルなウェブサイト',
    projectTypeWebapp: 'ウェブアプリケーション',
    projectTypeCliTool: 'CLIツール',
    projectTypeGeneral: 'Claude Code セットアップ',
  },
  community: {
    discord: 'Discord',
    star: 'スターをつける',
  },
  cost: {
    title: 'コスト見積もり',
    estimatedCost: 'セッションあたりの推定コスト',
    budget: '月間予算',
    thresholdWarning: '予算警告',
    noBudget: '今月はまだ利用記録がありません。',
  },
  learn: {
    title: '学習ジャーニー',
    currentLevel: '現在のレベル',
    progress: '進捗',
    nextTask: '次のタスク',
    levels: '全レベル',
  },
  errors: {
    fileWriteError: 'ファイルの書き込みに失敗しました。このディレクトリへの書き込み権限を確認してください。',
    networkError: 'ネットワークエラーが発生しました。インターネット接続を確認して、再試行してください。',
    retryGuidance: '手動で再試行できます: npm install -g @anthropic-ai/claude-code',
    apiKeyFormatError: 'APIキーの形式が正しくありません。キーは "sk-ant-" で始まる必要があります（例: sk-ant-api03-...）。',
    pathTraversalError: '無効なファイルパスが検出されました。パスに ".." を含めたり、絶対パスにすることはできません。',
  },
  events: {
    title: '開催予定イベント',
    upcoming: '次のイベント',
    noEvents: '開催予定イベントは見つかりませんでした。',
    fetchError: 'イベント情報を取得できませんでした。キャッシュデータを表示しています。',
    dateLabel: '日付:',
    locationLabel: '場所:',
    urlLabel: 'URL:',
  },
  hints: {
    fullGuided: 'フルガイドモード',
    standard: 'スタンダードモード',
    express: 'エクスプレスモード',
    htmlCssJs: 'HTML + CSS + JS',
    reactVite: 'React / Vite',
    nodejs: 'Node.js',
    noProject: 'プロジェクトなし',
  },
  cancel: 'セットアップがキャンセルされました。',
  dryRun: {
    mode: 'ドライランモード — ファイルの書き込みやパッケージのインストールは行いません。',
    skipInstall: '[ドライラン] Claude Code のインストールをスキップ',
    skipApiKey: '[ドライラン] APIキーのセットアップをスキップ',
    skipSecurity: '[ドライラン] セキュリティ設定の書き込みをスキップ',
    skipProject: '[ドライラン] プロジェクト作成をスキップ',
    complete: 'ドライラン完了 — セットアップフローが検証されました。',
  },
  status: {
    notMacOS: 'macOS以外 — 一部の機能が制限される場合があります',
    nodeRequired: 'Node.js 18以上が必要です。Node.jsを更新してください。',
    installFailed: 'Claude Code を自動インストールできませんでした。',
    projectCreating: 'プロジェクトを作成中...',
    projectCreated: 'プロジェクトが作成されました！',
    happyBuilding: 'ハッピービルディング！',
  },
};

const messages: Record<Locale, I18nMessages> = { en, ja };

export function loadMessages(locale: Locale): I18nMessages {
  return messages[locale];
}

export function detectLocale(): Locale {
  // Check LANG environment variable first
  const lang = process.env.LANG ?? '';
  if (lang.startsWith('ja')) return 'ja';

  // Check Intl API
  try {
    const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.startsWith('ja')) return 'ja';
  } catch {
    // fall through
  }

  return 'en';
}

export function t(msgs: I18nMessages, key: string): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = msgs;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  if (typeof current === 'string') return current;
  return key;
}
