const { app, BrowserWindow } = require('electron');
const ps = require('ps-node');
const DiscordRPC = require('discord-rpc');

let rpc;
let win;
const startTimestamp = Date.now();

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile('index.html');

    return win;
}

function checkProcess() {
    ps.lookup({ command: 'wow64_helper.exe' }, (err, resultList) => {
        if (err) {
            throw new Error(err);
        }

        if (resultList.length > 0) {
            win.webContents.send('log', 'MTA jest włączone!');
            setRichPresence();
        } else {
            win.webContents.send('log', 'MTA jest wyłączone!');
            clearRichPresence();
        }
    });
}

function setRichPresence() {
    rpc.setActivity({
        largeImageKey: 'mta',
        startTimestamp,
        instance: false,
    })
        .then(() => {
            win.webContents.send('log', 'Statu został ustawiony!');
        })
        .catch(console.error);
}

function clearRichPresence() {
    rpc.clearActivity()
        .then(() => {
            win.webContents.send('log', 'Statu został usunięty!');
        })
        .catch(console.error);
}

app.whenReady().then(() => {
    createWindow();

    win.webContents.on('did-finish-load', () => {
        console.log('Window loaded');
        rpc = new DiscordRPC.Client({ transport: 'ipc' });
        rpc.on('ready', () => {
            win.webContents.send('log', 'Status jest gotowy!');
            checkProcess();
            setInterval(checkProcess, 5000);
        });

        rpc.login({ clientId: '1081236894689538058' }).catch(console.error);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
