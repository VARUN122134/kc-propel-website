$ErrorActionPreference = 'Continue'
Set-Location 'D:\Varun C\PRADEEP'

git rm --cached 'setup-repo.ps1' | Out-Null
Remove-Item 'setup-repo.ps1' -Force -ErrorAction SilentlyContinue
Add-Content -Path '.gitignore' -Value 'setup-repo.ps1'

git add -A
git commit -m 'Remove local setup script from repo' | Out-Null
git push origin main 2>&1 | Select-Object -Last 2

Write-Output '--- head ---'
git log --oneline -2
git status --short
