# アクティブコンテキスト

## 現在の作業フォーカス

現在、Memoru プロジェクトは初期開発段階にあります。主な作業フォーカスは以下の通りです：

1. **プロジェクト設計と計画**

   - 要件定義の完成
   - ページ設計の完成
   - API 設計の完成

2. **開発環境のセットアップ**

   - プロジェクト構造の作成
   - 必要なパッケージのインストール
   - 開発環境の構成

3. **コアコンポーネントの実装**
   - メモ一覧表示機能
   - メモ詳細表示機能
   - メモ作成機能
   - メモ更新機能

## 最近の変更

- プロジェクトの初期設定
- メモリーバンクの作成と基本情報の記録
- 設計書の作成準備

## 次のステップ

1. **設計書の作成**

   - 要件定義書（requirements.md）の作成
   - ページ設計（page.md）の作成
   - API 設計（api.md）の作成

2. **プロジェクト構造のセットアップ**

   - フロントエンドの初期構造作成
   - バックエンドの初期構造作成
   - 開発環境の構成

3. **コア機能の実装**
   - データモデルの実装
   - API エンドポイントの実装
   - UI コンポーネントの実装
   - 状態管理の実装

## アクティブな決定事項

### アーキテクチャ

- フロントエンドは React/TypeScript で実装
- バックエンドは Cloudflare Workers で実装
- データベースは Cloudflare D1 を使用

### UI/UX

- シンプルで直感的なインターフェース
- レスポンシブデザインの採用
- マテリアルデザインの要素を取り入れる

### データモデル

- メモエンティティの設計
  - id: string (UUID)
  - title: string
  - content: string
  - createdAt: string (ISO date)
  - updatedAt: string (ISO date)

### API 設計

- RESTful API の採用
- JSON ベースのデータ交換
- エンドポイントは`/api/memos`をベースに設計

## 現在の課題と検討事項

### 技術的課題

- Cloudflare D1 の使用経験が少ない
- Cloudflare Workers の実行時間制限への対応
- オフライン対応（PWA）の実装方法

### 設計上の検討事項

- メモの検索機能の実装方法
- メモのソート・フィルタリング機能の実装方法
- 将来的な拡張性を考慮したアーキテクチャ設計

### 優先順位

1. コア機能（CRUD 操作）の完全実装
2. ユーザーインターフェースの洗練
3. パフォーマンス最適化
4. 追加機能の検討と実装
