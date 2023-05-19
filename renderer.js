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

const setStatusButton3 = document.getElementById('set-status-button3');
const statusSelect3 = document.getElementById('status-select3');

setStatusButton3.addEventListener('click', () => {
 const status3 = statusSelect3.value;
 ipcRenderer.send('set-status3', status3);
});

const setStatusButton4 = document.getElementById('set-status-button4');
const statusTextDetails = document.getElementById('custom-status-details');
const statusTextState = document.getElementById('custom-status-state');

setStatusButton4.addEventListener('click', () => {
 const statusState = statusTextState.value;
 const statusDetails = statusTextDetails.value;
 const logEl = document.getElementById('log');

 if (!statusState || !statusDetails) {
  logEl.textContent += 'Pola nie mogą być puste! ❌' + '\n';
  return;
}
 ipcRenderer.send('set-status4', statusDetails, statusState);
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

  const notification = document.getElementById('notification');
  const message = document.getElementById('message');
  
  // Nasłuchiwanie na zmiany w procesie pobierania aktualizacji

  const updateProgress = document.getElementById('update-progress');
  ipcRenderer.on('update_progress', (event, percent) => {
    updateProgress.innerText = `Pobrano ${Math.floor(percent)}%`;
  });
  
  
  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'Pobieranie aktualizacji';
    notification.classList.remove('hidden');
  });


  const fs = require('fs');
  const path = require('path');
  
  const setButton = document.getElementById('set-button-buttons');
  const resetButton = document.getElementById('reset-button-buttons');
  const statusNazwa1 = document.getElementById('status-button-name1');
  const statusLink1 = document.getElementById('custom-status-link1');
  let statusNazwa2;
  let statusLink2;
  const selectIlosc = document.getElementById('select-button-ilosc');
  const drugieButton = document.getElementById('drugie-button');
  
  let option = null;
  
  // Funkcja do odczytu pliku konfiguracyjnego
  function readConfigFile() {
    const logEl = document.getElementById('log');
    const configPath = path.join(__dirname, 'config.json');
  
    try {
      // Sprawdzenie czy plik istnieje
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configData);
        
        if(config){
          logEl.textContent += 'Plik konfiguracyjny został wczytany! ✅' + '\n';
        }
        // Odczytanie wartości przycisku 1
        if (config.button1) {
          statusNazwa1.value = config.button1.nazwa || '';
          statusLink1.value = config.button1.link || '';
          console.log(`1 Przycisk`);
        }
  
        // Odczytanie wartości przycisku 2
        if (config.button2) {
          console.log(`2 Przycisk`);
          option = 2;
          selectIlosc.value = option.toString();
          drugieButton.innerHTML = `
            <h4 id="tekst" style="text-align: center;">Drugi Przycisk</h4>
            <input id="status-button-name2" type="text" placeholder="Nazwa" value="${config.button2.nazwa || ''}" required><br><br>
            <input id="custom-status-link2" type="text" placeholder="Link" value="${config.button2.link || ''}" required><br><br>
          `;
          statusNazwa2 = document.getElementById('status-button-name2');
          statusLink2 = document.getElementById('custom-status-link2');
        }
      } else {
        // Jeżeli plik nie istnieje, utwórz nowy pusty plik
        fs.writeFileSync(configPath, '{}');
        logEl.textContent += 'Plik konfiguracyjny został utworzony! ✅' + '\n';
      }
    } catch (err) {
      // Obsługa błędu odczytu/zapisu pliku
      console.error('Błąd odczytu/zapisu pliku konfiguracyjnego:', err);
    }
  }
  
  // Wywołanie funkcji odczytu pliku konfiguracyjnego przy uruchomieniu aplikacji
  readConfigFile();
  
  // Odbieranie zdarzenia zmiany opcji w elemencie select
  selectIlosc.addEventListener('change', (event) => {
    option = parseInt(event.target.value, 10);
  
    if (option === 2) {
      drugieButton.innerHTML = `
        <h4 id="tekst" style="text-align: center;">Drugi Przycisk</h4>
        <input id="status-button-name2" type="text" placeholder="Nazwa" required><br><br>
        <input id="custom-status-link2" type="text" placeholder="Link" required><br><br>
      `;
      statusNazwa2 = document.getElementById('status-button-name2');
      statusLink2 = document.getElementById('custom-status-link2');
    } else {
      drugieButton.innerHTML = '';
    }
  });
  
  setButton.addEventListener('click', (event) => {
    const logEl = document.getElementById('log');
    if (option === 2) {
      const Nazwa1 = statusNazwa1.value;
      const Link1 = statusLink1.value;
      const Link2 = statusLink2.value;
      const Nazwa2 = statusNazwa2.value;
  
      if (!Nazwa1 || !Link1 || !Link2 || !Nazwa2) {
        logEl.textContent += 'Pola nie mogą być puste! ❌' + '\n';
        return;
      }
  
      const config = {
        option: 2,
        button1: {
          nazwa: Nazwa1,
          link: Link1
        },
        button2: {
          nazwa: Nazwa2,
          link: Link2
        }
      };
  
      fs.writeFile('config.json', JSON.stringify(config), (err) => {
        if (err) {
          logEl.textContent += 'Błąd podczas zapisywania pliku konfiguracyjnego! ❌' + '\n';
          return;
        }
        ipcRenderer.send('set-button2', Nazwa1, Link1, Link2, Nazwa2);
        logEl.textContent += 'Konfiguracja przycisków zapisana pomyślnie! ✅' + '\n';
      });
    } else {
      const Nazwa1 = statusNazwa1.value;
      const Link1 = statusLink1.value;
  
      if (!Nazwa1 || !Link1) {
        logEl.textContent += 'Pola nie mogą być puste! ❌' + '\n';
        return;
      }
      const config = {
        option: 1,
        button1: {
          nazwa: Nazwa1,
          link: Link1
        }
      };
  
      fs.writeFile('config.json', JSON.stringify(config), (err) => {
        if (err) {
          logEl.textContent += 'Błąd podczas zapisywania pliku konfiguracyjnego! ❌' + '\n';
          return;
        }
        ipcRenderer.send('set-button1', Nazwa1, Link1);
        logEl.textContent += 'Konfiguracja przycisku zapisana pomyślnie! ✅' + '\n';
      });
    }
  });

   resetButton.addEventListener('click', () => {
    ipcRenderer.send('reset-button');
  });

  
  function frakcje() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "block";
  }
  
  function prace() {
    document.getElementById("sidebar-items-prace").style.display = "block";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
  }
  
  function custom() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "block";
  }

  function przyciski() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "block";
  }
  