mac版です<br>
$はターミナルに入力する内容です。<br>
(1) git cloneします。<br>
$ git clone git@github.com:Kitahara43965/nextjs-auth-mail-app.git<br>
(2) nextjs-auth-mail-appディレクトリに移動<br>
$ cd nextjs-auth-mail-app<br>
(3) nextをインストールします<br>
$ npm install<br>
(4) mysql起動<br>
$ brew services start mysql<br>
(5) プロジェクト直下に.envファイルを作成します。.envファイルに下記を記載します。<br>
DATABASE_URL="mysql://root:password@localhost:3306/auth_app"<br>
NEXTAUTH_SECRET=<br>
NEXTAUTH_URL=http://localhost:3000<br>
<br>
SMTP_HOST=localhost<br>
SMTP_PORT=1025<br>
SMTP_USER=test@example.com<br>
SMTP_PASS=<br>
ここで、NEXTAUTH_SECRETの値は<br>
$ openssl rand -base64 32<br>
と入力して値を取得します。<br>
NEXTAUTH_SECRET="(取得した値)"<br>
とします。<br>
(6) データ初期化<br>
$ npx prisma migrate reset<br>
で初期化します。<br>
Are you sure you want to reset your database? All data will be lost.<br>
の質問には小文字でyと入力します。<br>
(7) nodemailerインストール<br>
$ npm install nodemailer<br>
$ npm install -D @types/nodemailer<br>

(*) mailhog起動のために別途terminalを立ち上げる<br>
現在のプロジェクト直下(名称を変更していなければnextjs-auth-mail-app)で<br>
mailhogをインストールしていない場合はbrew経由でインストール<br>
$ brew install go<br>
$ brew install mailhog<br>
以下のコマンドでmailhog立ち上げ<br>
$ mailhog<br>

(8) サーバー立ち上げ <br>
$ npm run devでサーバーを立ち上げます。<br>

登録画面：localhost:3000/register<br>
ログイン画面： localhost:3000/login<br>
ダッシュボード画面：localhost:3000/dashboard<br>
