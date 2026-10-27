$ErrorActionPreference = 'Continue'
Set-Location 'D:\Varun C\PRADEEP'

# 1. confirm visibility
gh repo view VARUN122134/kc-propel-website --json visibility,name,url

# 2. no Jekyll processing
if (-not (Test-Path '.nojekyll')) { New-Item -ItemType File '.nojekyll' | Out-Null }
git add -A
git commit -m 'Add .nojekyll for GitHub Pages' 2>&1 | Select-Object -Last 1
git push origin main 2>&1 | Select-Object -Last 1

# 3. enable Pages from main / root
$body = '{"source":{"branch":"main","path":"/"}}'
$body | Set-Content -Encoding ascii 'pages.json'
gh api -X POST 'repos/VARUN122134/kc-propel-website/pages' --input 'pages.json' 2>&1 | Select-Object -First 6
Remove-Item 'pages.json' -Force

Write-Output '--- pages status ---'
gh api 'repos/VARUN122134/kc-propel-website/pages' --jq '{url: .html_url, status: .status, branch: .source.branch, path: .source.path}' 2>&1 | Select-Object -First 6
