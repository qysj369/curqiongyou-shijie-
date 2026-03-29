# 使用 GitHub Actions 部署到 GitHub Pages

## 1. 推送代码到 GitHub

将本项目推送到你的 GitHub 仓库（例如 `yourname/budget-travel`）。默认分支建议为 `main`。

## 2. 开启 GitHub Pages 并选择 Actions

1. 打开仓库 **Settings** → **Pages**
2. 在 **Build and deployment** 里：
   - **Source** 选择 **GitHub Actions**

## 3. 首次部署

- 推送或合并到 `main` 分支后，会自动触发 `.github/workflows/deploy-pages.yml`
- 或在 **Actions** 页签中选中 “Deploy to GitHub Pages” 工作流，点击 **Run workflow** 手动运行

## 4. 查看结果

- 部署完成后，访问：**https://\<你的用户名>.github.io/\<仓库名>/**
- 例如仓库名为 `budget-travel` 则为：`https://yourname.github.io/budget-travel/`

## 说明

- 构建时已通过环境变量 `BASE` 设置 Vite 的 `base` 为 `/<仓库名>/`，资源与路由会按子路径正确加载
- 若仓库名为 `<用户名>.github.io`（用户/组织首页站），需在 workflow 中把 `BASE` 改为 `/`，并确认仓库名无误
