# Features Overview

√964 Pinocchio Experience includes several interactive modules and features.

## Main Modules

### 1. Overview Module

The Overview module displays all uploaded files in a grid layout.

**Features:**
- File type icons and previews
- Search by filename, extension, or type
- Filter by file type (images, videos, audio, code, etc.)
- Filter by specific extension
- Sort by size or name (ascending/descending)
- Click any file to open it in the viewer

**Supported Searches:**
- Filename: `myfile`
- Extension: `.jpg`
- Type: `images`, `video`, `audio`, `code`

### 2. Upload Module

The primary module for file management and code execution.

**File Upload:**
- Drag and drop files onto the viewer
- Click "UPLOAD FILE" for single/multiple files
- Click "UPLOAD FOLDER" to upload entire directories
- Create new code files with the "+" button

**File Viewer:**
- Image preview with zoom
- Video player with full controls
- Audio player
- PDF document viewer
- Font preview
- Code syntax display
- 3D model detection

**Code Execution:**
- Supports HTML, JavaScript, JSX, TypeScript
- Real-time output display
- Sandbox mode for security
- Edit and run code files

### 3. Database Module (Network Speedometer)

Test and analyze your network connection.

**Features:**
- Download speed test
- Upload speed test
- Connection type detection
- Latency measurement
- Results summary with:
  - Connection rank (Neural Link → Copper Wire)
  - 1GB file download estimate
  - HD streaming capacity

### 4. Modules (Reserved)

This section is reserved for future feature expansion.

---

## System Monitor

The top-right corner displays real-time system metrics:

- **CPU** - Simulated processor usage (with alert animation at 80%+)
- **MEM** - JavaScript heap memory usage
- **NET** - Simulated network activity

When CPU or memory exceeds 80%, the indicator pulses red with ripple effects.

---

## Audio System

The application includes subtle sound effects powered by the Web Audio API:

- **Click sounds** - Button presses
- **Hover sounds** - Menu item hovering
- **Boot sound** - Entering the dashboard
- **Keystroke sounds** - Code editor typing
- **Scan sound** - Speed test initiation
- **Success sound** - Completed actions

All sounds are procedurally generated (no audio files needed).

---

## Video Player

Full-featured video player with:

**Controls:**
- Play/Pause button
- Progress bar with seek preview
- Mute/Unmute toggle
- Fullscreen toggle
- Volume display

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| Space | Play/Pause |
| M | Mute/Unmute |
| F | Fullscreen |
| ↑ | Volume up |
| ↓ | Volume down |

**Features:**
- Time preview on progress bar hover
- Error handling with visual feedback
- On-screen feedback for actions
- Double-click for fullscreen

---

## Supported File Types

### Images
jpg, jpeg, png, gif, bmp, tiff, webp, svg, heif, heic, psd

### Video
mp4, mov, avi, mkv, flv, wmv, webm, m4v, mpg, mpeg, 3gp, ts

### Audio
mp3, wav, aac, flac, ogg, m4a, wma, aiff, alac

### Documents
pdf, doc, docx, rtf, odt, xls, xlsx, ppt, pptx, epub

### Code
html, css, js, py, java, cpp, c, php, rb, swift, go, ts, json, sql, txt

### Archives
zip, rar, 7z, tar, gz, bz2, xz

### Fonts
ttf, otf, woff, woff2, eot

### 3D Models
obj, fbx, stl, blend, dae, 3ds

### Executables
exe, msi, app, bat, sh, dmg, apk

---

## Visual Effects

### Scanlines
Classic CRT monitor effect overlay

### Noise
Subtle film grain texture

### Glitch Text
Hover effect on interactive elements

### Page Transitions
Smooth fade-in animations

### Ripple Alerts
Pulsing red rings for system alerts

---

## Responsive Design

The application is optimized for multiple screen sizes and aspect ratios:

### Desktop
- Full sidebar navigation
- Complete system monitor display
- Large file preview area

### Tablet
- Condensed navigation
- Maintained functionality

### Mobile
- Horizontal scrolling navigation
- Touch-friendly buttons (44px minimum)
- Dynamic viewport height (100dvh)
- Safe area insets for notched devices

### Supported Aspect Ratios
- 16:9 (standard widescreen)
- 16:10 (laptop displays)
- 18:9 (modern smartphones)
- 20:9 (tall smartphones)
- 21:9 (ultrawide monitors)

---

## Accessibility

- Keyboard navigation support
- Reduced motion mode support
- High contrast design
- Screen reader compatible structure
- Touch-friendly button sizes
