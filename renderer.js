const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

ipcRenderer.send('app-version');
ipcRenderer.on('got-app-version', (event, version) => {
  document.getElementById('wersja').innerText = `Wersja: ${version}`;
});


const MAX_LOG_LENGTH = 460;

const logEl = document.getElementById('log');

const clearLogBtn = document.getElementById('clear-log-btn');
clearLogBtn.addEventListener('click', () => {
  logEl.textContent = '';
});

ipcRenderer.on('log', (event, data) => {
  logEl.textContent += data + '\n';

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
      store.set('StatusDetails', statusDetails);
      store.set('StatusState', statusState);
    ipcRenderer.send('set-status4', statusDetails, statusState);
    logEl.textContent += 'Konfiguracja własnego statusu \nzostała zapisana pomyślnie! ✅' + '\n';
});


const resetStatusButton = document.getElementById('status-reset');

resetStatusButton.addEventListener('click', () => {
  ipcRenderer.send('reset-rpc-status');
});

const statusEl = document.getElementById('status');
  let frame = 0;
  const frames = ['Aplikacja działa.', 'Aplikacja działa..', 'Aplikacja działa...', 'Aplikacja działa.'];
  statusEl.textContent = frames[frame];
  const nextFrame = () => {
    frame = (frame + 1) % frames.length;
    statusEl.textContent = frames[frame];
  };

  const intervalId = setInterval(nextFrame, 500);

  const notification = document.getElementById('notification');
  const updateWheel = document.getElementById('loader');
  const message = document.getElementById('message');
  

  const updateProgress = document.getElementById('update-progress');
  ipcRenderer.on('update_progress', (event, percent) => {
    updateProgress.innerText = `Pobrano ${Math.floor(percent)}%`;
  });
  
  
  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'Pobieranie aktualizacji';
    notification.classList.remove('hidden');
    updateWheel.classList.remove('hidden');
  });
  
  const setButton = document.getElementById('set-button-buttons');
  const resetButton = document.getElementById('reset-button-buttons');
  const statusNazwa1 = document.getElementById('status-button-name1');
  const statusLink1 = document.getElementById('custom-status-link1');
  let statusNazwa2;
  let statusLink2;
  const selectIlosc = document.getElementById('select-button-ilosc');
  const drugieButton = document.getElementById('drugie-button');
  
  let option = null;
  
  const Store = require('electron-store');
  const store = new Store();

  function CheckConfig() {
    const logEl = document.getElementById('log');
      if (store.get('Button1Nazwa')) {
          statusNazwa1.value = store.get('Button1Nazwa') || '';
          statusLink1.value = store.get('Button1Link') || '';
      } 
      if (store.get('Button2Nazwa')) {
        option = 2;
        selectIlosc.value = option.toString();
        statusNazwa1.value = store.get('Button1Nazwa') || '';
        statusLink1.value = store.get('Button1Link') || '';
        drugieButton.innerHTML = `
        <h4 id="tekst" style="text-align: center;">Drugi Przycisk</h4>
        <input id="status-button-name2" type="text" placeholder="Nazwa" value="${store.get('Button2Nazwa') || ''}" required><br><br>
        <input id="custom-status-link2" type="text" placeholder="Link" value="${store.get('Button2Link') || ''}" required><br><br>
      `;
      statusNazwa2 = document.getElementById('status-button-name2');
      statusLink2 = document.getElementById('custom-status-link2');
    } 
    if (store.get('StatusDetails')) {
      statusTextDetails.value = store.get('StatusDetails') || '';
      statusTextState.value = store.get('StatusState') || '';
  } 
  }

  
  CheckConfig();

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
      store.set('Button1Nazwa', Nazwa1);
      store.set('Button1Link', Link1);
      store.set('Button2Nazwa', Nazwa2);
      store.set('Button2Link', Link2);
        ipcRenderer.send('set-button2', Nazwa1, Link1, Link2, Nazwa2);
        logEl.textContent += 'Konfiguracja przycisków\nzostała zapisana pomyślnie! ✅' + '\n';
    } else {
      const Nazwa1 = statusNazwa1.value;
      const Link1 = statusLink1.value;
  
      if (!Nazwa1 || !Link1) {
        logEl.textContent += 'Pola nie mogą być puste! ❌' + '\n';
        return;
      }

        store.set('Button1Nazwa', Nazwa1);
        store.set('Button1Link', Link1);
        store.delete('Button2Nazwa');
        store.delete('Button2Link');
        ipcRenderer.send('set-button1', Nazwa1, Link1);
        logEl.textContent += 'Konfiguracja przycisku\nzostała zapisana pomyślnie! ✅' + '\n';
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
  