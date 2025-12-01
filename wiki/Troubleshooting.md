# Troubleshooting

Common issues and solutions for √964 Pinocchio Experience.

## Display Issues

### Blank or White Screen

**Cause:** JavaScript is disabled or failed to load

**Solutions:**
1. Enable JavaScript in your browser settings
2. Clear browser cache and refresh
3. Try a different browser
4. Disable browser extensions that might block scripts

### Fonts Not Loading

**Cause:** Google Fonts blocked by network or extension

**Solutions:**
1. Check internet connection
2. Disable ad blockers temporarily
3. Fonts will fall back to system fonts automatically

### Images Not Loading

**Cause:** External image URLs blocked

**Solutions:**
1. This may happen on corporate networks
2. The application still functions without the hero image
3. Uploaded files will display normally

### Choppy Animations

**Cause:** Hardware acceleration disabled or weak GPU

**Solutions:**
1. Enable hardware acceleration:
   - Chrome: Settings → System → Use hardware acceleration
   - Firefox: Settings → Performance → Use hardware acceleration
2. Close other resource-heavy applications
3. Reduce browser zoom level to 100%
4. Users with epilepsy can enable "Reduce Motion" in OS settings

---

## Audio Issues

### No Sound Effects

**Cause:** Browser blocked autoplay or Web Audio API

**Solutions:**
1. Click anywhere on the page to enable audio context
2. Check browser's site permissions for audio
3. Ensure system volume is on
4. Some browsers block audio until user interaction

### Distorted Audio

**Cause:** Too many simultaneous sounds

**Solutions:**
1. This is rare but can happen with rapid clicking
2. Refresh the page to reset audio context

---

## File Upload Issues

### Files Won't Upload

**Cause:** File size too large or browser limitation

**Solutions:**
1. Files are processed in-browser, very large files may be slow
2. Try smaller files first
3. Some browsers limit the number of concurrent file handles

### Video Won't Play

**Cause:** Unsupported codec

**Solutions:**
1. Convert video to MP4 with H.264 codec
2. Try a different browser (Chrome supports most formats)
3. Check browser console for specific error messages

### Code Won't Execute

**Cause:** Syntax error or sandbox restrictions

**Solutions:**
1. Check for JavaScript syntax errors
2. Disable sandbox mode for code that needs external resources
3. Note: Some APIs are restricted in sandboxed iframes

---

## Installation Issues

### Android APK Won't Install

**Causes & Solutions:**

1. **Unknown sources disabled**
   - Go to Settings → Security → Enable "Unknown sources"
   - On Android 8+: Settings → Apps → Your Browser → Install unknown apps

2. **Storage full**
   - Free up space and try again

3. **Corrupted download**
   - Re-download the APK file
   - Check file size matches the one on releases page

### iOS PWA Won't Install

**Solutions:**
1. Must use Safari (not Chrome)
2. Make sure you're on the live site URL
3. Try force-closing Safari and reopening

### Windows Defender Warning

**Cause:** Unsigned executable

**Solution:**
1. Click "More info" → "Run anyway"
2. The package only contains HTML/JS/CSS files
3. Alternatively, open `index.html` directly in browser

---

## Performance Issues

### High CPU Usage

**Causes & Solutions:**
1. Too many files uploaded - remove unused files
2. Complex video playing - pause when not needed
3. Many browser tabs open - close unused tabs

### Memory Warnings

**Cause:** Many large files loaded

**Solutions:**
1. Remove files from the deck when done viewing
2. Refresh the page to clear memory
3. Upload fewer files at once

### Slow Initial Load

**Causes & Solutions:**
1. First load requires downloading fonts
2. Subsequent loads use cached resources
3. PWA version loads faster after installation

---

## Network Speed Test Issues

### Test Stuck at 0

**Cause:** Network API not available

**Solutions:**
1. This test provides simulated results
2. Actual download tests would require a server
3. The test estimates based on connection metadata

### Inaccurate Results

**Note:** The speed test provides estimates based on:
- `navigator.connection` API data
- Simulated load patterns

For accurate speed tests, use dedicated services like fast.com or speedtest.net.

---

## Mobile-Specific Issues

### Touch Not Responsive

**Solutions:**
1. Ensure zoom is at 100%
2. Try landscape orientation
3. Clear browser cache

### Keyboard Covers Input

**Solutions:**
1. Scroll up after keyboard appears
2. Use the back button to dismiss keyboard
3. Rotate to landscape mode

### Screen Cutoff (Notched Phones)

**Note:** The app uses safe-area-inset CSS for notched phones. If content is still cut off:
1. Use the app in portrait mode
2. Try a different browser
3. Enable "Display in full screen" if your browser offers it

---

## Browser Compatibility

### Minimum Supported Versions

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90 |
| Firefox | 90 |
| Safari | 14 |
| Edge | 90 |
| Opera | 76 |

### Known Incompatibilities

- **Internet Explorer** - Not supported
- **Chrome < 90** - May have animation issues
- **Safari < 14** - Limited Web Audio API support
- **Firefox Mobile** - PWA installation not supported

---

## Getting Help

If your issue isn't listed here:

1. Check [GitHub Issues](https://github.com/anacondy/root_964_experience/issues)
2. Open a new issue with:
   - Browser name and version
   - Operating system
   - Steps to reproduce
   - Any error messages from browser console (F12 → Console)
