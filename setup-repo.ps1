$ErrorActionPreference = 'Continue'
Set-Location 'D:\Varun C\PRADEEP'

if (-not (Test-Path '.git')) {
    git init -b main | Out-Null
}

git config user.name 'VARUN122134'
git config user.email '223917986+VARUN122134@users.noreply.github.com'
git config core.autocrlf false

@'
# OS / editor noise
.DS_Store
Thumbs.db
desktop.ini

# tooling
node_modules/
*.log

# local screenshots used while building
shot-*.png
shots.ps1
shoot*.cjs
'@ | Set-Content -Encoding utf8 '.gitignore'

git add -A
git commit -m "K&C Propel: marketing site built from client design brief" | Out-Null

Write-Output '--- status ---'
git log --oneline -1
git status --short
