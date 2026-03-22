const { app, BrowserWindow, ipcMain, screen, desktopCapturer, systemPreferences, dialog } = require('electron');
const path = require('path');

let robot;
try {
    robot = require('robotjs');
    // Configure robotjs for smooth movement
    robot.setMouseDelay(1);
    console.log('✅ RobotJS loaded successfully');
} catch (e) {
    console.error('❌ RobotJS failed to load:', e.message);
    console.warn('Mouse control will be simulated');
    robot = null;
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 700,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile('index.html');

    // Open dev tools to see errors
    mainWindow.webContents.openDevTools();

    // Check screen recording permission on macOS
    if (process.platform === 'darwin') {
        const screenAccess = systemPreferences.getMediaAccessStatus('screen');
        console.log('Screen recording permission:', screenAccess);

        if (screenAccess !== 'granted') {
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Permission Required',
                message: 'Screen Recording permission is required.',
                detail: 'Please go to System Preferences > Privacy & Security > Screen Recording and enable this app, then restart.',
                buttons: ['OK']
            });
        }

        // Check Accessibility permission for mouse/keyboard control
        const accessibilityAccess = systemPreferences.isTrustedAccessibilityClient(false);
        console.log('Accessibility permission:', accessibilityAccess);

        if (!accessibilityAccess) {
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Accessibility Permission Required',
                message: 'Accessibility permission is required for mouse/keyboard control.',
                detail: 'Please go to System Preferences > Privacy & Security > Accessibility and enable this app, then restart.\n\nWithout this permission, you can see the screen but cannot control it.',
                buttons: ['Open System Preferences', 'Later']
            }).then((result) => {
                if (result.response === 0) {
                    // Open System Preferences directly to Accessibility
                    require('electron').shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
                }
            });
        }
    }
}

app.whenReady().then(() => {
    createWindow();

    // Get screen sources for screen sharing
    ipcMain.handle('get-sources', async () => {
        try {
            console.log('Getting screen sources...');
            const sources = await desktopCapturer.getSources({
                types: ['screen', 'window'],
                thumbnailSize: { width: 150, height: 150 }
            });
            console.log(`Found ${sources.length} sources`);

            // Log all sources for debugging
            sources.forEach((s, i) => console.log(`  ${i}: ${s.id} - ${s.name}`));

            if (sources.length === 0) {
                // On macOS, empty sources usually means no permission
                if (process.platform === 'darwin') {
                    throw new Error('No sources found. Please grant Screen Recording permission in System Preferences > Privacy & Security > Screen Recording');
                }
                throw new Error('No screen sources available');
            }

            // Sort sources: screens first, then windows
            const sortedSources = sources.sort((a, b) => {
                const aIsScreen = a.id.startsWith('screen:');
                const bIsScreen = b.id.startsWith('screen:');
                if (aIsScreen && !bIsScreen) return -1;
                if (!aIsScreen && bIsScreen) return 1;
                return 0;
            });

            return sortedSources.map(source => ({
                id: source.id,
                name: source.name,
                thumbnail: source.thumbnail.toDataURL()
            }));
        } catch (err) {
            console.error('Error getting sources:', err);
            throw err;
        }
    });

    // Get screen dimensions
    ipcMain.handle('get-screen-size', () => {
        const primaryDisplay = screen.getPrimaryDisplay();
        return primaryDisplay.workAreaSize;
    });

    // Handle mouse movement from the WebRTC data channel
    ipcMain.on('mouse-move', (event, xPercent, yPercent) => {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;

        // Convert percentage to actual screen coordinates
        const targetX = Math.floor(width * xPercent);
        const targetY = Math.floor(height * yPercent);

        if (!robot) {
            console.log(`[NO ROBOTJS] Mouse move to: ${targetX}, ${targetY}`);
            return;
        }

        try {
            robot.moveMouse(targetX, targetY);
            console.log(`✅ Mouse moved to: ${targetX}, ${targetY}`);
        } catch (e) {
            console.error('❌ Mouse move error:', e.message);
        }
    });

    // Handle mouse click
    ipcMain.on('mouse-click', (event, button) => {
        if (!robot) {
            console.log(`[NO ROBOTJS] Mouse click: ${button}`);
            return;
        }

        try {
            robot.mouseClick(button || 'left');
            console.log(`✅ Mouse clicked: ${button || 'left'}`);
        } catch (e) {
            console.error('❌ Mouse click error:', e.message);
        }
    });

    // Handle mouse double click
    ipcMain.on('mouse-double-click', (event, button) => {
        if (!robot) {
            console.log(`[Simulated] Mouse double click: ${button}`);
            return;
        }

        try {
            robot.mouseClick(button || 'left', true);
        } catch (e) {
            console.error('Mouse double click error:', e);
        }
    });

    // Handle mouse scroll
    ipcMain.on('mouse-scroll', (event, deltaX, deltaY) => {
        if (!robot) {
            console.log(`[Simulated] Mouse scroll: ${deltaX}, ${deltaY}`);
            return;
        }

        try {
            robot.scrollMouse(deltaX, deltaY);
        } catch (e) {
            console.error('Mouse scroll error:', e);
        }
    });

    // Handle keyboard input
    ipcMain.on('key-tap', (event, key, modifiers) => {
        if (!robot) {
            console.log(`[Simulated] Key tap: ${key} with modifiers: ${modifiers}`);
            return;
        }

        try {
            robot.keyTap(key, modifiers || []);
        } catch (e) {
            console.error('Key tap error:', e);
        }
    });

    // Handle text typing
    ipcMain.on('type-text', (event, text) => {
        if (!robot) {
            console.log(`[Simulated] Type text: ${text}`);
            return;
        }

        try {
            robot.typeString(text);
        } catch (e) {
            console.error('Type text error:', e);
        }
    });

    // Handle lock screen
    ipcMain.on('lock-screen', (event) => {
        console.log('Locking screen...');
        try {
            if (process.platform === 'darwin') {
                // macOS: Use Ctrl+Cmd+Q to lock
                if (robot) {
                    robot.keyTap('q', ['control', 'command']);
                } else {
                    // Fallback: use pmset command
                    require('child_process').exec('pmset displaysleepnow');
                }
            } else if (process.platform === 'win32') {
                // Windows: Use rundll32 to lock
                require('child_process').exec('rundll32.exe user32.dll,LockWorkStation');
            } else {
                // Linux: Try various lock commands
                require('child_process').exec('xdg-screensaver lock || gnome-screensaver-command -l || dm-tool lock');
            }
            console.log('Screen lock command sent');
        } catch (e) {
            console.error('Lock screen error:', e);
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
