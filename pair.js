const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');

async function pair(){
    const phone = process.argv[2];
    if(!phone){
        console.log('Use: node pair.js 2348012345678');
        return;
    }
    console.log(`\n⏳ Pairing ${phone}...`);
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({
        auth: state,
        logger: P({level:'silent'}),
        printQRInTerminal:false,
        browser: ["Ubuntu","Chrome","110.0.5585.95"],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(2000);
    try{
        let code = await sock.requestPairingCode(phone);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n✅ CODE FOR ${phone}: ${code}\n`);
        console.log('Go WhatsApp > Linked Devices > Link with phone number');
    }catch(e){
        console.log('❌ Fail:', e.message);
    }
}
pair();
