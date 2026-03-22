# Remote Desktop Control - Setup Guide

Control your PC from your phone using WebRTC on your local network.

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. You'll See
```
===========================================
   Remote Desktop Signaling Server
===========================================

Server running on port 3000

Local access:    http://localhost:3000
Network access:  http://192.168.x.x:3000

===========================================
```

### 4. Connect Your Phone
- **Easiest:** Scan the QR code with your phone camera
- **Manual:** Open `http://192.168.x.x:3000` from phone on same WiFi
- **Room Code:** You'll see a 6-digit room code on desktop

---

## 🖥️ Desktop Setup (PC - Server Side)

### Run the App
```bash
npm start
```

This launches:
- The signaling server (port 3000)
- Desktop window for screen sharing

### What You'll See
1. **Room Code** - 6-digit identifier
2. **QR Code** - Scan with phone
3. **Connection URL** - Copy to phone
4. **Server addresses** - In console

---

## 📱 Mobile Setup (Phone - Client Side)

### Make Sure
- Phone is on **same WiFi** as PC
- Both devices can see each other on network

### Connect (3 Options)

#### Option 1: Scan QR Code
1. Open phone camera
2. Point at QR code on PC
3. Tap the link shown

#### Option 2: Copy URL
1. From PC console, copy: `http://192.168.x.x:3000`
2. Add room code: `http://192.168.x.x:3000/?room=123456`
3. Open URL on phone browser

#### Option 3: Manual Entry
1. From console, get your PC's IP and room code
2. Type URL in phone browser
3. Press connect

---

## 🎮 Mobile Controls

Once connected:

### Gestures
- **Tap** = Left click at that position
- **Double Tap** = Double click
- **Swipe** = Move mouse cursor
- **Pinch** = Zoom in/out
- **Drag** (when zoomed) = Pan around

### Buttons
- **◻ Left/Right Click** - Mouse clicks
- **↕ Scroll** - Toggle scroll mode
- **⌨ Keyboard** - Type text
- **📐 Fullscreen** - Enter fullscreen
- **🔒 Lock** - Lock PC screen
- **🎤 Voice** - Speech-to-text
- **🔊 Mute/Audio** - Toggle sound
- **🔍 Zoom In/Out** - Zoom control

---

## ⚙️ Configuration

### Edit `.env` file
```bash
# Change port if needed
PORT=3000
```

Copy `.env.example` to `.env` and edit if you need to customize.

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# If so, kill the process or change PORT in .env
```

### Phone can't connect
1. Make sure phone and PC are on **same WiFi**
2. Check firewall isn't blocking port 3000
3. Verify PC's IP address from console
4. Try restarting app: `npm start`

### Mouse not working
Mac only: Go to System Preferences > Security & Privacy > Accessibility
- Add your terminal/app to the list

### Screen goes black
- Try restarting screen sharing on desktop
- Check WiFi connection is stable

---

## 📋 Commands

```bash
# Install dependencies
npm install

# Start everything (server + desktop app)
npm start

# Start only server
npm run server

# Start only desktop app
npm run app

# Build standalone installers
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:linux    # Linux
```

---

## 🛠️ File Structure

```
webrtc/
├── server.js            # Signaling server
├── main.js             # Electron main process
├── preload.js          # Electron security
├── index.html          # Desktop app UI
├── public/
│  └── index.html       # Mobile web app
├── package.json        # Dependencies
└── .env.example        # Config template
```

---

## 📊 How It Works

1. **Desktop** shares screen via WebRTC
2. **Signaling Server** helps establish connection (port 3000)
3. **Mobile** receives screen stream
4. **Mobile** sends touch/keyboard commands back
5. **No data** goes through internet (local only)

---

## ✋ Requirements

- **Node.js v14+** - Download from nodejs.org
- **Same WiFi** - Phone and PC must be connected to same network
- **Open Port 3000** - Firewall must allow connections

---

## 🎁 Features

✅ Real-time screen streaming
✅ Touch mouse control
✅ Keyboard input
✅ Voice commands
✅ Zoom in/out
✅ QR code connect
✅ Lock screen
✅ Works on Mac, Windows, Linux

---

## 💡 Tips

- Use 5GHz WiFi for better speed
- Keep phone and PC close
- Reduce zoom to 100% for lower latency
- Close other apps using bandwidth
- Use Ethernet for PC if possible

---

**That's all! You're ready to control your PC from your phone! 🚀**
