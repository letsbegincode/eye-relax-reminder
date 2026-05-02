/**
 * compress-videos.js
 *
 * Compresses all .webm / .mp4 files in the `videos/` folder using ffmpeg.
 * Originals are backed up to `videos/_originals/` before compression.
 *
 * Usage:
 *   npm run compress-videos
 *
 * Requires:
 *   npm install --save-dev @ffmpeg-installer/ffmpeg fluent-ffmpeg
 */

const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

// Try to use @ffmpeg-installer/ffmpeg (bundled), fall back to system ffmpeg
let ffmpegPath;
try {
  ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  console.log(`Using bundled ffmpeg: ${ffmpegPath}`);
} catch {
  // Try system ffmpeg
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    ffmpegPath = 'ffmpeg';
    console.log('Using system ffmpeg');
  } catch {
    console.error('\n❌ ffmpeg not found!\n');
    console.error('Install it via one of these methods:');
    console.error('  npm install --save-dev @ffmpeg-installer/ffmpeg fluent-ffmpeg');
    console.error('  OR download from https://ffmpeg.org/download.html\n');
    process.exit(1);
  }
}

const VIDEOS_DIR = path.join(__dirname, '..', 'videos');
const BACKUP_DIR = path.join(VIDEOS_DIR, '_originals');

// ─── Config ──────────────────────────────────────────────────────────────────
// VP9 CRF: 0 (lossless) → 63 (worst). 33–40 is a good range for alpha webm.
// Higher = smaller file, lower quality. 36 is a solid balance.
const VP9_CRF = 36;
const VP9_SPEED = 2;   // 0 (slowest/best) – 5 (fastest). 2 = good quality
// ─────────────────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(inputPath).toLowerCase();
    const isWebm = ext === '.webm';

    // Build ffmpeg args
    const args = [
      '-i', inputPath,
      '-y',
    ];

    if (isWebm) {
      // VP9 with alpha support — keep transparency
      args.push(
        '-c:v', 'libvpx-vp9',
        '-crf', String(VP9_CRF),
        '-b:v', '0',               // use CRF (constrained quality) mode
        '-cpu-used', String(VP9_SPEED),
        '-pix_fmt', 'yuva420p',    // preserve alpha channel
        '-auto-alt-ref', '0',      // required for alpha in VP9
        '-an',                     // no audio (transparency overlays rarely need it)
      );
    } else {
      // Generic MP4 — H.264 with quality preset
      args.push(
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'slow',
        '-movflags', '+faststart',
      );
    }

    args.push(outputPath);

    console.log(`\n📦 Compressing: ${path.basename(inputPath)}`);
    console.log(`   Command: ${ffmpegPath} ${args.join(' ')}`);

    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
      // Show progress lines
      const line = d.toString().trim();
      if (line.startsWith('frame=') || line.startsWith('size=')) {
        process.stdout.write(`\r   ${line}`);
      }
    });

    proc.on('close', (code) => {
      process.stdout.write('\n');
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}\n${stderr}`));
      }
    });

    proc.on('error', reject);
  });
}

async function main() {
  ensureDir(BACKUP_DIR);

  const files = fs.readdirSync(VIDEOS_DIR).filter(
    (f) => ['.webm', '.mp4'].includes(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log('No video files found in videos/ directory.');
    return;
  }

  console.log(`\n🎬 Found ${files.length} video(s) to compress\n`);
  console.log(`Settings: VP9 CRF=${VP9_CRF}, speed=${VP9_SPEED}`);
  console.log('─'.repeat(60));

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of files) {
    const inputPath = path.join(VIDEOS_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const tempOutput = path.join(VIDEOS_DIR, `__compressed__${file}`);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    // Backup original if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`✅ Backed up original → videos/_originals/${file}`);
    }

    try {
      await compressVideo(inputPath, tempOutput);

      const compressedSize = fs.statSync(tempOutput).size;
      totalCompressed += compressedSize;

      const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

      // Replace original with compressed
      fs.renameSync(tempOutput, inputPath);

      console.log(`   Original:   ${formatBytes(originalSize)}`);
      console.log(`   Compressed: ${formatBytes(compressedSize)}`);
      console.log(`   Saved:      ${reduction}% 🎉`);
    } catch (err) {
      // Clean up temp if it exists
      if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
      console.error(`❌ Failed to compress ${file}:`, err.message);
    }
  }

  console.log('\n' + '─'.repeat(60));
  const totalReduction = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);
  console.log(`\n✨ Done!`);
  console.log(`   Total before: ${formatBytes(totalOriginal)}`);
  console.log(`   Total after:  ${formatBytes(totalCompressed)}`);
  console.log(`   Total saved:  ${totalReduction}%`);
  console.log(`\n   Originals backed up in: videos/_originals/`);
  console.log(`   To restore: copy files from _originals/ back to videos/\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
