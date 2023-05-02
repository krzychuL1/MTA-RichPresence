const { app, BrowserWindow } = require('electron');
const ps = require('ps-node');
const DiscordRPC = require('discord-rpc');

let rpc;
let win;

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
            console.log('MTA is running!');
            win.webContents.send('log', 'MTA is running!');
            setRichPresence();
        } else {
            console.log('MTA is not running');
            win.webContents.send('log', 'MTA is not running');
            clearRichPresence();
        }
    });
}

function setRichPresence() {
    rpc.setActivity({
        details: 'test number 1',
        state: 'In game',
        largeImageKey: 'test number 2',
        instance: false,
    })
        .then(() => {
            console.log('Discord Rich Presence set');
            win.webContents.send('log', 'Discord Rich Presence set');
        })
        .catch(console.error);
}

function clearRichPresence() {
    rpc.clearActivity()
        .then(() => {
            console.log('Discord Rich Presence cleared');
            win.webContents.send('log', 'Discord Rich Presence cleared');
        })
        .catch(console.error);
}

app.whenReady().then(() => {
    createWindow();

    win.webContents.on('did-finish-load', () => {
        console.log('Window loaded');
        rpc = new DiscordRPC.Client({ transport: 'ipc' });
        rpc.on('ready', () => {
            console.log('Discord Rich Presence is ready');
            win.webContents.send('log', 'Discord Rich Presence is ready');
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
