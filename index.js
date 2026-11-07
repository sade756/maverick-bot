const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('MAVERICK BOT ALIVE'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Port bound:'+PORT));const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('9178815261:AAFgzNDmizZHg8VOLrV-Gc6SUdIweWnELDw');
let waSock;

async function startWA(){
  const { state, saveCreds } = await useMultiFileAuthState('s');
  waSock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['Chrome','Chrome','1.0'],
  });
  waSock.ev.on('creds.update', saveCreds);
  waSock.ev.on('connection.update', async (u)=>{
    if(u.connection==='open') console.log('✅ LINKED!!!');
    if(u.connection==='close') setTimeout(startWA, 3000);
  });
}

bot.start((ctx)=>ctx.reply('Ready! /pair 84...'));
bot.command('pair', async (ctx)=>{
  let num = ctx.message.text.split(' ')[1]?.replace(/[^0-9]/g,'');
  if(!num) return ctx.reply('Usage: /pair 84XXXXXXXX');
  try{
    await new Promise(r=>setTimeout(r,1500));
    const code = await waSock.requestPairingCode(num);
    // EASY TO COPY FORMAT
    await ctx.reply(
      `✅ NUMBER:\n\`${num}\`\n\n🔥 CODE (Tap to copy):\n\`${code}\`\n\n👉 FOR WHATSAPP:\n1. Linked Devices\n2. Link with phone number\n3. Enter number above\n4. Enter code above\n\n⚠️ 20 SECONDS ONLY!`,
      { parse_mode: 'Markdown' }
    );
    console.log(`CODE ${code} for ${num}`);
  }catch(e){ ctx.reply(`❌ Error: ${e.message}\nTry again after 10 sec`); }
});

(async()=>{ await startWA(); bot.launch(); console.log('READY!'); })();
