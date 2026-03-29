# 只做第二步：部署到 GitHub Pages

把下面两处的 **你的用户名**、**你的仓库名** 换成你自己的（例如 `zhangsan`、`budget-travel`），然后按顺序执行。

---

## 1. 在 GitHub 上建仓库（若还没有）

打开 [github.com/new](https://github.com/new)：

- **Repository name**：填 `budget-travel`（或你想要的仓库名）
- 不要勾选 “Add a README file”
- 点 **Create repository**

---

## 2. 在项目目录执行（在 `budget-travel` 下打开终端）

```bash
git init
git add .
git commit -m "feat: 穷游世界初版"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

推送时若提示登录，按 GitHub 的指引用浏览器或 Personal Access Token 完成认证。

---

## 3. 开启 GitHub Pages

1. 打开该仓库页面 → **Settings** → **Pages**
2. **Build and deployment** → **Source** 选 **GitHub Actions**
3. 保存（无需再点 Deploy）

---

## 4. 等部署完成

- 到仓库 **Actions** 页签，看到 “Deploy to GitHub Pages” 跑绿即可
- 或等 1～2 分钟后直接访问：**https://你的用户名.github.io/你的仓库名/**

例如仓库名为 `budget-travel` 则为：`https://你的用户名.github.io/budget-travel/`

---

## 5. 可选：SEO 与站内链接

- 打开 **public/sitemap.xml**，把其中的 `YOUR_USERNAME`、`YOUR_REPO` 全部替换为你的用户名和仓库名，保存后重新提交并推送（或下次改代码时一起推送）。
- 打开 **public/robots.txt**，把最后一行注释去掉，并把 `YOUR_USERNAME`、`YOUR_REPO` 换成你的地址，保存后同样提交推送。
