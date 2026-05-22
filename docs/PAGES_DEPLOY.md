# GitHub Pages 与自定义域

## 自动部署

推送到 `main` 后会运行 `.github/workflows/deploy-pages.yml`：测试 → 构建 → 部署。

## 必配 Variables（Settings → Secrets and variables → Actions → Variables）

| 变量名 | 示例 | 说明 |
|--------|------|------|
| `PAGES_CNAME` | `www.轻游世界.com` | 自定义域；构建时写入 `dist/CNAME` |
| `PAGES_BASE` | `/` | 自定义域根路径填 `/`；仅用 `*.github.io/仓库名/` 时可留空 |
| `VITE_SITE_URL` | `https://www.轻游世界.com` | SEO、sitemap 绝对链接 |

未设 `PAGES_CNAME` 时，站点地址为：

`https://<用户名>.github.io/curqiongyou-shijie-/`

## DNS（自定义域）

在域名服务商添加：

- `CNAME`：`www` → `<用户名>.github.io`
- 或按 GitHub Pages 文档配置 `A` 记录 + `www` CNAME

仓库 **Settings → Pages** 中填写 Custom domain，并等待 HTTPS 证书生效（常见 10 分钟～24 小时）。

## 本地与线上主图一致

```powershell
cd "项目目录\budget-travel"
# 覆盖 public\hero-home.jpg 后：
npm run resize-hero
npm run build:pages
```

改 `src/utils/homeHeroAsset.js` 里的 `HOME_HERO_VERSION` 可强制浏览器刷新 Hero 缓存。

## 部署后自检

1. 首页：全宽 Hero +「旅游攻略」横滑  
2. 底栏「攻略」→ `/#guides`  
3. `https://你的域名/hero-home-1280w.jpg?v=…` 能打开图片  
