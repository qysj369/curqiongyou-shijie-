# 下一步清单（按顺序执行）

## 一、本地验证（约 2 分钟）

在项目根目录 `budget-travel` 下执行：

```bash
npm install
npm run build
npm run preview
```

浏览器打开终端里提示的地址（如 `http://localhost:4173`），点几个链接确认首页、目的地、攻略、收藏都正常，再关掉预览。

---

## 二、部署到 GitHub Pages（约 5 分钟）

**最简流程**：直接按 **部署到上线.md** 从第一步做到第四步即可上线。

### 1. 初始化 Git 并推送到 GitHub

在 `budget-travel` 目录下执行（把 `你的用户名` 和 `你的仓库名` 换成你自己的）：

```bash
git init
git add .
git commit -m "feat: 穷游世界初版"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

若仓库尚未创建：先到 [github.com/new](https://github.com/new) 新建仓库（如 `budget-travel`），不要勾选 “Add a README”，再执行上面命令。

### 2. 开启 GitHub Pages

1. 打开该仓库 → **Settings** → **Pages**
2. **Build and deployment** → **Source** 选 **GitHub Actions**
3. 保存后，若已有 workflow，推送后会自动构建；或到 **Actions** 页签点 **Run workflow** 手动跑一次

### 3. 查看线上地址

部署完成后访问：**https://你的用户名.github.io/你的仓库名/**  
例如：`https://octocat.github.io/budget-travel/`

---

## 三、可选：一键部署到 Vercel

1. 打开 [vercel.com](https://vercel.com) 并登录（可用 GitHub）
2. **Add New** → **Project** → 导入你的 **budget-travel** 仓库
3. 直接 **Deploy**，无需改配置
4. 完成后得到 `https://xxx.vercel.app` 的访问地址

---

## 四、部署后建议（可选）

- 打开 **https://你的用户名.github.io/你的仓库名/** 自测：首页、目的地、攻略、收藏、错误链接（404）是否正常
- 在 README 或本文件里写上你的 **GitHub 用户名 / 仓库名**，方便别人复现
- 需要根路径首页（`https://用户名.github.io/`）时，把 workflow 里 `BASE` 改为 `/`，仓库名改为 `用户名.github.io`

## 五、后续可做（不紧急）

- 增加更多攻略文章或目的地
- 做 sitemap.xml 后，在 `public/robots.txt` 里加上一行：`Sitemap: https://你的域名/sitemap.xml`
