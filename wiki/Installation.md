# Installation Guide

This guide covers all installation methods for √964 Pinocchio Experience.

## Web Browser (No Installation)

The easiest way to use the application is through your web browser:

**[https://anacondy.github.io/root_964_experience/](https://anacondy.github.io/root_964_experience/)**

Compatible browsers:
- Google Chrome 90+
- Mozilla Firefox 90+
- Microsoft Edge 90+
- Safari 14+
- Opera 76+

---

## Windows Installation

### Method 1: Portable Package

1. Download `root-964-experience-x.x.x-windows.zip` from [Releases](https://github.com/anacondy/root_964_experience/releases)

2. Right-click the downloaded file and select "Extract All..."

3. Choose an extraction location (e.g., `C:\Programs\root-964-experience`)

4. Open the extracted folder

5. Double-click `start.bat` to launch

### Method 2: Direct Browser

1. Download and extract as above
2. Open `index.html` directly in your preferred browser

### Windows Firewall

The application runs entirely offline. No firewall exceptions are needed.

---

## Linux Installation

### Method 1: Portable Package

```bash
# Download the latest release
wget https://github.com/anacondy/root_964_experience/releases/latest/download/root-964-experience-linux.tar.gz

# Extract
tar -xzvf root-964-experience-linux.tar.gz

# Navigate to the folder
cd root-964-experience

# Run the launcher
./start.sh
```

### Method 2: Manual Browser Launch

```bash
# After extraction, open index.html in your browser
xdg-open index.html
# or
firefox index.html
# or
google-chrome index.html
```

### Permissions

If `start.sh` doesn't run, ensure it's executable:
```bash
chmod +x start.sh
```

---

## Android Installation

### Method 1: APK Installation

1. Download `root-964-experience-x.x.x.apk` from [Releases](https://github.com/anacondy/root_964_experience/releases)

2. Enable installation from unknown sources:
   - Go to **Settings** → **Security** (or **Privacy**)
   - Enable **Unknown sources** or **Install unknown apps**
   - On newer Android versions, you may need to grant permission per-app

3. Open the downloaded APK file

4. Tap **Install** when prompted

5. Once installed, find and launch **Root 964 Experience** from your app drawer

### Method 2: PWA Installation

1. Open [https://anacondy.github.io/root_964_experience/](https://anacondy.github.io/root_964_experience/) in Chrome

2. Tap the three-dot menu (⋮)

3. Select **Add to Home screen** or **Install app**

4. Confirm by tapping **Add**

5. The app will appear on your home screen

---

## iOS Installation (PWA)

iOS doesn't support APK files. Use the PWA installation method:

1. Open [https://anacondy.github.io/root_964_experience/](https://anacondy.github.io/root_964_experience/) in **Safari**

2. Tap the **Share** button (square with upward arrow)

3. Scroll down and tap **Add to Home Screen**

4. Edit the name if desired, then tap **Add**

5. The app icon will appear on your home screen

### Note for iOS Users

- Must use Safari (Chrome on iOS doesn't support PWA installation)
- The app will work offline after first load
- Notifications are not supported on iOS

---

## macOS Installation

### Method 1: Browser Access

Simply visit [https://anacondy.github.io/root_964_experience/](https://anacondy.github.io/root_964_experience/) in any browser.

### Method 2: PWA Installation (Chrome)

1. Open the live site in Google Chrome
2. Click the install icon (⊕) in the address bar
3. Click **Install** in the prompt
4. The app will open in its own window and appear in your Applications

### Method 3: Local Files

1. Download the Linux package (works on macOS too)
2. Extract the `.tar.gz` file
3. Open `index.html` in your browser

---

## Updating the Application

### Web Version

The web version updates automatically when you refresh the page.

### Installed Versions

1. Download the latest release from [Releases](https://github.com/anacondy/root_964_experience/releases)
2. Remove or replace the old installation
3. Extract and run the new version

### PWA Updates

PWA installations update automatically when connected to the internet. Force an update by:
1. Opening the app
2. Pulling down to refresh (mobile) or pressing F5 (desktop)

---

## Uninstallation

### Windows
Delete the extracted folder

### Linux
```bash
rm -rf /path/to/root-964-experience
```

### Android
Settings → Apps → Root 964 Experience → Uninstall

### iOS/macOS PWA
Long-press the app icon → Remove App (iOS) or Move to Trash (macOS)

---

## Troubleshooting Installation

See the [Troubleshooting Guide](Troubleshooting.md) for common issues.
