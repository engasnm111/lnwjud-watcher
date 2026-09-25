import { app, BrowserWindow, Menu, Tray, nativeImage, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;
let tray = null;
let quitting = false;

const appRoot = path.join(__dirname, '..');
const iconPath = path.join(appRoot, 'public', 'icon-512.png');
const indexPath = path.join(appRoot, 'dist', 'index.html');

function isExternalUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function showWindow() {
  if (!mainWindow) return;
  if (process.platform === 'darwin') app.dock?.show();
  mainWindow.show();
  mainWindow.focus();
}

function hideWindow() {
  if (!mainWindow) return;
  mainWindow.hide();
  if (process.platform === 'darwin') app.dock?.hide();
}

function createWindow() {
  const icon = nativeImage.createFromPath(iconPath);
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 760,
    minHeight: 560,
    show: true,
    backgroundColor: '#070b12',
    title: 'lnwjud Watcher',
    icon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  void mainWindow.loadFile(indexPath).catch((error) => {
    console.error('Failed to load Watcher UI:', error);
  });

  mainWindow.on('close', (event) => {
    if (quitting) return;
    event.preventDefault();
    hideWindow();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('file:')) return;
    event.preventDefault();
    if (isExternalUrl(url)) void shell.openExternal(url);
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 20, height: 20 });
  tray = new Tray(trayIcon);
  tray.setToolTip('lnwjud Watcher');

  const rebuildMenu = () => {
    const visible = Boolean(mainWindow?.isVisible());
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: visible ? 'Hide Watcher' : 'Show Watcher',
        click: () => visible ? hideWindow() : showWindow()
      },
      {
        label: 'Setup guide',
        click: () => void shell.openExternal('https://github.com/engasnm111/lnwjud-watcher/blob/main/docs/INSTALL.md')
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          quitting = true;
          app.quit();
        }
      }
    ]));
  };

  tray.on('click', () => {
    if (mainWindow?.isVisible()) hideWindow();
    else showWindow();
    rebuildMenu();
  });
  tray.on('right-click', rebuildMenu);
  rebuildMenu();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', showWindow);

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
    createTray();
  });

  app.on('activate', showWindow);

  app.on('before-quit', () => {
    quitting = true;
  });

  app.on('window-all-closed', () => {
    // Keep running in the system tray until Quit is selected.
  });
}
