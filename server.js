const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ADEOLA-X | Strong Pair Portal</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{ background: radial-gradient(ellipse at top, #0f172a 0%, #000 70%); color:#fff; font-family:'Inter',sans-serif; min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:20px; }
.header{ margin-top:20px; text-align:center; }
.header h1{ font-family:'Orbitron'; font-size:32px; letter-spacing:2px; background: linear-gradient(90deg,#00ff88,#00ccff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.header p{ color:#94a3b8; margin-top:8px; font-size:14px; }
.badge{ background: rgba(0,255,136,0.1); border:1px solid #00ff88; color:#00ff88; padding:5px 12px; border-radius:20px; font-size:11px; margin-top:10px; display:inline-block; }
.container{ width:100%; max-width:480px; margin-top:30px; }
.card{ background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:28px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.tabs{ display:flex; gap:10px; margin-bottom:20px; }
.tab{ flex:1; padding:12px; border-radius:12px; background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#94a3b8; cursor:pointer; text-align:center; font-weight:600; transition:0.3s; }
.tab.active{ background: linear-gradient(135deg,#00ff88,#00ccff); color:#000; border-color:transparent; box-shadow:0 5px 20px rgba(0,255,136,0.3); }
.label{ font-size:12px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; text-align:left; }
.input-group{ position:relative; margin-bottom:20px; }
.input-group span{ position:absolute; left:15px; top:50%; transform:translateY(-50%); font-size:20px; }
.input-group input{ width:100%; background: rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:16px 15px 16px 45px; color:#fff; font-size:17px; outline:none; transition:0.3s; }
.input-group input:focus{ border-color:#00ff88; box-shadow:0 0 0 3px rgba(0,255,136,0.2); }
.btn{ width:100%; background: linear-gradient(135deg,#00ff88,#00ccff); color:#000; border:none; border-radius:14px; padding:16px; font-size:16px; font-weight:700; cursor:pointer; letter-spacing:0.5px; transition:0.3s; font-family:'Orbitron'; }
.btn:hover{ transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,255,136,0.4); }
.btn:disabled{ opacity:0.6; cursor:not-allowed; transform:none; }
.result{ margin-top:20px; display:none; }
.result.show{ display:block; animation: slideUp 0.4s ease; }
@keyframes slideUp{ from{ opacity:0; transform:translateY(20px);} to{ opacity:1; transform:translateY(0);} }
.code-box{ background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%); border-radius:16px; padding:20px; color:#000; text-align:center; position:relative; }
.code-box small{ font-size:11px; opacity:0.7; letter-spacing:1px; }
.code-box h2{ font-family:'Orbitron'; font-size:36px; letter-spacing:6px; margin:10px 0; }
.code-actions{ display:flex; gap:10px; margin-top:12px; }
.code-actions button{ flex:1; background: rgba(0,0,0,0.2); border:none; padding:10px; border-radius:10px; font-weight:600; cursor:pointer; }
.timer{ margin-top:10px; font-size:12px; opacity:0.8; }
.instructions{ background: rgba(0,0,0,0.4); border-radius:16px; padding:16px; margin-top:20px; text-align:left; }
.instructions h4{ font-size:13px; color:#00ff88; margin-bottom:10px; }
.instructions ol{ padding-left:18px; font-size:13px; color:#cbd5e1; line-height:1.8; }
.footer{ margin-top:30px; font-size:11px; color:#475569; text-align:center; }
.status{ display:flex; align-items:center; gap:8px; justify-content:center; margin-top:15px; font-size:12px; color:#94a3b8; }
.dot{ width:8px; height:8px; background:#00ff88; border-radius:50%; animation:pulse 2s infinite; }
@keyframes pulse{ 0%{ box-shadow:0 0 0 0 rgba(0,255,136,0.7);} 70%{ box-shadow:0 0 0 10px rgba(0,255,136,0);} 100%{ box-shadow:0 0 0 0 rgba(0,255,136,0);} }
</style>
</head>
<body>
<div class="header">
<h1>ADEOLA-X</h1>
<p>Strong Multi-Device Pairing Portal</p>
<span class="badge">● ONLINE • NG 🇳🇬 • VN 🇻🇳 • FAST PAIR</span>
</div>

<div class="container">
<div class="card">
<div class="tabs">
<div class="tab active" onclick="setTab('vn')">🇻🇳 Vietnam</div>
<div class="tab" onclick="setTab('ng')">🇳🇬 Nigeria</div>
<div class="tab" onclick="setTab('custom')">🌍 Custom</div>
</div>

<div class="label">WhatsApp Number</div>
<div class="input-group">
<span id="flag">🇻🇳</span>
<input type="tel" id="num" placeholder="584198180" value="84584198180">
</div>

<button class="btn" id="btn" onclick="pair()">⚡ GENERATE PAIRING CODE</button>

<div class="result" id="result"></div>

<div class="instructions">
<h4>📱 HOW TO LINK:</h4>
<ol>
<li>Open WhatsApp on target phone</li>
<li>Tap <b>Settings → Linked Devices</b></li>
<li>Tap <b>Link a Device</b></li>
<li>Tap <b>Link with phone number instead</b></li>
<li>Enter the 8-digit code FAST (60s)</li>
</ol>
</div>

<div class="status"><div class="dot"></div> Server Online • No Logging Bug • Instant Code</div>
</div>

<div class="footer">
ADEOLA-X STRONG EDITION • Built for 84 & 234 • Secured • 2026<br>
If Linked Devices full (max 4), delete one device first!
</div>
</div>

<script>
let currentTab='vn';
function setTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  const input=document.getElementById('num');
  const flag=document.getElementById('flag');
  if(tab==='vn'){ flag.textContent='🇻🇳'; input.value='84584198180'; input.placeholder='584198180'; }
  if(tab==='ng'){ flag.textContent='🇳🇬'; input.value='2348012345678'; input.placeholder='8012345678'; }
  if(tab==='custom'){ flag.textContent='🌍'; input.value=''; input.placeholder='e.g. 234... or 84...'; }
}

async function pair(){
  const num=document.getElementById('num').value;
  const btn=document.getElementById('btn');
  const resDiv=document.getElementById('result');
  if(!num){ alert('Enter number'); return; }
  btn.disabled=true; btn.textContent='⏳ GENERATING...';
  resDiv.classList.remove('show');
  resDiv.innerHTML='';
  resDiv.style.display='block';
  resDiv.innerHTML='<p style="text-align:center;color:#94a3b8;padding:20px;">⏳ Connecting to WhatsApp servers...<br><small>Fixing logging bug...</small></p>';
  resDiv.classList.add('show');

  try{
    const res=await fetch('/pair',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({number:num})});
    const data=await res.json();
    if(data.code){
      resDiv.innerHTML=\`
        <div class="code-box">
          <small>SUCCESS • +$\{data.number}</small>
          <h2>$\{data.code}</h2>
          <div class="code-actions">
            <button onclick="navigator.clipboard.writeText('$\{data.code.replace(/-/g,'')\}'); this.textContent='Copied!'">📋 COPY</button>
            <button onclick="this.textContent='Saved!'">💾 $\{data.folder}</button>
          </div>
          <div class="timer" id="timer">⏰ Expires in 60s - Enter FAST!</div>
        </div>
      \`;
      let sec=60;
      const timer=setInterval(()=>{
        sec--; const el=document.getElementById('timer');
        if(el) el.textContent='⏰ Expires in '+sec+'s - Enter FAST!';
        if(sec<=0) clearInterval(timer);
      },1000);
    }else{
      resDiv.innerHTML=\`<div style="background:rgba(255,0,0,0.1); border:1px solid rgba(255,0,0,0.3); border-radius:14px; padding:16px; color:#fca5a5; font-size:13px;"><b>❌ $\{data.error}</b><br><br>$\{data.tip}</div>\`;
    }
  }catch(e){
    resDiv.innerHTML=\`<div style="background:rgba(255,0,0,0.1); border-radius:14px; padding:16px; color:#fca5a5;">Error: $\{e.message}</div>\`;
  }
  btn.disabled=false; btn.textContent='⚡ GENERATE PAIRING CODE';
}
</script>
</body>
</html>
  `);
});

app.post('/pair', async (req, res) => {
  let num = (req.body.number || '').replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Enter number!'});
  if(num.startsWith('0') && num.length==11) num='234'+num.slice(1);
  if(num.startsWith('0') && num.length==10) num='84'+num.slice(1);
  if(num.length==9) num='84'+num;
  
  const folder = `s_${num}_${Date.now()}`;
  console.log(`[STRONG] Pairing +${num}`);
  
  try{
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    const sock = makeWASocket({
      auth: state,
      logger: P({level:'silent'}),
      printQRInTerminal:false,
      browser:["Ubuntu","Chrome","110.0.5585.95"],
      markOnlineOnConnect:false,
      syncFullHistory:false
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(1200);
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log(`[STRONG] CODE +${num}: ${code}`);
    res.json({code, number:num, folder});
    sock.ev.on('connection.update', (u)=>{ if(u.connection==='open') console.log(`[STRONG] ✅ +${num} LINKED!`); });
    setTimeout(()=>{ try{sock.ws.close()}catch{} }, 85000);
  }catch(e){
    console.error(`[STRONG] Error +${num}:`, e.message);
    try{ fs.rmSync(folder,{recursive:true, force:true}) }catch{}
    res.json({error:e.message, tip:'1) Number get WhatsApp? 2) Linked Devices full? Delete 1 (max 4) 3) Use 11 digits: 84584198180 4) Try again after 2 min if rate-limited'});
  }
});

app.get('/status', (req,res)=>{ res.json({online:true, version:'ADEOLA-X STRONG', countries:['VN 84','NG 234'], fix:'No more logging in bug'}); });

app.listen(PORT, '0.0.0.0', ()=>{
  console.log('\n================================');
  console.log('🔥 ADEOLA-X STRONG WEBSITE ONLINE!');
  console.log('Local: http://localhost:3000');
  console.log('Status: http://localhost:3000/status');
  console.log('================================\n');
});
