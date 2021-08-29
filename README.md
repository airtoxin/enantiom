# enantiom

- config 読み取り (CLI option > enantiom.config.json > デフォルト値)
- config.artifact_path/public の中身(前回実行結果)を public/ に同期
- config.browsers と config.screenshots 基づきスクリーンショット撮影の設定配列を作成
- スクリーンショット撮影の設定配列を順番に処理してスクリーンショット撮影
- public/{日付} にスクリーンショットを保存
  - public/{日付}/{url}_{browser}_{size}.png
- スクリーンショット撮影の設定配列に撮影したスクリーンショットのパスを追加
- public/meta.json を読み取り
- meta.{前回日付} を元に public/{前回日付} と public{日付} の同名ファイルのスクリーンショットの差分を計算
- public/{前回日付}_{日付}/{スクショ名} に差分の画像を保存
- 差分のあったファイルについてどの設定で撮影されたスクリーンショットであるかの設定配列を作成
- public/meta.json にスクリーンショット撮影の設定配列と差分に関するスクリーンショット設定配列と{日付}を保存
- public/meta.json に基づいて Next.js で静的 HTML 作成 (出力先 out)
- config.artifact_path に out の内容を同期

```json5
{
  artifact_path: "./path/to/directory or s3://bucket/path/to/directory",
  "browsers": "chromium", // string | BrowserConfig | (string | BrowserConfig)[]
  "screenshots": [ // string | ScreenshotConfig | (string | ScreenShotConfig)[]
    "https://example.com",
    {
      "url": "https://www.google.com",
      "browsers": [
        "webkit", 
        {
          "browser": "chromium",
          "sizes": { width: 520, height: 340 } // SizeConfig | SizeConfig[]
        }
      ]
    }
  ],
  AWS_ACCESS_KEY_ID: "optional",
  AWS_SECRET_ACCESS_KEY: "optional",
  AWS_DEFAULT_REGION: "optional",
}
```
