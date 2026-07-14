param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing

if (-not ('ChromaKey.Remover' -as [type])) {
  Add-Type -ReferencedAssemblies 'System.Drawing.dll' -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace ChromaKey {
  public static class Remover {
    public static void Convert(string inputPath, string outputPath) {
      using (var source = new Bitmap(inputPath))
      using (var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
        using (var graphics = Graphics.FromImage(bitmap)) {
          graphics.DrawImageUnscaled(source, 0, 0);
        }

        var rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
        var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        var bytes = Math.Abs(data.Stride) * bitmap.Height;
        var pixels = new byte[bytes];
        Marshal.Copy(data.Scan0, pixels, 0, bytes);

        for (var y = 0; y < bitmap.Height; y++) {
          for (var x = 0; x < bitmap.Width; x++) {
            var index = y * data.Stride + x * 4;
            var b = pixels[index];
            var g = pixels[index + 1];
            var r = pixels[index + 2];
            var dr = r;
            var dg = 255 - g;
            var db = b;
            var distance = Math.Sqrt(dr * dr + dg * dg + db * db);

            byte alpha;
            if (distance <= 38) alpha = 0;
            else if (distance >= 165) alpha = 255;
            else alpha = (byte)Math.Round((distance - 38) / 127.0 * 255.0);

            var neutral = Math.Max(r, b);
            var greenDominance = g - neutral;
            if (greenDominance > 25) {
              var dominanceAlpha = 255 - Math.Min(255, greenDominance * 2);
              alpha = (byte)Math.Min(alpha, dominanceAlpha);
              pixels[index + 1] = (byte)neutral;
            } else if (alpha < 255 && g > neutral) {
              pixels[index + 1] = (byte)neutral;
            }
            pixels[index + 3] = alpha;
          }
        }

        Marshal.Copy(pixels, 0, data.Scan0, bytes);
        bitmap.UnlockBits(data);
        Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
        bitmap.Save(outputPath, ImageFormat.Png);
      }
    }
  }
}
'@
}

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
[ChromaKey.Remover]::Convert($resolvedInput, $resolvedOutput)
Write-Output $resolvedOutput
