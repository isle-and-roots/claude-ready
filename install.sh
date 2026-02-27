#!/bin/bash
set -e

REPO="isle-and-roots/claude-ready"
VERSION="0.1.0"
ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
  DMG="Claude.Ready_${VERSION}_aarch64.dmg"
else
  echo "❌ Intel Mac 向けビルドは現在未提供です。CLI をお使いください: npx claude-ready"
  exit 1
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/v${VERSION}/${DMG}"
TMP_DMG="/tmp/claudeready_${VERSION}.dmg"

echo "⬇️  Claude Ready をダウンロード中..."
curl -L --progress-bar "$DOWNLOAD_URL" -o "$TMP_DMG"

echo "🔓 Gatekeeper 隔離フラグを解除中..."
xattr -dr com.apple.quarantine "$TMP_DMG"

echo "📦 インストール中..."
hdiutil attach "$TMP_DMG" -quiet -nobrowse

cp -R "/Volumes/Claude Ready/Claude Ready.app" /Applications/

hdiutil detach "/Volumes/Claude Ready" -quiet
rm "$TMP_DMG"

xattr -cr "/Applications/Claude Ready.app"

echo "✅ Claude Ready のインストール完了！"
echo "   /Applications/Claude Ready.app を起動してください。"
