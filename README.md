# enantiom

- S3 のパスを受け取ってそこにメタデータの JSON とスクショと管理画面のコード全部置く
- 全部入り CLI
- スクショ作成くん
  - https://github.com/microsoft/playwright
  - https://github.com/puppeteer/puppeteer
  - https://www.cypress.io/
- 画像 Diff 作成くん
  - https://github.com/dmtrKovalenko/odiff
- Diff 表示管理画面
  - Gatsby

```json5
{
  "artifact_path": "./path/to/directory or s3://bucket/path/to/directory",
  AWS_ACCESS_KEY_ID: "optional",
  AWS_SECRET_ACCESS_KEY: "optional",
  AWS_DEFAULT_REGION: "optional",
}
```
