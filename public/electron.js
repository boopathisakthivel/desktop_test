const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}

const {app, BrowserWindow} = require('electron');
const i18n = require('electron-i18n');
const path = require('path');
const url = require('url');
const winston = require('winston');

let mainWindow;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

function createWindow () {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    frame: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  //mainWindow.maximize();
  //mainWindow.setMenu(null);
  //mainWindow.toggleDevTools();
  //mainWindow.setFullScreen(true);

  const splashPath = (process.env.ELECTRON_START_URL ? '/../public/splash.html' : '/../build/splash.html');
  let splash = new BrowserWindow({ width: 200, height: 200, frame: false, alwaysOnTop: true, background: 'darkred'  });
  splash.loadURL(url.format({
    pathname: path.join(__dirname, splashPath),
    hash: '/',
    protocol: 'file:',
    slashes: true
  }));

  const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
  mainWindow.loadURL(startUrl);
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    setTimeout(()=>{
      splash.destroy();
      mainWindow.maximize();
      mainWindow.show();
      logger.info(Object.keys(i18n.docs));
      logger.info(Object.keys(i18n.docs['en-US']));

      logger.info(i18n.docs['en-US']['/docs/api/app']);
    }, 2000);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})