[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('zrok','cloudflare','tailscale-serve','tailscale-funnel','ngrok')]
  [string]$Provider,
  [int]$Port = 17890,
  [switch]$Install
)

$ErrorActionPreference = 'Stop'
$Target = "http://127.0.0.1:$Port"

function Has([string]$Name) {
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-Winget([string]$Id, [string]$Exe) {
  if (Has $Exe) { return }
  if (-not $Install) {
    Write-Host "Missing $Exe. Re-run with -Install to install it with winget." -ForegroundColor Yellow
    return
  }
  if (-not (Has 'winget')) {
    throw "winget is not available. Follow the provider guide in docs/providers."
  }
  winget install --id $Id --exact --source winget --accept-source-agreements --accept-package-agreements
}

function Install-Zrok {
  if (Has 'zrok2') { return }
  if (-not $Install) {
    Write-Host "Missing zrok2. Re-run with -Install for a user-local install." -ForegroundColor Yellow
    return
  }

  $arch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString().ToLowerInvariant()
  if ($arch -notin @('x64','arm64')) { throw "Automatic zrok2 install supports x64/arm64 Windows only." }
  $assetArch = if ($arch -eq 'x64') { 'amd64' } else { 'arm64' }

  $release = Invoke-RestMethod 'https://api.github.com/repos/openziti/zrok/releases/latest'
  $asset = $release.assets | Where-Object { $_.name -match "windows_$assetArch\.tar\.gz$" } | Select-Object -First 1
  if (-not $asset) { throw "Could not find a zrok2 Windows $assetArch release asset." }

  $binDir = Join-Path $env:LOCALAPPDATA 'LNWJUD\bin'
  $archive = Join-Path $env:TEMP $asset.name
  New-Item -ItemType Directory -Force -Path $binDir | Out-Null
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $archive
  tar -xf $archive -C $binDir zrok2.exe
  Remove-Item $archive -Force

  $userPath = [Environment]::GetEnvironmentVariable('Path','User')
  if (($userPath -split ';') -notcontains $binDir) {
    [Environment]::SetEnvironmentVariable('Path', (($userPath.TrimEnd(';') + ';' + $binDir).TrimStart(';')), 'User')
  }
  $env:Path = "$binDir;$env:Path"
}

switch ($Provider) {
  'zrok' {
    Install-Zrok
    if (Has 'zrok2') {
      zrok2 version
      Write-Host ""
      Write-Host "If this environment is not enabled yet, run: zrok2 enable <YOUR_ENABLE_TOKEN>" -ForegroundColor Yellow
      Write-Host "Start Watcher sharing with:" -ForegroundColor Green
      Write-Host "  zrok2 share public $Target"
    }
  }
  'cloudflare' {
    Install-Winget 'Cloudflare.cloudflared' 'cloudflared'
    if (Has 'cloudflared') {
      cloudflared --version
      Write-Host ""
      Write-Host "Temporary test tunnel:" -ForegroundColor Green
      Write-Host "  cloudflared tunnel --url $Target"
      Write-Host "For a stable production URL, create an authenticated named tunnel; see docs/providers/cloudflare.md."
    }
  }
  'tailscale-serve' {
    Install-Winget 'Tailscale.Tailscale' 'tailscale'
    if (Has 'tailscale') {
      tailscale version
      Write-Host ""
      Write-Host "Private tailnet URL:" -ForegroundColor Green
      Write-Host "  tailscale serve --bg $Target"
      Write-Host "Check the assigned HTTPS URL with: tailscale serve status"
    }
  }
  'tailscale-funnel' {
    Install-Winget 'Tailscale.Tailscale' 'tailscale'
    if (Has 'tailscale') {
      tailscale version
      Write-Host ""
      Write-Host "Public HTTPS URL:" -ForegroundColor Green
      Write-Host "  tailscale funnel --bg $Target"
      Write-Host "Check the assigned HTTPS URL with: tailscale funnel status"
    }
  }
  'ngrok' {
    Install-Winget 'Ngrok.Ngrok' 'ngrok'
    if (Has 'ngrok') {
      ngrok version
      Write-Host ""
      Write-Host "If this machine is not authenticated yet, run: ngrok config add-authtoken <YOUR_AUTHTOKEN>" -ForegroundColor Yellow
      Write-Host "Start Watcher sharing with:" -ForegroundColor Green
      Write-Host "  ngrok http $Port"
    }
  }
}

Write-Host ""
Write-Host "Watcher origin: $Target"
Write-Host "Keep provider credentials on this runtime machine; do not paste them into lnwjud Watcher."
