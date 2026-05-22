# 用你的设计稿替换首页 Hero 主图
# 用法（在项目根目录）：
#   .\scripts\install-hero.ps1 "D:\设计稿\首页主图.jpg"

param(
  [Parameter(Mandatory = $true)]
  [string]$SourceImage
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dest = Join-Path $root 'public\hero-home.jpg'

if (-not (Test-Path $SourceImage)) {
  Write-Error "找不到文件: $SourceImage"
}

Copy-Item -Path $SourceImage -Destination $dest -Force
Write-Host "已复制到 public\hero-home.jpg"

Set-Location $root
npm run resize-hero
Write-Host ""
Write-Host "完成。请执行："
Write-Host "  git add public\hero-home*.jpg src\utils\homeHeroAsset.js"
Write-Host "  （把 homeHeroAsset.js 里 HOME_HERO_VERSION 日期改一下）"
Write-Host "  git commit -m `"chore: update homepage hero image`""
Write-Host "  git push origin main"
