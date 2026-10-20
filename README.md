# YouTube解析比較ラボ（pyodide-http実験版）

GitHub Pagesに `index.html` と `py-worker.js` を同じフォルダに置いて公開してください。公開後はCtrl+Shift+Rでページを更新します。

## 更新点
- Worker URLにバージョンと時刻を付けてブラウザキャッシュを回避
- Worker起動時に版番号を表示
- Pyodideの`ssl`、`micropip`を先にロード
- `yt-dlp`インストール後に`pyodide-http`をインストールして`patch_all()`を実行
- HTTPパッチの成功と失敗をログに表示

## ご注意
- 外部CDN/PyPI等へのネットワークアクセスは必要です。完全オフラインでは動きません。
- `pyodide-http`によるパッチがyt-dlpの全通信経路に対応するとは限りません。CORS制約を解除するものでもありません。
- YouTubeメタデータの取得成功、動画ダウンロード、Canvas再生は保証しません。
- Webブラウザ上での実動作は未検証です。エラーは検証結果として表示します。
- 拡張機能、変換サーバ、`<video>`タグは使用しません。
