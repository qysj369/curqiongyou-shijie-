# Roamwise 轻游世界

Global smart-budget travel site — **Roamwise** · *Travel farther by spending smarter.*

多语言穷游攻略站：七大洲目的地、预算/天数筛选、收藏、分享/打印/截图，目的地民俗禁忌·信仰·旅游风险指南，以及**网友留言板**（分享体验/吐槽/点赞）与**社区公约**（禁止粗俗、政治攻击、宗教歧视等）。

### 主域名与品牌

- **品牌（界面文案）**：Roamwise · Light Travel / 轻游世界。  
- **官网主域名（示例）**：`helloroamly.com` — 绑定 DNS 后，构建时设置环境变量 **`VITE_SITE_URL`** 为该域名的根地址（`https://helloroamly.com` 或 `https://www.helloroamly.com`，勿带尾斜杠），与访客实际打开的地址一致，这样 canonical、Open Graph、`WebSite` 结构化数据才会正确。  
- 复制项目根目录 **`.env.example`** 为 `.env.production`（或各托管平台的 Environment Variables），按上面填写即可。本地开发可不设 `VITE_SITE_URL`。

## 技术栈

- React 18 + Vite 5 + Tailwind CSS
- react-router-dom、i18next（中/英）
- 数据：`src/data/mockData.js`、`src/data/destinationGuides.js`

## 本地运行

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview   # 本地预览 dist
```

---

## 部署

**上线前**：在托管后台配置 **`VITE_SITE_URL=https://helloroamly.com`**（若使用 `www` 则与证书、重定向保持一致）。未设置时站内仍可浏览，但 canonical / 分享链接可能为空或不符合预期。

项目已配置多种部署方式，任选其一即可。SPA 路由（如 `/destinations/1`、`/articles/a1`）在各平台均可正常访问。

### 1. Vercel（推荐）

- 将仓库推到 **GitHub**，在 [vercel.com](https://vercel.com) 导入该仓库。
- 框架预设选 **Vite**，无需改配置。
- 根目录已包含 `vercel.json`，自动做 SPA 回退。

### 2. Netlify

- 将仓库推到 **GitHub**，在 [netlify.com](https://netlify.com) 新建站点并连接该仓库。
- 构建命令：`npm run build`，发布目录：`dist`（已在 `netlify.toml` 中配置）。
- SPA 回退由 `netlify.toml` 的 `[[redirects]]` 完成，无需在后台再设重定向。

### 3. Cloudflare Pages

- [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → 创建项目 → 连接 Git。
- 构建命令：`npm run build`，构建输出目录：`dist`。
- 构建产物中的 `_redirects`（来自 `public/_redirects`）会自动生效，实现 SPA 回退。

### 4. GitHub Pages（GitHub Actions）

- 仓库 **Settings → Pages → Build and deployment** 中，Source 选择 **GitHub Actions**。
- 推送 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动构建并部署。
- 站点地址：`https://<用户名>.github.io/<仓库名>/`。构建时已通过环境变量 `BASE` 设置 base 路径，资源会正确加载。

若需部署到**用户/组织首页**（`https://<用户名>.github.io/`），需在 workflow 中把 `BASE` 改为 `/`，且仓库名须为 `<用户名>.github.io`。

### 5. Docker（自建服务器 / 云主机）

在项目根目录执行：

```bash
docker build -t budget-travel .
docker run -p 80:80 budget-travel
```

访问 `http://localhost`。若需对外提供，将 80 映射到主机端口或配合反向代理使用。

### 6. 静态托管（手动上传 dist）

- 执行 `npm run build`，将 **dist** 目录内所有文件上传到托管商（如阿里云 OSS、腾讯云 COS、又拍云等）的站点根目录。
- 在托管商控制台为 SPA 配置「回退到 index.html」或「404 → index.html」规则（具体名称因厂商而异）。
- 若站点放在**子路径**（例如 `https://你的域名/app/`），请先设置 base 再构建：
  ```bash
  BASE=/app/ npm run build
  ```
  再把 `dist` 内容上传到该子路径对应目录。

---

## 部署相关文件说明

| 文件 | 用途 |
|------|------|
| `.env.example` | 生产环境变量示例（`VITE_SITE_URL` 主域名等）；复制为 `.env.production` 或填到托管后台 |
| `vercel.json` | Vercel SPA 回退 |
| `netlify.toml` | Netlify 构建命令、发布目录、重定向 |
| `public/_redirects` | Cloudflare Pages / 部分平台 SPA 回退 |
| `.github/workflows/deploy-pages.yml` | GitHub Pages 自动构建与部署 |
| `Dockerfile` + `nginx.conf` | Docker 镜像构建与 nginx 配置 |
| `vite.config.js` 中 `base` | 子路径部署时由环境变量 `BASE` 控制 |
