import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
} from 'electron';

import PATH from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = PATH.dirname(__filename);

const PATH_TO_ICON = '../public/construction.svg';
const PATH_TO_TRAY_ICON = 'assets/tray_icon.ico';

let win;
let tray = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    // frame: false,
    resizable: true,
    hasShadow: true,
    movable: true,
    focusable: true,
    icon: nativeImage.createFromPath(PATH_TO_ICON),
    backgroundMaterial: 'acrylic',
    minimizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: PATH.join(__dirname, 'preload.mjs'),
    },
  });
  // win.webContents.openDevTools();

  tray = new Tray(nativeImage.createFromPath(PATH_TO_TRAY_ICON));

  const CONTEXT_MENU = Menu.buildFromTemplate([
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('digitalChroniclesApp');
  tray.setContextMenu(CONTEXT_MENU);

  win.webContents.on('before-input-event', (event, input) => {
    const bounds = win.getBounds();

    /**
     * Передвижение окна стрелками
     */
    const step = 1;
    if (input.type === 'keyDown') {
      switch (input.key) {
        case 'ArrowLeft':
          win.setBounds({x: bounds.x - step, y: bounds.y});
          break;
        case 'ArrowRight':
          win.setBounds({x: bounds.x + step, y: bounds.y});
          break;
        case 'ArrowUp':
          win.setBounds({x: bounds.x, y: bounds.y - step});
          break;
        case 'ArrowDown':
          win.setBounds({x: bounds.x, y: bounds.y + step});
          break;
      }
    }

    if (input.type === 'keyDown' && input.key === 'Escape') {
      win.close();
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173').then(() => false);
  } else {
    win.loadFile(PATH.join(__dirname, '../dist/index.html')).then(() => false);
  }
});