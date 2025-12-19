const WebSocket = require('ws');
const { spawn } = require('child_process');

const wss = new WebSocket.Server({ port: 9000 });

const allowedScripts = {
  entraid: 'scripts/interactive-script_entraID.js',
  sapidp: 'scripts/interactive-script_sapidp.js',
  pamdelinea: 'scripts/interactive-script_pamdelinea.js',
  salesforce: 'scripts/interactive-script_salesforce.js',
  cybervadis: 'scripts/interactive-script_cybervadis.js',
  akamai: 'scripts/interactive-script_akamai.js',
};

wss.on('connection', function connection(ws) {
  console.log('Client verbunden');

  // Starte interaktives Skript
  let child = null;
  let scriptStarted = false;

  // Handle Nachrichten vom WebSocket
  ws.on('message', (message) => {
    // Wenn das Skript noch nicht gestartet wurde, erwarte erste Nachricht als Skriptname
    if (!scriptStarted) {
      const scriptName = message.toString().trim();
      const scriptPath = allowedScripts[scriptName];

      if (!scriptPath) {
         ws.send('Ungültiges Skript');
         return;
      }
      console.log(`Starte Skript &{scriptPath}`);

      child = spawn('node', [scriptPath]);
      scriptStarted = true;

     // Sende stdout des Skripts an den Client
     child.stdout.on('data', (data) => {
       ws.send(`SCRIPT: ${data}`);
     });

     // Sende stderr auch
     child.stderr.on('data', (data) => {
       ws.send(`FEHLER: ${data}`);
     });

    // Wenn Skript fertig ist
    child.on('close', (code) => {
      ws.send(`SCRIPT BEENDET mit Code ${code}`);
    });


    return;
  }

  // Nachfolgende Nachrichten -> stdin des Skripts
  if (child && child.stdin.writable) {
    console.log(`Client: ${message}`);
    child.stdin.write(message + '\n'); // Gib Eingabe an das Skript weiter
  }
});


  // Wenn der Client die Verbindung trennt
  ws.on('close', () => {
    if (!child.killed) {
      child.kill();
    }
    console.log('Client getrennt, Skript beendet.');
  });
});
