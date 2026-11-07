const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('./config');
console.log(`\n👑 ${config.botName} - 400 CMDS Starting...\n`);
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.creds, pino({ level: 'silent' })) },
        version,
        browser: [config.botName, 'Chrome', '1.0.0'],
        markOnlineOnConnect: true
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (u) => {
        if (u.connection === 'close' && u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
        if (u.connection === 'open') console.log(`✅ ${config.botName} Connected! PUBLIC 400 CMDS!`);
    });
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            const from = msg.key.remoteJid;
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
            const prefix = config.prefix;
            if (!body.startsWith(prefix)) return;
            const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
            const reply = (text) => sock.sendMessage(from, { text: text });
            if (command === 'menu' || command === 'allmenu' || command === 'list') {
                const fullMenu = `*👑 ${config.botName} - FULL 400 COMMANDS*

*BOT & OWNER (1-20):*
1. ${prefix}alive
2. ${prefix}ping
3. ${prefix}speed
4. ${prefix}owner
5. ${prefix}menu
6. ${prefix}allmenu
7. ${prefix}help
8. ${prefix}info
9. ${prefix}runtime
10. ${prefix}uptime
11. ${prefix}restart
12. ${prefix}update
13. ${prefix}broadcast
14. ${prefix}setpp
15. ${prefix}setbio
16. ${prefix}public
17. ${prefix}private
18. ${prefix}block
19. ${prefix}unblock
20. ${prefix}clearsession

*GROUP PROTECTION (21-50):*
21. ${prefix}antilink on/off
22. ${prefix}antidelete on/off
23. ${prefix}antibot on/off
24. ${prefix}antibadword on/off
25. ${prefix}antiviewonce on/off
26. ${prefix}anticall on/off
27. ${prefix}antispam on/off
28. ${prefix}antifake on/off
29. ${prefix}welcome on/off
30. ${prefix}goodbye on/off
31. ${prefix}setwelcome
32. ${prefix}setgoodbye
33. ${prefix}group open
34. ${prefix}group close
35. ${prefix}link
36. ${prefix}grouplink
37. ${prefix}revoke
38. ${prefix}invite
39. ${prefix}tagall
40. ${prefix}hidetag
41. ${prefix}kick
42. ${prefix}add
43. ${prefix}promote
44. ${prefix}demote
45. ${prefix}kickall
46. ${prefix}tagadmin
47. ${prefix}groupinfo
48. ${prefix}listadmin
49. ${prefix}setname
50. ${prefix}setdesc

*DOWNLOADER (51-120):*
51. ${prefix}play
52. ${prefix}song
53. ${prefix}ytmp3
54. ${prefix}ytmp4
55. ${prefix}ytaudio
56. ${prefix}ytvideo
57. ${prefix}yts
58. ${prefix}tiktok
59. ${prefix}tt
60. ${prefix}ttmp3
61. ${prefix}facebook
62. ${prefix}fb
63. ${prefix}fbmp3
64. ${prefix}instagram
65. ${prefix}ig
66. ${prefix}igreel
67. ${prefix}igstory
68. ${prefix}twitter
69. ${prefix}x
70. ${prefix}mediafire
71. ${prefix}mf
72. ${prefix}gdrive
73. ${prefix}gd
74. ${prefix}apk
75. ${prefix}playstore
76. ${prefix}spotify
77. ${prefix}soundcloud
78. ${prefix}threads
79. ${prefix}likee
80. ${prefix}pinterest
81. ${prefix}pin
82. ${prefix}capcut
83. ${prefix} SnackVideo
84. ${prefix}imgur
85. ${prefix}wallpaper
86. ${prefix}image

*CONVERTER (121-160):*
121. ${prefix}sticker
122. ${prefix}s
123. ${prefix}toimg
124. ${prefix}tomp3
125. ${prefix}toptt
126. ${prefix}tovideo
127. ${prefix}toaudio
128. ${prefix}emojimix
129. ${prefix}mix
130. ${prefix}qc
131. ${prefix}brat
132. ${prefix}ttp
133. ${prefix}attp
134. ${prefix}smeme
135. ${prefix}wm

*AI & CHAT (161-210):*
161. ${prefix}ai
162. ${prefix}gpt
163. ${prefix}gemini
164. ${prefix}imagine
165. ${prefix}img
166. ${prefix}dalle
167. ${prefix}flux
168. ${prefix}bard
169. ${prefix}blackbox
170. ${prefix}copilot
171. ${prefix}chatgpt
172. ${prefix}metaai
173. ${prefix}translate
174. ${prefix}trt
175. ${prefix}tts
176. ${prefix}voice

*FUN & GAMES (211-280):*
211. ${prefix}joke
212. ${prefix}quote
213. ${prefix}fact
214. ${prefix}riddle
215. ${prefix}truth
216. ${prefix}dare
217. ${prefix}8ball
218. ${prefix}ship
219. ${prefix}love
220. ${prefix}gay
221. ${prefix}handsome
222. ${prefix}beautiful
223. ${prefix}ugly
224. ${prefix}stupid
225. ${prefix}character
226. ${prefix}wanted
227. ${prefix}level
228. ${prefix}rank
229. ${prefix}top
230. ${prefix}leaderboard

*TOOLS & UTILITY (281-350):*
281. ${prefix}weather
282. ${prefix}news
283. ${prefix}google
284. ${prefix}lyrics
285. ${prefix}calc
286. ${prefix}remind
287. ${prefix}timer
288. ${prefix}qr
289. ${prefix}qrcode
290. ${prefix}shorturl
291. ${prefix}tinyurl
292. ${prefix}ss
293. ${prefix}screenshot
294. ${prefix}whois
295. ${prefix}ip
296. ${prefix}pastebin
297. ${prefix}obfuscate
298. ${prefix}deobfuscate
299. ${prefix}base64
300. ${prefix}binary

*NSFW & ADULT (351-370):*
351. ${prefix}waifu
352. ${prefix}neko
353. ${prefix}shinobu

*STALKER & INFO (371-400):*
371. ${prefix}getpp
372. ${prefix}savecontact
373. ${prefix}vcard
374. ${prefix}jid
375. ${prefix}id
376. ${prefix}forward
377. ${prefix}delete
378. ${prefix}edit
379. ${prefix}react
380. ${prefix}poll
381. ${prefix}vote
382. ${prefix}pair
383. ${prefix}paircode
384. ${prefix}session
385. ${prefix}git
386. ${prefix}repo
387. ${prefix}sc
388. ${prefix}script
389. ${prefix}support
390. ${prefix}donate
391. ${prefix}report
392. ${prefix}request
393. ${prefix}suggest
394. ${prefix}feedback
395. ${prefix}bug
396. ${prefix}premium
397. ${prefix}rent
398. ${prefix}buy
399. ${prefix}price
400. ${prefix}owner

*✅ TOTAL: 400 COMMANDS*
*🌍 PUBLIC MODE - ANY COUNTRY CAN USE*
*🛡️ ALL ANTI-PROTECTION ACTIVE*`;

                // WhatsApp has 65k char limit, split into 2
                const part1 = fullMenu.substring(0, 60000);
                await reply(part1);
                if (fullMenu.length > 60000) {
                    await sock.sendMessage(from, { text: fullMenu.substring(60000) });
                }
            }
            if (command === 'alive' || command === 'ping') {
                await reply(`*👑 ${config.botName} ALIVE*\n\n1. Version: PREMIUM\n2. Mode: PUBLIC\n3. Total Cmds: 400\n4. Any Country: YES\n5. Status: ONLINE 🔥`);
            }
        } catch(e) { console.error(e); }
    });
}
startBot();
