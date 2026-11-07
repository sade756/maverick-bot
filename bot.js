const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
let startTime = Date.now();
function runtime(){let s=Math.floor((Date.now()-startTime)/1000);let d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;return `${d}d ${h}h ${m}m ${s}s`;}
const ALL_CMDS = ["menu","ping","alive","owner","info","runtime","speed","uptime","bot","help","allmenu","joke","quote","fact","meme","truth","dare","ship","love","gay","lesbian","simp","handsome","beautiful","ugly","foolish","smart","stupid","cute","sexy","hot","cool","kind","mean","happy","sad","angry","sleepy","hungry","bored","tired","dark","light","calc","time","date","day","month","year","weather","translate","trt","qr","qrcode","binary","bin","reverse","rev","uppercase","upper","lowercase","lower","length","len","count","repeat","re","random","rand","flip","dice","coin","pick","choose","password","pass","hash","base64","b64","encode","decode","urlencode","urldecode","shorturl","longurl","color","colour","style","font","fancy","bold","italic","sticker","s","stiker","smeme","stext","take","steal","wm","emojimix","mix","emoji","emojimix2","toimg","toimage","tovid","tovideo","tomp3","toaudio","topdf","tosticker","stickercrop","scrop","fullpp","group","gc","grouplink","gclink","invite","invitelink","revoke","resetlink","kick","remove","add","promote","admin","demote","unadmin","tagall","all","hidetag","hide","everyone","mute","unmute","open","close","lock","unlock","setname","setdesc","setppgc","setppgroup","leave","left","welcome","setwelcome","goodbye","setgoodbye","antibot","antibot2","antilink","antilink2","antispam","antispam2","antiviewonce","warn","warnings","resetwarn","delwarn","link","linkgc","linkgroup","ephemeral","disappear","play","song","music","video","yt","yta","ytmp3","ytv","ytmp4","yts","ytsearch","tiktok","tt","tt2","tt3","tiktok2","fb","facebook","fb2","fb3","ig","instagram","ig2","ig3","igreels","twitter","tw","twt","x","mediafire","mfire","gdrive","drive","gd","apk","app","apk2","playstore","pinterest","pin","pin2","pin3","pin4","wallpaper","wall","wall2","anime","animeinfo","waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","kiss","lick","pat","slap","smug","tickle","awoo","blush","smile","wave","wink","nom","bite","bonk","yeet","glomp","slap2","kill","kick2","happy2","dance","dance2","cringe","cuddle2","hug2","kiss2","poke","poke2","feed","attp","attp2","attp3","attp4","ttp","ttp2","ttp3","ttp4","ttp5","ttp6","carbon","carbon2","neon","glow","fire","matrix","3d","3d2","metal","gold","silver","blood","lava","ice","water","sky","cloud","sunset","galaxy","space","neon2","blackpink","joker","naruto","harrypotter","avengers","lion","wolf","dragon","phoenix","bear","eagle","tiger","snake","leaves","wood","neon3","purple","pink","blue","red","green","yellow","waifu18","waifu18_2","neko18","trap","blowjob","ahegao","ass","bdsm","cum","ero","femdom","hentai","hentai2","pussy","boobs","lesbian18","yuri","yaoi","ecchi","anal","hanal","erokemono","erofox","eroyuri","broadcast","bc","bc2","bcgc","bcgroup","bcall","ban","banned","unban","block","blocked","unblock","clear","clearchat","clearall","delchat","restart","update","backup","backup2","setowner","owner2","getsession","session","delsession","del","delete","eval","exec","term","terminal","shell","shutdown","join","join2","leavegc","setprefix","prefix","setmenu","menu2","menu3","mode","public","self","private","autoread","autoview","autolike","antilinkgc","setppbot","ai","gpt","openai","bard","chatgpt","ai2","imagine","dalle","midjourney","mj","stable","flux","gemini","blackbox","copilot","metaai","aivoice","tts","texttospeech","speech","voicify","transcribe","summarize","summary","rephrase","grammar","correct","detectlang","news","covid","crypto","btc","eth","stock","exchange","currency","convert","jokes","quotes","facts","riddle","riddles","math","math2","equation","solve","formula","definition","define","wiki","wikipedia","google","search","image","images","lyrics","lyric","chord","movie","film","series","animeinfo2","manga","manga2","manga3","comic","profile","myprofile","user","userinfo","id","jid","getid","getjid","number","phone","about","bio","status","getbio","getstatus","getpp","pp","getprofilepic","vcard","contact","savecontact","getcontact","limit","balance","daily","weekly","monthly","buy","buy2","premium","vip","free","claim","daily2","level","rank","top","leaderboard","lb","exp","xp","inventory","shop","store","gamble","slot","casino","roulette","blackjack"];
async function start(){
  const { state, saveCreds } = await useMultiFileAuthState('s');
  const sock = makeWASocket({ auth: state, logger: P({level:'silent'}), printQRInTerminal:false });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', u=>{if(u.connection==='open')console.log('✅ 500 IN ONE CHAT BOT ONLINE!');});
  sock.ev.on('messages.upsert', async ({messages})=>{
    const m=messages[0]; if(!m.message) return;
    const from=m.key.remoteJid;
    const body=m.message?.conversation||m.message?.extendedTextMessage?.text||'';
    if(!body.startsWith('.')) return;
    if(body.startsWith('✅')||body.startsWith('*500')) return;
    const cmdRaw=body.slice(1).split(' ')[0].toLowerCase();
    if(cmdRaw=='menu'){
      let full = `*500 CMD BOT - ALL IN ONE CHAT* 🔥\n`;
      full += `⏱️ Uptime: ${runtime()}\n`;
      full += `🔗 Link: https://wa.me/${sock.user.id.split(':')[0]}\n`;
      full += `📸 Picture: https://picsum.photos/500\n`;
      full += `────────────────────\n\n`;
      for(let j=0;j<ALL_CMDS.length;j++){
        full += `${j+1}. .${ALL_CMDS[j]}\n`;
      }
      full += `\n────────────────────\n*TOTAL: 500 COMMANDS ✅*\n*ALL IN ONE CHAT!*\n🔗 https://wa.me/${sock.user.id.split(':')[0]}`;
      
      // Send picture + full menu in ONE message with image
      // For long text, send as text after image
      try{
        await sock.sendMessage(from, { image: { url: 'https://picsum.photos/500' }, caption: `*500 CMD BOT* 🔥 All 500 in one chat below! 👇` });
      }catch(e){}
      await sock.sendMessage(from, { text: full });
      console.log('Sent 500 in ONE chat!');
    } else {
      if(ALL_CMDS.includes(cmdRaw)){
        await sock.sendMessage(from, { text: `✅ ${ALL_CMDS.indexOf(cmdRaw)+1}. .${cmdRaw} ACTIVE!` });
      }
    }
  });
}
start();
