# Remote Desktop Control App

Control your PC from your phone using WebRTC - **locally on your network!**

## Features

- ✅ Real-time screen streaming via WebRTC
- ✅ Touch-based mouse control (touchpad mode)
- ✅ Left/Right click support
- ✅ Scroll mode for two-finger scrolling
- ✅ Keyboard input with voice support
- ✅ QR code for easy phone connection
- ✅ Pinch-to-zoom on remote screen
- ✅ Zero-install mobile app (PWA)

## Quick Start (30 seconds!)

```bash
# 1. Install dependencies
npm install

# 2. Start everything (server + desktop app)
npm start
```

That's it! You'll see:
- Desktop app opens with screen sharing interface
- Connection URL appears in console (use on same network)
- QR code ready to scan
- Room code displayed

## Connecting Your Phone

### Option 1: Scan QR Code (Easiest!) 📱
1. Open phone camera
2. Point at QR code on PC screen
3. Tap the link

### Option 2: Manual Connection
1. Copy the Network Access URL from PC console
2. Open on phone browser
3. Connected! 🎉

## How to Use

### On Your Phone:
- **Tap** - Left click at that position
- **Double Tap** - Double click
- **Drag** - Move the mouse cursor
- **Pinch** - Zoom in/out on screen
- **Scroll Mode** - Two-finger scrolling
- **Keyboard** - Type text directly
- **Voice** - Speech-to-text input
- **Left/Right Click** - Manual click buttons

### Buttons:
- **Left/Right** - Mouse clicks
- **Scroll** - Toggle scroll mode
- **Keyboard** - Open text input
- **Fullscreen** - Enter fullscreen
- **Lock** - Lock your PC
- **Voice** - Speech recognition
- **Mute** - Toggle audio
- **Zoom +/-** - Zoom controls

## Building the Desktop App

To create a standalone executable:

```bash
# For macOS
npm run build:mac

# For Windows
npm run build:win

# For Linux
npm run build:linux
```

The built app will be in the `dist` folder.

## Network Requirements

- Both devices must be on the same WiFi network
- Phone and PC on same local network
- Port 3000 should be accessible

## Tech Stack

- **Electron** - Desktop app framework
- **WebRTC** - Real-time peer-to-peer streaming
- **Socket.io** - Signaling server
- **RobotJS** - Native mouse/keyboard control

## Troubleshooting

**Mouse control not working?**
- RobotJS requires accessibility permissions on macOS
- Go to System Preferences > Security & Privacy > Accessibility
- Add the app to the list

**Can't connect from phone?**
- Ensure both devices are on the same network
- Check if port 3000 is not blocked by firewall
- Try using your computer's IP address directly from console output

**Server won't start?**
- Check if port 3000 is in use: `lsof -i :3000`
- Change PORT in `.env` if needed

## License

MIT

---

**Made with ❤️ - Control your PC from your phone! 📱**
# webrtc-remote-desktop
