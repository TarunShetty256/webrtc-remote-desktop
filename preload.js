const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Mouse controls
    moveMouse: (xPercent, yPercent) => ipcRenderer.send('mouse-move', xPercent, yPercent),
    clickMouse: (button) => ipcRenderer.send('mouse-click', button),
    doubleClickMouse: (button) => ipcRenderer.send('mouse-double-click', button),
    scrollMouse: (deltaX, deltaY) => ipcRenderer.send('mouse-scroll', deltaX, deltaY),

    // Keyboard controls
    keyTap: (key, modifiers) => ipcRenderer.send('key-tap', key, modifiers),
    typeText: (text) => ipcRenderer.send('type-text', text),

    // System controls
    lockScreen: () => ipcRenderer.send('lock-screen'),

    // Screen capture
    getSources: () => ipcRenderer.invoke('get-sources'),
    getScreenSize: () => ipcRenderer.invoke('get-screen-size')
});
