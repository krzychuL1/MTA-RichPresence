const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');


// odbieranie wersji do html
ipcRenderer.send('app-version');
ipcRenderer.on('got-app-version', (event, version) => {
  document.getElementById('wersja').innerText = `Wersja: ${version}`;
});



// logi
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
    if(status === 'Wybierz Frakcje'){
      return
    }
    ipcRenderer.send('set-status', status);
    store.set('Frakcja', status);
});

const setStatusButton2 = document.getElementById('set-status-button2');
   const statusSelect2 = document.getElementById('status-select2');

  setStatusButton2.addEventListener('click', () => {
    const status2 = statusSelect2.value;
    if(status2 === 'Wybierz Biznes'){
      return
    }
    ipcRenderer.send('set-status2', status2);
    store.set('Biznes', status2);
});

const setStatusButton3 = document.getElementById('set-status-button3');
const statusSelect3 = document.getElementById('status-select3');

setStatusButton3.addEventListener('click', () => {
 const status3 = statusSelect3.value;
 if(status3 === 'Wybierz Pracę'){
  return
}
 ipcRenderer.send('set-status3', status3);
 store.set('Praca', status3);
});


// własny status

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


// reset statusu

resetStatusButton.addEventListener('click', () => {
  ipcRenderer.send('reset-rpc-status');
});


// aplikacja działa

const statusEl = document.getElementById('status');
  let frame = 0;
  const frames = ['Aplikacja działa.', 'Aplikacja działa..', 'Aplikacja działa...', 'Aplikacja działa.'];
  statusEl.textContent = frames[frame];
  const nextFrame = () => {
    frame = (frame + 1) % frames.length;
    statusEl.textContent = frames[frame];
  };

  const intervalId = setInterval(nextFrame, 500);


  // powiadomienie o update

  const notification = document.getElementById('notification');
  const updateWheel = document.getElementById('loader');
  const message = document.getElementById('message');
  

  const updateProgress = document.getElementById('update-progress');
  ipcRenderer.on('update_progress', (event, percent) => {
    updateProgress.innerText = `Pobrano ${Math.floor(percent)}%`;
    updateWheel.classList.remove('hidden');
  });
  
  
  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'Pobieranie aktualizacji';
    notification.classList.remove('hidden');
  });
  
  const setButton = document.getElementById('set-button-buttons');
  const resetButton = document.getElementById('reset-button-buttons');
  const statusNazwa1 = document.getElementById('status-button-name1');
  const statusLink1 = document.getElementById('custom-status-link1');
  const statusNazwa2 = document.getElementById('status-button-name2');
  const statusLink2 = document.getElementById('custom-status-link2');
  const selectIlosc = document.getElementById('select-button-ilosc');
  let drugieButton = document.getElementById('drugie-button');
  
  let option = null;
  
  const Store = require('electron-store');
const { validateHeaderName } = require('http');
  const store = new Store();

  // sprawdzanie configu

  function CheckConfig() {
    if(store.get('Frakcja')){
      statusSelect.value = store.get('Frakcja')
    }
    if(store.get('Biznes')){
      statusSelect2.value = store.get('Biznes')
    }
    if(store.get('Praca')){
      statusSelect3.value = store.get('Praca')
    }
    if (store.get('Button1Nazwa')) {
      option = 1;
      if (store.get('button_start') === `tak`) {
        statusNazwa1.value = store.get('Button1Nazwa') || '';
        statusLink1.value = store.get('Button1Link') || '';
        const Nazwa1 = statusNazwa1.value;
        const Link1 = statusLink1.value;

        setTimeout(() => {
          ipcRenderer.send('set-button1', Nazwa1, Link1);
        }, 1500)
      } else {
        statusNazwa1.value = store.get('Button1Nazwa') || '';
        statusLink1.value = store.get('Button1Link') || '';
      }
    } 
    if (store.get('Button2Nazwa')) {
      option = 2;
      if (store.get('button_start') === `tak`){
        selectIlosc.value = option.toString();
        statusNazwa1.value = store.get('Button1Nazwa') || '';
        statusLink1.value = store.get('Button1Link') || '';
        const statusNazwa2 = document.getElementById('status-button-name2');
        const statusLink2 = document.getElementById('custom-status-link2');
        let Nazwa1 = statusNazwa1.value;
        let Link1 = statusLink1.value;
        let Link2 = statusLink2.value;
        let Nazwa2 = statusNazwa2.value;

        setTimeout(() => {
          ipcRenderer.send('set-button2', Nazwa1, Link1, Link2, Nazwa2);
        }, 1500)
        const setStatusButton = document.getElementById('set-button-buttons');
        const resetStatusButton = document.getElementById('reset-button-buttons')
        setStatusButton.style.top = '-4px'
        resetStatusButton.style.top = '-4px'
        drugieButton.style.display = 'block'
        statusNazwa2.value = store.get('Button2Nazwa') || ''
        statusLink2.value = store.get('Button2Link') || ''
      } else {
        option = 2;
        selectIlosc.value = option.toString();
        statusNazwa1.value = store.get('Button1Nazwa') || '';
        statusLink1.value = store.get('Button1Link') || '';
        const statusNazwa2 = document.getElementById('status-button-name2');
        const statusLink2 = document.getElementById('custom-status-link2');
        const setStatusButton = document.getElementById('set-button-buttons');
        const resetStatusButton = document.getElementById('reset-button-buttons')
        setStatusButton.style.top = '-4px'
        resetStatusButton.style.top = '-4px'
        drugieButton.style.display = 'block'
        statusNazwa2.value = store.get('Button2Nazwa') || ''
        statusLink2.value = store.get('Button2Link') || ''
      }
  }
  if (store.get('StatusDetails')) {
    if (store.get('status_start') === `tak`){
      statusTextDetails.value = store.get('StatusDetails') || '';
      statusTextState.value = store.get('StatusState') || '';
      const statusState = statusTextState.value;
      const statusDetails = statusTextDetails.value;
      setTimeout(() => {
        ipcRenderer.send('set-status4', statusDetails, statusState);
      }, 1500)
    } else {
      statusTextDetails.value = store.get('StatusDetails') || '';
      statusTextState.value = store.get('StatusState') || '';
    }
} 

  // ustawianie statusu z configu
  if (store.get('status_start') === `tak`) {
    button_status.checked = true;
  } else {
  }

    // ustawianie tła z configu
    let kolor_tekst = document.getElementById('kolor-tla');
    if (store.get('motyw') === `white`) {
      const body = document.body;
      body.classList.toggle('dark-mode');
      button.checked = true;
      kolor_tekst.innerHTML = "Ustaw czarny motyw."
    } else {
      kolor_tekst.innerHTML = "Ustaw biały motyw."
    }

      // ustawianie przycisków z configu
  if (store.get('button_start') === `tak`) {
    button_button.checked = true;
  } else {
  }
}

  CheckConfig();


  // wybieranie ilości przycisków i dodawanie pól

  selectIlosc.addEventListener('change', (event) => {
    option = parseInt(event.target.value, 10);
    if (option === 2) {
      const setStatusButton = document.getElementById('set-button-buttons');
      const resetStatusButton = document.getElementById('reset-button-buttons')
      setStatusButton.style.top = '-4px'
      resetStatusButton.style.top = '-4px'
      drugieButton.style.display = 'block'

    } else {
      const setStatusButton = document.getElementById('set-button-buttons');
      const resetStatusButton = document.getElementById('reset-button-buttons')
      setStatusButton.style.top = '10px'
      resetStatusButton.style.top = '10px'
      drugieButton.style.display = 'none'
    }
  });
  
  // dodawanie dwóch przycisków do configu i do statusu

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
      store.set('ButtonOpt', 2);
        ipcRenderer.send('set-button2', Nazwa1, Link1, Nazwa2, Link2);
        logEl.textContent += 'Konfiguracja przycisków\nzostała zapisana pomyślnie! ✅' + '\n';
    } else {
  // dodawanie przycisku do configu i do statusu
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
        store.set('ButtonOpt', 1);
        ipcRenderer.send('set-button1', Nazwa1, Link1);
        logEl.textContent += 'Konfiguracja przycisku\nzostała zapisana pomyślnie! ✅' + '\n';
      }
  });

  // usuwanie przycisków ze statusu
  
   resetButton.addEventListener('click', () => {
    ipcRenderer.send('reset-button');
  });


  let button = document.getElementById('checkbox');
  let button_status = document.getElementById('checkbox2');
  let button_button = document.getElementById('checkbox3');
  let kolor_tekst = document.getElementById('kolor-tla');
  let button1 = document.getElementById('button1');
  let button2 = document.getElementById('button2');
  let button3 = document.getElementById('button3');
  let button4 = document.getElementById('button4');
  let button5 = document.getElementById('button5');
  let button6 = document.getElementById('button6');
  let button7 = document.getElementById('button7');
  let stylesheet = document.getElementById('stylesheet');


  // Jeżeli nie ma motywu/statusu/przycisków'

  if(!store.get(`status_start`)){
    store.set('status_start', `tak`);
  }

  if(!store.get(`motyw`)){
    store.set('motyw', `black`);
  }

  if(!store.get(`button_start`)){
    store.set('button_start', `tak`);
  }

  // ustawianie tła z przycisku
  button.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      store.set('motyw', 'white');
      kolor_tekst.innerHTML = "Ustaw czarny motyw.";
    } else {
      store.set('motyw', 'black');
      kolor_tekst.innerHTML = "Ustaw biały motyw.";
    }
  });

  // ustawianie statusu z przycisku
  button_status.addEventListener('click', () => {
    if(button_status.checked === true){
      store.set('status_start', `tak`);
    } else {
      store.set('status_start', `nie`);
    }
  });

    // ustawianie przycusków z przycisku
  button_button.addEventListener('click', () => {
    if(button_button.checked === true){
      store.set('button_start', `tak`);
    } else {
      store.set('button_start', `nie`);
    }
  });

  // funkcje

  // przycisk do wchodzenia w ustawienia
  function ustawieniain() {
    document.getElementById("sidebar-items-ustawienia").style.display = "block";
  }
    // przycisk do wychodzenia z ustawień
  function ustawieniaout() {
    document.getElementById("sidebar-items-ustawienia").style.display = "none";
  }
  
  // przycisk menu frakcji i biznesów
  function frakcje() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "block";
  }
  
    // przycisk menu prac
  function prace() {
    document.getElementById("sidebar-items-prace").style.display = "block";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
  }
  
    // przycisk menu własnego statusu
  function custom() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "block";
  }

    // przycisk menu przycisków
  function przyciski() {
    document.getElementById("sidebar-items-prace").style.display = "none";
    document.getElementById("sidebar-items-frakcje").style.display = "none";
    document.getElementById("sidebar-items-custom").style.display = "none";
    document.getElementById("sidebar-items-przyciski").style.display = "block";
  }

  function resetconfigu() {
    const notification = document.getElementById('config-reset-notification');
    store.clear();
    notification.style.display = 'block'
    notification.innerHTML = 'Plik konfiguracyjny został wyczyszczony! ✅'
    setTimeout(() => {
      notification.style.top = '15px'
    }, 10);
    store.set('status_start', `tak`);
    store.set('motyw', `black`);
    store.set('button_start', `tak`);
    CheckConfig();
    setTimeout(() => {
      notification.style.top = '50px'
      setTimeout(() => {
        notification.innerHTML = ''
        notification.style.display = 'none'
      }, 200);
      return
    }, 3000);
  }

  