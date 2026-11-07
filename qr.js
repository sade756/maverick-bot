const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
async function qr(){
  const { state, saveCreds } = await useMultiFileAuthState('s_qr');
  const sock = makeWASocket({ auth: state, logger: P({level:'silent'}), printQRInTerminal:true, browser: ["Ubuntu","Chrome","20.0"] });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='open'){ console.log('\n✅ QR PAIRED! mv s_qr session && node bot.js'); process.exit(0); }
  });
}
qr();
