# TUI チャットアプリケーション

ターミナルベースのユーザーインターフェース（TUI）を使用したシンプルなチャットアプリケーションです。TCP 通信を使用して、最大 2 人のユーザー間でリアルタイムなメッセージのやり取りが可能です。このアプリケーションはシンプルで使いやすいインターフェースを提供します。

## 機能

- テキストベースのインターフェースによるチャット機能
- サーバーモードとクライアントモードの両方をサポート
- 最大 2 人のユーザー間での会話
- リアルタイムなメッセージ送受信
- シンプルで直感的な操作性

## インストール方法

### 前提条件

- Go 1.16 以上
- ターミナルエミュレータ（UTF-8 対応）

### ビルド方法

リポジトリをクローンし、ビルドします：

```bash
git clone https://github.com/sakaeshinya/tui-chat.git
cd tui-chat
go build -o bin/chat ./cmd/chat
```

または、直接実行することもできます：

```bash
go run ./cmd/chat/main.go
```

## 使用方法

### コマンドラインオプション

```
使用方法:
  chat [オプション]

オプション:
  -u <name>     ユーザー名を指定
  -s            サーバーモードで起動
  -c            クライアントモードで起動
  -a <address>  接続先アドレス（クライアントモード）またはリッスンアドレス（サーバーモード）
  -config <path> 設定ファイルのパス
  -h            ヘルプを表示
```

### サーバーモードでの起動

サーバーモードでアプリケーションを起動するには、以下のコマンドを実行します：

```bash
./bin/chat -s -a :8080 -u サーバーユーザー
```

これにより、ポート 8080 でリッスンするサーバーが起動します。

### クライアントモードでの起動

クライアントモードでアプリケーションを起動し、既存のサーバーに接続するには、以下のコマンドを実行します：

```bash
./bin/chat -c -a localhost:8080 -u クライアントユーザー
```

これにより、localhost:8080 で実行されているサーバーに接続します。

## 操作方法

アプリケーションが起動すると、画面は以下の 3 つの領域に分かれます：

1. **チャット表示領域**：過去のメッセージが時系列で表示されます
2. **メッセージ入力領域**：新しいメッセージを入力します
3. **ステータス領域**：接続状態やエラーメッセージが表示されます

### キーボードショートカット

- **Enter**：メッセージを送信
- **Ctrl+C**：アプリケーションを終了

## 設定ファイル

デフォルトの設定を変更したい場合は、設定ファイルを使用できます。設定ファイルは JSON フォーマットで、以下の項目を設定できます：

```json
{
  "username": "デフォルトユーザー名",
  "defaultHost": "localhost",
  "defaultPort": "8080"
}
```

設定ファイルは `-config` オプションで指定するか、デフォルトの場所（ホームディレクトリの `.tui-chat/config.json`）に配置します。

## トラブルシューティング

### 接続できない場合

- サーバーが正しく起動しているか確認してください
- ファイアウォールの設定を確認してください
- 指定した IP アドレスとポートが正しいか確認してください

### メッセージが送信できない場合

- 接続状態を確認してください（ステータス領域に表示されます）
- 相手のクライアントが正しく接続されているか確認してください

## 開発情報

### プロジェクト構造

```
tui-chat/
├── cmd/
│   └── chat/
│       └── main.go           # エントリーポイント
├── internal/
│   ├── domain/               # ドメインモデル
│   ├── app/                  # アプリケーションサービス
│   ├── ui/                   # ユーザーインターフェース
│   ├── network/              # ネットワーク通信
│   └── config/               # 設定管理
└── docs/                     # ドキュメント
```

### 使用技術

- Go 言語
- tview ライブラリ（TUI 実装）
- 標準ライブラリの net（TCP 通信）

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は LICENSE ファイルを参照してください。
