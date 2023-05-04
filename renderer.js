const { ipcRenderer } = require('electron');

ipcRenderer.send('app-version');

// Odebranie odpowiedzi na zapytanie o wersję z processu głównego
ipcRenderer.on('got-app-version', (event, version) => {
  // Ustawienie wersji w elemencie HTML z id "app-version"
  document.getElementById('wersja').innerText = `Wersja: ${version}`;
});


const MAX_LOG_LENGTH = 460; // maksymalna długość loga

const logEl = document.getElementById('log');

// nasłuchiwanie na kliknięcie przycisku "Wyczyść log"
const clearLogBtn = document.getElementById('clear-log-btn');
clearLogBtn.addEventListener('click', () => {
  logEl.textContent = '';
});

ipcRenderer.on('log', (event, data) => {
  logEl.textContent += data + '\n';

  // usuń starsze wpisy, kiedy długość tekstu przekroczy MAX_LOG_LENGTH
  if (logEl.textContent.length > MAX_LOG_LENGTH) {
    const lines = logEl.textContent.split('\n');
    const numLinesToRemove = lines.length - 1;
    const newContent = lines.slice(numLinesToRemove).join('\n');
    logEl.textContent = newContent;
  }
});



    const setStatusButton = document.getElementById('set-status-button');
   const statusSelect = document.getElementById('status-select');

  setStatusButton.addEventListener('click', () => {
    const status = statusSelect.value;
    ipcRenderer.send('set-status', status);
});

const setStatusButton2 = document.getElementById('set-status-button2');
   const statusSelect2 = document.getElementById('status-select2');

  setStatusButton2.addEventListener('click', () => {
    const status2 = statusSelect2.value;
    ipcRenderer.send('set-status2', status2);
});

const resetStatusButton = document.getElementById('status-reset');

// Obsługa kliknięcia przycisku
resetStatusButton.addEventListener('click', () => {
  // Wysłanie zdarzenia do procesu głównego z prośbą o zmianę statusu Discord RPC
  ipcRenderer.send('reset-rpc-status');
});

const statusEl = document.getElementById('status');
  let frame = 0;
  const frames = ['Aplikacja działa.', 'Aplikacja działa..', 'Aplikacja działa...', 'Aplikacja działa.'];
  statusEl.textContent = frames[frame];

  // Definicja funkcji zmieniającej ramkę animacji
  const nextFrame = () => {
    frame = (frame + 1) % frames.length;
    statusEl.textContent = frames[frame];
  };

  // Uruchomienie animacji z prędkością 500ms na ramkę
  const intervalId = setInterval(nextFrame, 500);