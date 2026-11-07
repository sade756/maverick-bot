const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
async function pair(){
  const phone = '84584198180';
  console.log(`\n⏳ Pairing +${phone} (Vietnam)...`);
  const { state, saveCreds } = await useMultiFileAuthState('s_'+phone);
  const sock = makeWASocket({
    auth: state,
    logger: P({level:'silent'}),
    printQRInTerminal:false,
    browser: ["Ubuntu","Chrome","120.0"],
    markOnlineOnConnect:false,
    syncFullHistory:false
  });
  sock.ev.on('creds.update', saveCreds);
  await delay(1500);
  try{
    let code = await sock.requestPairingCode(phone);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log('\n==============================');
    console.log(`✅ CODE FOR +${phone}`);
    console.log(`CODE: ${code}`);
    console.log('==============================');
    console.log('\nGO WHATSAPP NOW:');
    console.log('1. Settings > Linked Devices');
    console.log('2. Link a Device');
    console.log('3. Link with phone number instead');
    console.log(`4. Enter: ${code}`);
    console.log('\nYou get 60 sec! Enter FAST!\n');
  }catch(e){
    console.log('❌ Fail:', e.message);
    console.log('\nCHECK:');
    console.log('1. Is +84584198180 on WhatsApp?');
    console.log('2. Linked Devices full? Delete 1 (max 4)');
    console.log('3. Try QR method if code fail');
  }
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='open'){
      console.log(`\n🎉 +${phone} PAIRED! SUCCESS!`);
      console.log('Run: mv s_84584198180 session && node bot.js');
      process.exit(0);
    }
  });
  setTimeout(()=>{ console.log('Timeout, try again'); process.exit(1); }, 90000);
}
pair();
