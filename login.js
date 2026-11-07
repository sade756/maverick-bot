const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
async function login(){
  const num = process.argv[2];
  if(!num){ console.log('\n❌ Usage: node login.js 2348012345678\nExample: node login.js 2348101234567\n'); return; }
  const { state, saveCreds } = await useMultiFileAuthState('s');
  const sock = makeWASocket({ auth: state, logger: P({level:'silent'}), printQRInTerminal:false, browser: ["Ubuntu", "Chrome", "20.0"] });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (u)=>{
    if(u.connection==='open') console.log('\n✅ LOGIN SUCCESS! Your WhatsApp no go log out again!\nNow run: node bot.js\n');
  });
  await delay(3000);
  console.log(`\n⏳ Generating code for ${num}...`);
  try{
    let code = await sock.requestPairingCode(num.replace(/[^0-9]/g,''));
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log(`\n╔════════════════════════════╗\n║ YOUR 8-DIGIT CODE: ${code} ║\n╚════════════════════════════╝\n\n1. Open WhatsApp on your phone\n2. Settings > Linked Devices\n3. Link a Device\n4. Click "Link with phone number instead"\n5. Enter: ${code}\n\nCode expires in 60 seconds! If e expire, run again: node login.js ${num}\n`);
  }catch(e){ console.log('Error:', e.message); }
}
login();
