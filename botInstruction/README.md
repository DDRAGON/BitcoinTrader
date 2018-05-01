BitCoin 自動取引ボットの作り方

1. アカウントを作ろう
アフィリンクを貼る。

2. 入金しよう
反映には少し時間がかかる。

3. アプリケーション登録
キーを発行、メモしておくこと。

4. API リファレンスを見てみる。

5. Node.js のインストール

6. プログラムを書いてみる。
npm init
touch config.js
echo "config.js\nnode_modules;" > .gitignore
npm install request --save
npm install crypto --save
npm install moment-timezone --save

config.js の作成

index.js

var request = require('request');
var crypto = require('crypto');
var moment = require('moment-timezone');