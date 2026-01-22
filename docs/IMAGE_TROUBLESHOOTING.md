# Image Troubleshooting Guide

This document covers common image issues encountered in this project and how to fix them.

---

## Issue #1: HEIF/HEIC Images Disguised as PNG/JPG

### Problem
Images taken on iPhone are often saved as **HEIF/HEIC format** (High Efficiency Image Format), but the file extension may still show as `.PNG` or `.JPG`. Browsers **cannot display HEIF images**, so they appear broken or show a placeholder.

### Symptoms
- Image shows as broken/placeholder in the browser
- Image file exists and has correct path
- Direct URL to image shows tiny broken image icon
- File size seems correct

### How to Diagnose
Run this command to check the actual file format:
```bash
file /path/to/your/image.PNG
```

If the output shows `ISO Media, HEIF Image HEVC Main or Main Still Picture Profile`, it's a HEIF image, not a PNG/JPG!

### Solution
Convert the HEIF image to actual PNG using macOS's `sips` command:
```bash
sips -s format png "/path/to/source/image.PNG" --out "/path/to/destination/image.png"
```

**Note:** You may need to run this outside the sandbox (with full permissions).

---

## Issue #2: Case-Sensitive File Extensions

### Problem
macOS file system is case-insensitive by default, but **web servers and URLs are case-sensitive**. A file named `Image.PNG` will NOT load if the code references `Image.png`.

### Symptoms
- Image works locally on some systems but not others
- Image file exists but returns 404
- Path looks correct but image doesn't load

### How to Diagnose
List the directory and compare exact filenames:
```bash
ls -la /path/to/images/ | grep -i "filename"
```

Compare with what's in the code:
```bash
grep -r "filename" frontend/src/components/
```

### Solution
Either:
1. **Rename the file** to match the code (lowercase recommended)
2. **Update the code** to match the actual filename

**Best Practice:** Always use lowercase file extensions (`.png`, `.jpg`, `.jpeg`) for consistency.

---

## Issue #3: Images in Wrong Location

### Problem
In Vite projects, static assets should be in the `public/` folder, not `src/`. Images in `src/Image/` need to be imported, while images in `public/images/` can be referenced directly with `/images/filename.png`.

### File Structure
```
frontend/
├── public/
│   └── images/           ← Static images (reference as /images/...)
│       ├── photo1.png
│       └── photo2.jpg
└── src/
    └── Image/            ← Source images (must be imported)
        └── logo.png
```

### Solution
For most project images, copy them to `public/images/`:
```bash
cp "frontend/src/Image/photo.png" "frontend/public/images/photo.png"
```

Then reference in code as:
```javascript
const imageUrl = '/images/photo.png';
```

---

## Quick Checklist for Image Issues

1. ✅ **File exists?** - Check the exact path
2. ✅ **Correct location?** - Should be in `public/images/` for static assets
3. ✅ **Case matches?** - Extension and filename must match exactly
4. ✅ **Actual format?** - Run `file` command to verify it's really PNG/JPG
5. ✅ **Browser cache?** - Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
6. ✅ **Dev server restarted?** - Sometimes needed after adding new files

---

## Converting HEIF to PNG (Batch)

To convert all HEIF images in a folder:
```bash
for f in /path/to/images/*.PNG; do
  if file "$f" | grep -q "HEIF"; then
    echo "Converting: $f"
    sips -s format png "$f" --out "${f%.PNG}.png"
  fi
done
```

---

## Vite Configuration

Make sure `vite.config.js` includes image assets:
```javascript
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.PNG', '**/*.jpg', '**/*.png'],
})
```

---

*Last updated: January 2026*
