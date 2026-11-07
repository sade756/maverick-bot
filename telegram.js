const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const QRCode = require('qrcode');

const TOKEN = '9178815261:AAFgzNDmizZHg8VOLrV-Gc6SUdIweWnELDw';
const bot = new Telegraf(TOKEN);

bot.command('pair', async (ctx) => {
  let raw = ctx.message.text.split(' ')[1];
  if(!raw){
    ctx.reply(`EASY PAIR:\n\n1. CODE METHOD (NG & VN):\n/pair 2348012345678\n/pair 84858419818\n\n2. QR METHOD (WORKS FOR ALL COUNTRIES!):\n/qr\n\nQR is easiest for VN!`);
    return;
  }
  let num = raw.replace(/[^0-9]/g,'');
  if(num.startsWith('0') && num.length==11) num = '234'+num.slice(1); // NG 080...
  if(num.startsWith('0') && num.length==10) num = '84'+num.slice(1); // VN 085...
  if(num.length==10 && num.startsWith('84')) num = num; // VN 8458419818 keep
  if(num.length==9) num = '84'+num; // VN 9 digits

  const folder = `s_${num}_${Date.now()}`;
  ctx.reply(`⏳ Trying EASY PAIR for +${num}...\nIf code fail, I go send QR!`);

  try{
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    const sock = makeWASocket({ auth: state, logger: P({level:'fatal'}), printQRInTerminal:false, browser: ["Ubuntu","Chrome","20.0"] });
    sock.ev.on('creds.update', saveCreds);
    
    let codeDone = false;
    sock.ev.on('connection.update', async (u) => {
      const { connection, qr } = u;
      if(qr && !codeDone){
        // QR fallback - EASIEST FOR VN!
        try{
          const qrImage = await QRCode.toBuffer(qr);
          await ctx.replyWithPhoto({source: qrImage}, {caption: `📱 QR CODE FOR +${num}\n\n1. Open WhatsApp\n2. Linked Devices\n3. Link a Device\n4. Scan this QR\n\nWorks for NG + VN! No code needed!`});
          ctx.reply(`If you want CODE instead of QR, wait...`);
        }catch{}
      }
      if(connection==='open' && codeDone){
        ctx.reply(`✅ PAIRED +${num}!\nRun: mv ${folder} session && node bot.js`);
      }
    });

    await delay(2000);
    try{
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      codeDone = true;
      ctx.reply(`✅ CODE METHOD +${num}\n\nCODE: ${code}\n\nHOW TO USE:\n1. WhatsApp > Settings > Linked Devices\n2. Link a Device\n3. Tap "Link with phone number instead" (bottom)\n4. Type: ${code}\n\nEASY! Expires 60 sec!`);
    }catch(e){
      ctx.reply(`⚠️ Code failed for +${num}: ${e.message}\n\nBut QR CODE is coming... Scan am! QR works 100% for VN!`);
    }
    setTimeout(()=>{ try{sock.ws.close()}catch{} }, 90000);
  }catch(e){ ctx.reply(`❌ Error: ${e.message}`); }
});

// NEW EASY QR COMMAND - WORKS FOR ALL!
bot.command('qr', async (ctx) => {
  const folder = `s_qr_${Date.now()}`;
  ctx.reply(`⏳ Generating QR CODE...\nEASIEST METHOD FOR VN & NG!\nNo number needed! Just scan!`);
  try{
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    const sock = makeWASocket({ auth: state, logger: P({level:'fatal'}), printQRInTerminal:false, browser: ["Ubuntu","Chrome","20.0"] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (u) => {
      const { connection, qr } = u;
      if(qr){
        const qrImage = await QRCode.toBuffer(qr);
        await ctx.replyWithPhoto({source: qrImage}, {caption: `📱 SCAN THIS QR!\n\n1. WhatsApp > Linked Devices\n2. Link a Device\n3. Scan QR\n\nWorks for +84 and +234! EASY!`});
      }
      if(connection==='open'){
        ctx.reply(`✅ QR PAIRED!\nFolder: ${folder}\nRun: mv ${folder} session && node bot.js`);
        try{sock.ws.close()}catch{}
      }
    });
    setTimeout(()=>{ try{sock.ws.close()}catch{} }, 90000);
  }catch(e){ ctx.reply(`❌ QR Error: ${e.message}`); }
});

bot.start((ctx) => ctx.reply(`🔥 EASY PAIR BOT 🔥\n\nEASIEST FOR VN (84):\n/qr - Scan QR code (No number needed!)\n\nOR CODE:\n/pair 84858419818\n/pair 2348012345678\n\nQR is easiest for +84!`));
bot.launch();
console.log('✅ EASY PAIR BOT ONLINE! QR + CODE!');
