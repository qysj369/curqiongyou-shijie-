# Replace homepage hero with your design image.
# Usage (from project root):
#   .\scripts\install-hero.ps1 "D:\path\to\your-hero.jpg"

param(
  [Parameter(Mandatory = $true)]
  [string]$SourceImage
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dest = Join-Path $root 'public\hero-home.jpg'

if (-not (Test-Path -LiteralPath $SourceImage)) {
  Write-Error "File not found: $SourceImage"
}

Copy-Item -LiteralPath $SourceImage -Destination $dest -Force
Write-Host 'Copied to public\hero-home.jpg'

Set-Location -LiteralPath $root
npm run resize-hero

Write-Host ''
Write-Host 'Done. Next steps:'
Write-Host '  1. Edit HOME_HERO_VERSION in src\utils\homeHeroAsset.js'
Write-Host '  2. git add public\hero-home*.jpg src\utils\homeHeroAsset.js'
Write-Host '  3. git commit -m "chore: update homepage hero image"'
Write-Host '  4. git push origin main'
