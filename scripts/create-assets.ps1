Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
[System.IO.Directory]::CreateDirectory((Join-Path $projectRoot 'assets')) | Out-Null
[System.IO.Directory]::CreateDirectory((Join-Path $projectRoot 'public')) | Out-Null
function New-BrandImage([int]$size, [int]$fontSize, [string]$destination) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#211e1a'))
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $font = New-Object System.Drawing.Font('Georgia', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#f5f0e7'))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rectangle = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $graphics.DrawString('BS', $font, $brush, $rectangle, $format)
    $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $format.Dispose(); $brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}
New-BrandImage 1024 350 (Join-Path $projectRoot 'assets/icon.png')
New-BrandImage 2732 640 (Join-Path $projectRoot 'assets/splash.png')
New-BrandImage 64 24 (Join-Path $projectRoot 'public/favicon.png')
Write-Output 'Imagens fonte geradas: icon.png 1024x1024 e splash.png 2732x2732.'
