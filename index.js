const { app, BrowserWindow } = require('electron');
const ps = require('ps-node');
const DiscordRPC = require('discord-rpc');
const { autoUpdater } = require('electron-updater');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = false;

Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    }
  });
  
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

let rpc;
const data = Date.now()

function createWindow() {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
  
    win.loadFile('index.html');
  
    // Dodaj właściwość logsSent do obiektu win
    win.logsSent = {};

      // Włącz/Wyłącz sprawdzanie aktualizacji
     //autoUpdater.checkForUpdates();
     
     autoUpdater.on('update-available', (info) => {
    })
    autoUpdater.on('update-not-available', (info) => {
      sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (message) => {
      console.error('There was a problem updating the application')
      console.error(message)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Pobrano ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      //sendStatusToWindow(log_message);
      const pobieraie = {
        type: 'info',
        title: 'Pobieranie aktualizacji...',
        message: log_message,
      }
      dialog.showMessageBox(pobieraie)
    })
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'question',
        buttons: ['Restart', 'Później'],
        title: 'Aktualizacja aplikacji.',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
          'Nowa wersja została pobrana. Czy chcesz zrestartować aplikację aby ją zainstalować?',
      }
    
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
    })
  
    return win;
  }

function checkProcess() {
  ps.lookup({ command: 'wow64_helper.exe' }, (err, resultList) => {
    if (err) {
      throw new Error(err);
    }

    if (resultList.length > 0 && !win.logsSent.isRunning) {
      win.webContents.send('log', 'MTA jest włączone! ✅');
      win.logsSent.isRunning = true;
      setRichPresence();
    } else if (resultList.length === 0 && win.logsSent.isRunning) {
      win.webContents.send('log', 'MTA jest wyłączone! ❌');
      win.logsSent.isRunning = false;
      clearRichPresence();
    }
  });
}

function setRichPresence() {
  rpc.setActivity({
    largeImageKey: 'mta',
    instance: false,
    startTimestamp: data,
  })
    .then(() => {
      if (!win.logsSent.richPresenceSet) {
        win.webContents.send('log', 'Status Discord ustawiony! ✅');
        win.logsSent.richPresenceSet = true;
      }
    })
    .catch(console.error);
}

function clearRichPresence() {
  rpc.clearActivity()
    .then(() => {
      if (!win.logsSent.richPresenceCleared) {
        win.webContents.send('log', 'Status Discord usunięty! ❌');
        win.logsSent.richPresenceCleared = true;
      }
    })
    .catch(console.error);
}

app.whenReady().then(() => {
  rpc = new DiscordRPC.Client({ transport: 'ipc' });
  rpc.on('ready', () => {
    if (!win.logsSent.richPresenceReady) {
      win.webContents.send('log', 'Status Discord jest gotowy! ✅');
      win.logsSent.richPresenceReady = true;
    }
    checkProcess();
    setInterval(checkProcess, 5000);
  });

  rpc.login({ clientId: '1081236894689538058' }).catch(console.error);

  createWindow();
  win.webContents.on('did-finish-load', () => {
    if (!win.logsSent.windowLoaded) {
    win.webContents.send('log', 'Program załadowany! ✅');
    win.logsSent.windowLoaded = true;
    }
    });
    });
    
    // Obsługa zdarzenia zamykania aplikacji
    app.on('window-all-closed', () => {
    // Na systemach macOS aplikacja działa w tle po zamknięciu okna
    if (process.platform !== 'darwin') {
    app.quit();
    }
    });
    
    app.on('activate', () => {
    // Na systemach macOS aplikacja powinna utworzyć nowe okno po kliknięciu na ikonę w dock'u,
    // gdy nie ma żadnych aktywnych okien
    if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    }
    });
