# URL Summarizer Service

## プロジェクト概要
(ここにプロジェクトの簡単な説明を記述します。例: 指定されたURLのウェブページ内容を取得し、AIを使用して簡潔な要約を生成するサービスです。)

## 使用技術
- **フロントエンド:** React, TypeScript, Tailwind CSS
- **バックエンド:** Node.js, Express.js
- **AI API:** Google Gemini API
- **ウェブスクレイピング:** Cheerio, Axios
- **ホスティング (予定):** Vercel (Frontend + Backend Serverless Functions)

## セットアップ方法
1. リポジトリをクローンします: `git clone <repository-url>`
2. ルートディレクトリに移動します: `cd url-summarizer`
3. 必要なパッケージを全てインストールします: `npm run install-all`
   - これにより、フロントエンドとバックエンド両方の依存関係がインストールされます。

## 環境変数設定
プロジェクトのルートに `.env.example` ファイルがあります。これをコピーして `backend/.env` を作成し、必要な値を設定してください。

**`backend/.env` に必要な変数:**
- `GEMINI_API_KEY`: あなたの Google Gemini API キー。
- `PORT`: バックエンドサーバーがリッスンするポート (ローカル開発用、デフォルトは3001)。
- `NODE_ENV`: `development` または `production`。
- `FRONTEND_URL`: (本番環境用) デプロイされたフロントエンドのURL (例: `https://your-app.vercel.app`)。CORS設定に使用します。

## ローカルでの実行
1. **バックエンドサーバーの起動:**
   ```bash
   cd backend
   npm start 
   # または開発モード (nodemonを使用する場合): npm run dev
   ```
   サーバーは `http://localhost:3001` (またはPORTで指定したポート) で起動します。

2. **フロントエンド開発サーバーの起動:**
   ```bash
   cd frontend
   npm start
   ```
   フロントエンドは `http://localhost:3000` で起動します。

## デプロイ方法 (Vercel)
1. このリポジトリをGitHubにプッシュします。
2. Vercelアカウントにログインし、GitHubリポジトリをインポートします。
3. Vercelのプロジェクト設定で、以下の環境変数を設定します:
   - `GEMINI_API_KEY`
   - `NODE_ENV` (通常 `production` に設定)
   - `FRONTEND_URL` (Vercelが提供するフロントエンドのURL)
4. ビルド設定:
   - **Framework Preset:** Create React App (Vercelが自動検出するはずです)
   - **Build Command:** `npm run build` (または `cd frontend && npm run build`)
   - **Output Directory:** `frontend/build`
   - **Install Command:** `npm run install-all` (または `npm install && cd frontend && npm install && cd .. && cd backend && npm install && cd ..`)
5. 必要に応じて、ルートディレクトリに `vercel.json` を配置してルーティングとサーバーレス関数の設定を行います (詳細は後述)。
6. デプロイを実行します。

## 使用方法
1. フロントエンド (`http://localhost:3000` または本番URL) にアクセスします。
2. 要約したいURLを入力フィールドに入力します。
3. 「要約する」ボタンをクリックします。
4. しばらく待つと、URLのタイトルと要約結果が表示されます。

## ライセンス
(ここにライセンス情報を記述します。例: MIT License)

---
*このREADMEは開発中のものです。内容は適宜更新してください。*
