# ブログ

Astro + TailwindCSS + microCMS で作ったブログです。

## 概要

SSG（静的サイトジェネレーター）である [Astro](https://astro.build/) を使って作成されたブログです。
microCMSのデータを使用し，ビルド時に静的なHTMLを生成します．
記事の執筆には [MDX](https://mdxjs.com/) を使用しており，Reactコンポーネントを埋め込むことができます．
シンタックスハイライトなど，基本的なMarkdownの機能はサポートされています．

## 環境構築

### 1. リポジトリをクローンする

```bash
git clone https://github.com/<USERNAME>/blogs.git
cd blogs
npm install
```

### 2. 環境変数を設定する

`.env` ファイルを作成し、以下の内容を記述してください。

```bash
MICROCMS_SERVICE_DOMAIN=domain # .microcms.io は含まない値
MICROCMS_API_KEY=api_key # microCMS の API キー
SITE_URL=https://example.com # デプロイ先のURL
```

### 3. microCMS の設定

#### 3.1. metadataのコンテンツを作成します．

- title / テキストフィールド: サイトのタイトル
- description / テキストフィールド: サイトの説明
- aboutme / テキストエリア: 自己紹介（Aboutページに表示されます）
- eyecatch / テキストフィールド: サイトの画像（URL）
- credit / テキストフィールド: サイトのクレジット（フッターに表示されます）

#### 3.2. カテゴリのコンテンツを作成します．

- name / テキストフィールド: カテゴリ名

#### 3.3. ブログのコンテンツを作成します．

- title / テキストフィールド: 記事のタイトル
- eyecatch / 画像フィールド: 記事のアイキャッチ画像
- content / テキストエリア: 記事の本文
- tags / 複数コンテンツ参照・カテゴリ: 記事のタグ（任意）

### 4. 実行

```bash
npm run dev
```

または

```bash
npm run build
npm run preview
```
