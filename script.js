var interval;
var duration = 0;
var minutes = 0;
var ele = document.getElementById('duration');
var startTime = document.getElementById('start-time');
var input = document.getElementById('input');
var blocks = document.getElementById('completed');
var size = document.getElementById('size-input');
var centerLight = document.getElementById('center-light');
var tray = document.getElementById('tray');
var completedCount = 0;
var secondToggle = 0;
var trayToggle = 0;

function focus() {
  startTime.innerHTML = new Date(Date.now()).toLocaleString();
  input.focus();
}

function start() {
  duration = size.value * 60;
  minutes = size.value;
  ele.innerHTML = minutes + 'm';
  interval && clearInterval(interval);
  document.documentElement.style.background = 'linear-gradient(135deg, #d9517b, #201b46)';
  centerLight.style.background = 'radial-gradient(#ff000080,#100223)';
  
  // notify(minutes + 'Minutes Left...');
  
  interval = setInterval(() => {
    secondToggle = secondToggle === 0 ? 1 : 0;
    duration--;
    minutes = minutes > Math.ceil(duration / 60) ? Math.ceil(duration / 60) : minutes; 
    ele.innerHTML = minutes + 'm' + (secondToggle === 1 ? '.' : '');
    window.document.title = minutes + 'm | TimeBlocks';
    // notify(minutes + 'Minutes Left...');
    if (minutes === 0) {
      document.documentElement.style.background = 'linear-gradient(135deg, #6551d9, #201b46)';
      centerLight.style.background = 'radial-gradient(#00ff3f80,#100223)';

      completedCount++;
      var a = new Audio('snd.mp3');
      a.play();
      var msg = new SpeechSynthesisUtterance();
      msg.voiceURI = 'Google UK English Female';
      msg.volume = 1; // 0 to 1
      msg.rate = .9; // 0.1 to 10
      msg.pitch = 1; //0 to 2
      msg.lang = 'en-GB';
      msg.text = input.value + ' Block Completed';
      
      setTimeout(() => speechSynthesis.speak(msg), completedCount > 1 ? 1000 : 2500);
      
      // notify('Block Completed', true);
      //ele.innerHTML = 'BLOCK COMPLETED';
      window.document.title = 'COMPLETED | TimeBlocks';
      blocks.innerHTML = blocks.innerHTML += input.value + ': ' + '<span class="comp-list-min">' + size.value + 'm' + '</span>' + '<br>';
      clearInterval(interval);
    }
  }, 1000);
}

function toggleTray() {
  trayToggle = trayToggle === 0 ? 1 : 0;
  tray.classList.toggle('open');
}

function cancel() {
  clearInterval(interval);
  ele.innerHTML = 0;
  window.document.title = 'TimeBlocks';
  notify('Block Canceled', true);
}

function notify(text, fade) {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    sendNotification(text, fade);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        sendNotification(text, fade);
      }
    });
  }
}

function sendNotification(text, fade) {
  var notification = new Notification(text, { 
    icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.flaticon.com%2Ficons%2Fpng%2F512%2F595%2F595513.png&f=1&nofb=1',
    tag: 'timeblock',
    body: 'Current Block: ' + input.value
  });
  fade && setTimeout(() => notification.close(), 2000);
}

document.getElementById('form-one').addEventListener("submit", function (event) {
  event.preventDefault();
  start();
});

document.getElementById('form-two').addEventListener("submit", function (event) {
  event.preventDefault();
  start();
});