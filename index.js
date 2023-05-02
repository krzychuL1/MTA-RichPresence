const { app, BrowserWindow, ipcMain } = require('electron');
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

function createWindow() {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,    
      },
    });

    ipcMain.on('reset-rpc-status', () => {
      currentStatus = null;
      currentStatus2 = null;
  setRichPresence();
  win.webContents.send('log', `Statu został zresetowany! ✅`);
    });

    let currentStatus = null;

    ipcMain.on('set-status', (event, status) => {
      if (currentStatus === status) {
        win.webContents.send('log', `Status frakcyjny "${status}" jest już ustawiony! ❌`);
        return;
      }
      const data = Date.now()
      switch (status) {
          case 'San Andreas Police Department':
            rpc.setActivity({
              details: 'test 1',
              state: 'test 1',
              largeImageKey: 'mta',
              instance: false,
              startTimestamp: data,
            });
            currentStatus = status;
            currentStatus2 = null;
            win.webContents.send('log', `Status frakcyjny "${status}" został ustawiony! ✅`);
              break;
          case 'San Andreas Road Assistance':
            rpc.setActivity({
              details: 'test 2',
              state: 'test 2',
              largeImageKey: 'mta',
              instance: false,
              startTimestamp: data,
            });
            currentStatus = status;
            currentStatus2 = null;
            win.webContents.send('log', `Status frakcyjny "${status}" został ustawiony! ✅`);
              break;
          case 'Transport of San Andreas':
            rpc.setActivity({
              details: 'test 3',
              state: 'test 3',
              largeImageKey: 'mta',
              instance: false,
              startTimestamp: data,
            });
            currentStatus = status;
            currentStatus2 = null;
            win.webContents.send('log', `Status frakcyjny "${status}" został ustawiony! ✅`);
              break;
          default:
              console.error(`Nieznany status: ${status}`);
      }
  });


  let currentStatus2 = null;

    ipcMain.on('set-status2', (event, status2) => {
      if (currentStatus2 === status2) {
        win.webContents.send('log', `Status biznesowy "${status2}" jest już ustawiony! ❌`);
        return;
      }
      const data = Date.now()
      switch (status2) {
          case 'Buildings4you':
            rpc.setActivity({
              details: 'test 4',
              state: 'test 4',
              largeImageKey: 'mta',
              instance: false,
              startTimestamp: data,
            });
            currentStatus2 = status2;
            currentStatus = null;
            win.webContents.send('log', `Status biznesowy "${status2}" został ustawiony! ✅`);
              break;
          case '41.St Mechanized Infantry Division':
            rpc.setActivity({
              details: 'test 5',
              state: 'test 5',
              largeImageKey: 'mta',
              instance: false,
              startTimestamp: data,
            });
            currentStatus2 = status2;
            currentStatus = null;
            win.webContents.send('log', `Status biznesowy "${status2}" został ustawiony! ✅`);
              break;
          default:
              console.error(`Nieznany status: ${status2}`);
      }
  });
  



   win.removeMenu();
  win.webContents.on('devtools-opened', () => {
   win.webContents.closeDevTools();
  });
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault();
    }
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
  const data = Date.now()
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
