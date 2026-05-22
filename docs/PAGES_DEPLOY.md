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

## 换上你自己设计的首页主图（重要）

线上 Hero **只读** 仓库里的 `public/hero-home.jpg`。设计稿若没放进这个文件，线上会一直显示旧图。

```powershell
cd "C:\Users\Administrator\Desktop\新建文件夹 (5)\budget-travel"

# 把「你的那张图」路径换成实际路径（支持 jpg/png）
.\scripts\install-hero.ps1 "你的设计主图.jpg"
```

然后：

1. 打开 `src/utils/homeHeroAsset.js`，把 `HOME_HERO_VERSION` 改成当天日期（如 `20260522b`）  
2. `git add public\hero-home*.jpg src/utils/homeHeroAsset.js src/locales/zh-CN.json`  
3. `git commit -m "chore: update homepage hero from design"`  
4. `git push origin main`  
5. 等 Actions 绿勾后，浏览器 **Ctrl+Shift+R** 强刷首页  

也可手动：复制图片覆盖 `public\hero-home.jpg` → `npm run resize-hero` → 同上提交推送。

## 部署后自检

1. 首页：全宽 Hero +「旅游攻略」横滑  
2. 底栏「攻略」→ `/#guides`  
3. `https://你的域名/hero-home-1280w.jpg?v=…` 能打开图片  
