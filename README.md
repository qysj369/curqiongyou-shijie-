# Roamwise 轻游世界

Global smart-budget travel site — **Roamwise** · *Travel farther by spending smarter.*

**当前阶段（中国版先行）**：产品骨架以 **中国内地** 为唯一先行验收面——仅 `zh-CN` 语言包、人民币为主、高德与国内动线优先；其它国家/地区数据与页面为同源框架占位，须在单独里程碑通过评审后再视为对外承诺。实现约定见 `src/product/marketScope.js` 与「关于 → 中国版先行」章节；**对用户可见的验收清单**：`/china-readiness`。

多语言穷游攻略站：七大洲目的地、预算/天数筛选、收藏、分享/打印/截图，目的地民俗禁忌·信仰·旅游风险指南，以及**网友留言板**（分享体验/吐槽/点赞）与**社区公约**（禁止粗俗、政治攻击、宗教歧视等）。

### 主域名与品牌

- **品牌（界面文案）**：Roamwise · Light Travel / 轻游世界。  
- **官网主域名（示例）**：`helloroamly.com` — 绑定 DNS 后，构建时设置环境变量 **`VITE_SITE_URL`** 为该域名的根地址（`https://helloroamly.com` 或 `https://www.helloroamly.com`，勿带尾斜杠），与访客实际打开的地址一致，这样 canonical、Open Graph、`WebSite` 结构化数据才会正确。  
- 复制项目根目录 **`.env.example`** 为 `.env.production`（或各托管平台的 Environment Variables），按上面填写即可。本地开发可不设 `VITE_SITE_URL`。

## 技术栈

- React 18 + Vite 5 + Tailwind CSS
- react-router-dom、react-i18next（**当前仅内置 `zh-CN`，中国版先行**）
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
- **必须先配置仓库变量**（Settings → Secrets and variables → **Actions** → **Variables**）：
  - **`VITE_SITE_URL`**（必填）：与访客打开的站点根地址一致，如 `https://<用户名>.github.io/<仓库名>` 或自定义域 `https://你的域名.com`，**`https`、无尾斜杠**。
  - **`PAGES_BASE`**（可选）：仅子路径部署时填写，与 `vite` 的 `base` 一致，如 `/budget-travel/`；根路径部署可留空。
  - **`PAGES_CNAME`**（可选）：自定义域的主机名，如 `www.example.com`；会写入 `dist/CNAME`。使用默认 `*.github.io` 域名时不要设置。
- 推送 `main` 后，`.github/workflows/deploy-pages.yml` 会跑测试、构建并部署；未设置 **`VITE_SITE_URL`** 时构建步骤会失败并提示配置变量。
- 站点地址：`https://<用户名>.github.io/<仓库名>/`。构建时已通过环境变量 `BASE`（即 `PAGES_BASE`）设置 base 路径，资源会正确加载。

若需部署到**用户/组织首页**（`https://<用户名>.github.io/`），需在 workflow 变量中将 **`PAGES_BASE`** 设为 `/`，且仓库名须为 `<用户名>.github.io`。

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
| `.github/workflows/ci.yml` | 任意分支 PR：安装依赖并跑 Vitest（不部署） |
| `.github/workflows/deploy-pages.yml` | GitHub Pages：测试 → 构建（读仓库 **Variables**：`VITE_SITE_URL` 等）→ 部署 |
| `Dockerfile` + `nginx.conf` | Docker 镜像构建与 nginx 配置 |
| `vite.config.js` 中 `base` | 子路径部署时由环境变量 `BASE` 控制 |

---

## 上线前检查清单（勾完再对外）

**配置与构建**

- [ ] 生产 **`VITE_SITE_URL`** 已配置：`https`、无尾斜杠，且与访客实际域名一致（本地 `.env.production` / 托管后台；**GitHub Pages** 须在仓库 **Actions → Variables** 设置同名变量，按需加 **`PAGES_BASE`**、**`PAGES_CNAME`**）。
- [ ] 需要高德底图/预览时配置 **`VITE_AMAP_KEY`**（及安全密钥）；不配则接受「示意/提示」行为。
- [ ] 本地或 CI 已跑通 **`npm run test`**（Vitest）；合并到 `main` 前建议通过 PR（会跑 `.github/workflows/ci.yml`）；推送 `main` 时 **`deploy-pages`** 内含测试与 E2E。
- [ ] 发版前在本地或 CI 跑过 **`npm run test:e2e`**（若未改关键路径可抽样）。

**内容与合规**

- [ ] 隐私政策、用户条款、备案与页脚外链等 **`VITE_*`** 与文案已按实际上线区域核对。
- [ ] 中国版先行范围与 **`/china-readiness`** 表述与当前交付一致（见 `src/product/marketScope.js`、关于页）。

**发布后**

- [ ] 随机抽测：首页、地图、路线列表、一条攻略详情、预算页、行程页；移动端与桌面各过一遍。
- [ ] 监控或反馈入口有人值守（至少邮箱/工单/GitHub Issues）。
