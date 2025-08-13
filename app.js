// Jr Football Coach - Sheets-connected PWA
const SHEET_ID = "1pr2BGnW8PcixQygcheyVP-njpXMeRJhmjwgBU30jn9U";
const API_KEY = "AIzaSyDgmcCPp44sls4V1NQaXCiFqvPYeHk_Eqk";
const SHEETS_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

function getAppsScriptUrl() {
  const preset = 'https://script.google.com/macros/s/AKfycbzURCDLEEEtuxRYjltzbQiDpnw6hqjb38hFL6h7LMxr101p4w2wG0ycOb4uDlXYVuh9/exec';
    return localStorage.getItem('jfc_apps_script_url') || preset;
}

const POSITIONS = [["QB", "Offense"], ["RB", "Offense"], ["WR-L", "Offense"], ["WR-R", "Offense"], ["SLOT", "Offense"], ["TE", "Offense"], ["LT", "Offense"], ["LG", "Offense"], ["C", "Offense"], ["RG", "Offense"], ["RT", "Offense"], ["DE-L", "Defense"], ["DE-R", "Defense"], ["DT", "Defense"], ["NG", "Defense"], ["OLB-L", "Defense"], ["OLB-R", "Defense"], ["MLB", "Defense"], ["CB-L", "Defense"], ["CB-R", "Defense"], ["FS", "Defense"], ["SS", "Defense"], ["K", "Special Teams"], ["P", "Special Teams"], ["KR", "Special Teams"], ["PR", "Special Teams"], ["LS", "Special Teams"], ["HOLDER", "Special Teams"]];
const POSITION_WEIGHTS = {
  "QB": {
    "throwing": 0.35,
    "awareness": 0.25,
    "agility": 0.2,
    "hands": 0.1,
    "speed": 0.1
  },
  "RB": {
    "speed": 0.35,
    "agility": 0.25,
    "awareness": 0.2,
    "strength": 0.1,
    "hands": 0.1
  },
  "WR-L": {
    "speed": 0.35,
    "hands": 0.3,
    "agility": 0.2,
    "awareness": 0.15
  },
  "WR-R": {
    "speed": 0.35,
    "hands": 0.3,
    "agility": 0.2,
    "awareness": 0.15
  },
  "SLOT": {
    "speed": 0.35,
    "agility": 0.3,
    "hands": 0.2,
    "awareness": 0.15
  },
  "TE": {
    "hands": 0.3,
    "strength": 0.25,
    "awareness": 0.2,
    "agility": 0.15,
    "speed": 0.1
  },
  "LT": {
    "strength": 0.4,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.15
  },
  "LG": {
    "strength": 0.4,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.15
  },
  "C": {
    "strength": 0.4,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.15
  },
  "RG": {
    "strength": 0.4,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.15
  },
  "RT": {
    "strength": 0.4,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.15
  },
  "DE-L": {
    "strength": 0.35,
    "tackling": 0.25,
    "awareness": 0.2,
    "agility": 0.2
  },
  "DE-R": {
    "strength": 0.35,
    "tackling": 0.25,
    "awareness": 0.2,
    "agility": 0.2
  },
  "DT": {
    "strength": 0.4,
    "tackling": 0.3,
    "awareness": 0.15,
    "agility": 0.15
  },
  "NG": {
    "strength": 0.45,
    "tackling": 0.3,
    "awareness": 0.15,
    "agility": 0.1
  },
  "OLB-L": {
    "tackling": 0.3,
    "awareness": 0.25,
    "speed": 0.2,
    "strength": 0.15,
    "agility": 0.1
  },
  "OLB-R": {
    "tackling": 0.3,
    "awareness": 0.25,
    "speed": 0.2,
    "strength": 0.15,
    "agility": 0.1
  },
  "MLB": {
    "tackling": 0.35,
    "awareness": 0.3,
    "strength": 0.2,
    "speed": 0.1,
    "agility": 0.05
  },
  "CB-L": {
    "speed": 0.35,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.2
  },
  "CB-R": {
    "speed": 0.35,
    "awareness": 0.25,
    "agility": 0.2,
    "tackling": 0.2
  },
  "FS": {
    "speed": 0.3,
    "awareness": 0.3,
    "agility": 0.2,
    "tackling": 0.2
  },
  "SS": {
    "speed": 0.25,
    "awareness": 0.3,
    "tackling": 0.25,
    "agility": 0.2
  },
  "K": {
    "kicking": 0.6,
    "awareness": 0.25,
    "agility": 0.15
  },
  "P": {
    "kicking": 0.6,
    "awareness": 0.25,
    "agility": 0.15
  },
  "KR": {
    "speed": 0.4,
    "agility": 0.35,
    "awareness": 0.25
  },
  "PR": {
    "speed": 0.35,
    "agility": 0.35,
    "awareness": 0.3
  },
  "LS": {
    "awareness": 0.4,
    "strength": 0.3,
    "agility": 0.3
  },
  "HOLDER": {
    "awareness": 0.5,
    "hands": 0.3,
    "agility": 0.2
  }
};

const DEFAULT_STATE = {
  settings: { requiredPractices: 8 },
  players: [],
  attendance: [],
  ratings: []
};

function loadLocal(){
  const raw = localStorage.getItem('jfc_state');
  if(!raw) return structuredClone(DEFAULT_STATE);
  try{ return JSON.parse(raw); }catch(e){ return structuredClone(DEFAULT_STATE); }
}
function saveLocal(){
  localStorage.setItem('jfc_state', JSON.stringify(state));
}
let state = loadLocal();

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
function fmtName(p){ return p.last + ', ' + p.first; }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function getPositions(){ return POSITIONS.map(([k,g])=>k); }

function rowsToPlayers(values){
  const [head, ...rows] = values;
  const idx = Object.fromEntries(head.map((h,i)=>[h,i]));
  return rows.filter(r=>r.length).map(r=>({
    id: crypto.randomUUID(),
    jersey: parseInt(r[idx.Jersey]||'0'),
    first: (r[idx.Name]||'').split(' ')[0]||'',
    last: (r[idx.Name]||'').split(' ').slice(1).join(' ')||'',
    grade: r[idx.Grade]||'',
    primary: r[idx.PrimaryPos]||'',
    secondary: r[idx.SecondaryPos]||'',
    ratings: {}
  }));
}
function playersToRows(players){
  const head = ["Jersey","Name","Grade","PrimaryPos","SecondaryPos","Contact","Notes"];
  const rows = players.map(p=>[p.jersey, (p.first+' '+p.last).trim(), p.grade, p.primary, p.secondary, "", ""]);
  return [head, ...rows];
}
function rowsToAttendance(values){
  const [head, ...rows] = values;
  const idx = Object.fromEntries(head.map((h,i)=>[h,i]));
  return rows.filter(r=>r.length).map(r=>({
    date: r[idx.Date]||'',
    jersey: parseInt(r[idx.Jersey]||'0'),
    name: r[idx.Name]||'',
    status: r[idx.Status]||'',
    note: r[idx.Note]||''
  }));
}
function attendanceToRows(att){
  const head = ["Date","Jersey","Name","Status","Note"];
  const rows = att.map(a=>[a.date, a.jersey, a.name, a.status, a.note||""]);
  return [head, ...rows];
}
function rowsToRatings(values){
  const [head, ...rows] = values;
  const idx = Object.fromEntries(head.map((h,i)=>[h,i]));
  return rows.filter(r=>r.length).map(r=>({
    jersey: parseInt(r[idx.Jersey]||'0'),
    name: r[idx.Name]||'',
    speed:+(r[idx.Speed]||0), strength:+(r[idx.Strength]||0), agility:+(r[idx.Agility]||0),
    tackling:+(r[idx.Tackling]||0), awareness:+(r[idx.Awareness]||0), hands:+(r[idx.Hands]||0),
    throwing:+(r[idx.Throwing]||0), kicking:+(r[idx.Kicking]||0)
  }));
}
function ratingsToRows(items){
  const head = ["Jersey","Name","Speed","Strength","Agility","Tackling","Awareness","Hands","Throwing","Kicking","CoachNote"];
  const rows = items.map(r=>[r.jersey, r.name, r.speed||0, r.strength||0, r.agility||0, r.tackling||0, r.awareness||0, r.hands||0, r.throwing||0, r.kicking||0, ""]);
  return [head, ...rows];
}

async function readSheet(range){
  const url = `${SHEETS_BASE}/${encodeURIComponent(range)}?key=${API_KEY}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Sheets read failed');
  return (await res.json()).values || [];
}

async function cloudLoad(){
  const [playersV, attendanceV, ratingsV] = await Promise.all([
    readSheet('Players'),
    readSheet('Attendance'),
    readSheet('Ratings')
  ]);
  const players = rowsToPlayers(playersV);
  const attendanceRows = rowsToAttendance(attendanceV);
  const ratingsRows = rowsToRatings(ratingsV);

  players.forEach(p=>{
    const r = ratingsRows.find(x=>x.jersey===p.jersey) || {};
    p.ratings = {
      speed:r.speed||0, strength:r.strength||0, agility:r.agility||0, tackling:r.tackling||0,
      awareness:r.awareness||0, hands:r.hands||0, throwing:r.throwing||0, kicking:r.kicking||0
    };
  });

  const byJersey = Object.fromEntries(players.map(p=>[p.jersey,p]));
  const attendance = attendanceRows.map(a=>({
    date:a.date, playerId: byJersey[a.jersey]?.id || null, status:a.status, note:a.note
  })).filter(a=>a.playerId);

  state.players = players;
  state.attendance = attendance;
  state.ratings = ratingsRows;
  saveLocal();
}

async function cloudSave(){
  const url = getAppsScriptUrl();
  if(!url) throw new Error('Apps Script URL not set (Settings tab)');
  const playersRows = playersToRows(state.players);
  const byId = Object.fromEntries(state.players.map(p=>[p.id,p]));
  const attendanceRows = state.attendance.map(a=>({
    date:a.date, jersey:byId[a.playerId]?.jersey||'', name: byId[a.playerId]? (byId[a.playerId].first+' '+byId[a.playerId].last).trim(): '', status:a.status, note:a.note||''
  }));
  const attendanceOut = attendanceToRows(attendanceRows);
  const ratingsOut = ratingsToRows(state.players.map(p=>({
    jersey:p.jersey, name:(p.first+' '+p.last).trim(), speed:p.ratings.speed||0, strength:p.ratings.strength||0, agility:p.ratings.agility||0,
    tackling:p.ratings.tackling||0, awareness:p.ratings.awareness||0, hands:p.ratings.hands||0, throwing:p.ratings.throwing||0, kicking:p.ratings.kicking||0
  })));

  const payload = { players: playersRows, attendance: attendanceOut, ratings: ratingsOut };
  const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(payload)
});
  if(!res.ok) throw new Error('Cloud save failed');
  return await res.json();
}

function getAttendance(date, playerId){
  return state.attendance.find(a=>a.date===date && a.playerId===playerId);
}
function setAttendance(date, playerId, status){
  let rec = getAttendance(date, playerId);
  if(!rec) { rec = {date, playerId, status, note:''}; state.attendance.push(rec); }
  else rec.status = status;
  saveLocal();
}
function attendedCount(playerId, refDate){
  return state.attendance.filter(a=>a.playerId===playerId && a.date < refDate && (a.status==='Present'||a.status==='Late')).length;
}
function eligibleStatus(playerId, refDate){
  const need = state.settings.requiredPractices || 8;
  const count = attendedCount(playerId, refDate);
  if(count >= need) return {label:'Eligible', cls:'ok', count, need};
  if(count >= Math.max(0, need-2)) return {label:'Almost', cls:'warn', count, need};
  return {label:'Ineligible', cls:'no', count, need};
}
function positionScore(player, pos){
  const w = POSITION_WEIGHTS[pos] || {};
  const r = player.ratings || {};
  let sum = 0;
  for(const k in w) sum += (r[k]||0) * w[k];
  return sum;
}
function generateDepth(refDate, eligibleOnly=true){
  const positions = getPositions();
  const result = {};
  positions.forEach(pos=>{
    let players = state.players.slice();
    if(eligibleOnly) players = players.filter(p=>eligibleStatus(p.id, refDate).label==='Eligible');
    players = players
      .map(p=>({p, score: positionScore(p, pos), pref: p.primary===pos?2: (p.secondary===pos?1:0)}))
      .filter(x=>x.score>0 || x.pref>0)
      .sort((a,b)=> (b.pref - a.pref) || (b.score - a.score) || (a.p.jersey - b.p.jersey));
    result[pos] = players.slice(0,3).map(x=>x.p);
  });
  return result;
}

document.addEventListener('DOMContentLoaded',()=>{
  $$('nav#tabs button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('nav#tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    $$('.tab').forEach(s=>s.classList.remove('active'));
    document.querySelector('#tab-'+tab).classList.add('active');
    render();
  }));

  $('#btnAddPlayer').addEventListener('click',()=>openPlayerDialog());
  $('#btnExport').addEventListener('click',()=>exportData());
  $('#btnExport2').addEventListener('click',()=>exportData());
  $('#btnImport').addEventListener('click',()=>$('#fileImport').click());
  $('#btnImport2').addEventListener('click',()=>$('#fileImport2').click());
  $('#fileImport').addEventListener('change',importData);
  $('#fileImport2').addEventListener('change',importData);
  $('#btnReset').addEventListener('click',()=>{ if(confirm('Clear all local data?')){ localStorage.removeItem('jfc_state'); state=loadLocal(); render(); } });

  $('#btnCloudLoad').addEventListener('click', async ()=>{ try{ await cloudLoad(); alert('Loaded from Sheets'); render(); } catch(e){ alert(e.message); } });
  $('#btnCloudSave').addEventListener('click', async ()=>{ try{ await cloudSave(); alert('Saved to Sheets'); } catch(e){ alert(e.message); } });

  $('#attDate').value = todayISO();
  $('#btnMarkAllAbsent').addEventListener('click',()=>{ const d=$('#attDate').value; state.players.forEach(p=> setAttendance(d,p.id,'Absent')); renderAttendance(); });
  $('#attSort').addEventListener('change', renderAttendance);
  $('#attDate').addEventListener('change', renderAttendance);

  $('#appsScriptUrl').value = getAppsScriptUrl();
  $('#appsScriptUrl').addEventListener('change', e=>{ localStorage.setItem('jfc_apps_script_url', e.target.value.trim()); });
  $('#requiredPractices').addEventListener('change', e=>{ state.settings.requiredPractices = Math.max(1, +e.target.value||8); saveLocal(); render(); });

  render();
});

function render(){
  renderPlayers();
  renderAttendance();
  renderEligibility();
  renderDepth();
  renderSettings();
}

function renderPlayers(){
  const list = document.createElement('div'); list.className='list';
  state.players.sort((a,b)=> (a.jersey||0)-(b.jersey||0));
  state.players.forEach(p=>{
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `
      <div class="pill">#${p.jersey||''}</div>
      <div><strong>${fmtName(p)}</strong><br><small>${p.primary||''}${p.secondary? ' / '+p.secondary:''}</small></div>
      <button class="secondary" data-act="rate">Rate</button>
      <button data-act="edit">Edit</button>
    `;
    row.querySelector('[data-act="edit"]').addEventListener('click',()=>openPlayerDialog(p));
    row.querySelector('[data-act="rate"]').addEventListener('click',()=>openPlayerDialog(p,true));
    list.appendChild(row);
  });
  $('#playersList').innerHTML = ''; $('#playersList').appendChild(list);

  const pos = getPositions();
  const prim = $('#pPrimary'), sec=$('#pSecondary'); prim.innerHTML=''; sec.innerHTML='<option value="">(none)</option>';
  pos.forEach(k=>{ prim.insertAdjacentHTML('beforeend', `<option value="${k}">${k}</option>`); sec.insertAdjacentHTML('beforeend', `<option value="${k}">${k}</option>`); });
}

function openPlayerDialog(player=null, ratingsOnly=false){
  const d = $('#playerDialog');
  $('#playerDialogTitle').textContent = player? (ratingsOnly?'Update Ratings':'Edit Player') : 'Add Player';
  $('#pJersey').value = player?.jersey ?? '';
  $('#pFirst').value = player?.first ?? '';
  $('#pLast').value = player?.last ?? '';
  $('#pGrade').value = player?.grade ?? '';
  $('#pPrimary').value = player?.primary ?? '';
  $('#pSecondary').value = player?.secondary ?? '';
  const r = player?.ratings || {};
  const set = (id,val)=>$('#'+id).value = (val??'');
  set('rSpeed', r.speed); set('rStrength', r.strength); set('rAgility', r.agility); set('rTackling', r.tackling);
  set('rAwareness', r.awareness); set('rHands', r.hands); set('rThrowing', r.throwing); set('rKicking', r.kicking);

  $$('#playerDialog .grid')[0].style.display = ratingsOnly? 'none':'grid';

  d.showModal();
  $('#btnSavePlayer').onclick = ()=>{
    if(!player && ratingsOnly) { d.close(); return; }
    const data = {
      jersey: parseInt($('#pJersey').value||'0'),
      first: $('#pFirst').value.trim(),
      last: $('#pLast').value.trim(),
      grade: $('#pGrade').value.trim(),
      primary: $('#pPrimary').value || '',
      secondary: $('#pSecondary').value || '',
      ratings: {
        speed: +($('#rSpeed').value||0),
        strength: +($('#rStrength').value||0),
        agility: +($('#rAgility').value||0),
        tackling: +($('#rTackling').value||0),
        awareness: +($('#rAwareness').value||0),
        hands: +($('#rHands').value||0),
        throwing: +($('#rThrowing').value||0),
        kicking: +($('#rKicking').value||0),
      }
    };
    if(player) { Object.assign(player, data); }
    else { state.players.push({id: crypto.randomUUID(), ...data}); }
    saveLocal(); d.close(); render();
  };
}

function renderAttendance(){
  const date = $('#attDate').value || todayISO();
  const sort = $('#attSort').value;
  const list = document.createElement('div'); list.className='list';
  let players = state.players.slice();
  if(sort==='name') players.sort((a,b)=> fmtName(a).localeCompare(fmtName(b)));
  else if(sort==='position') players.sort((a,b)=> (a.primary||'').localeCompare(b.primary||'') || (a.jersey||0)-(b.jersey||0));
  else players.sort((a,b)=> (a.jersey||0)-(b.jersey||0));
  players.forEach(p=>{
    const rec = state.attendance.find(a=>a.date===date && a.playerId===p.id);
    const s = rec?.status || '';
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `
      <div class="pill">#${p.jersey||''}</div>
      <div><strong>${fmtName(p)}</strong><br><small>${p.primary||''}${p.secondary? ' / '+p.secondary:''}</small></div>
      <div class="attBtns">
        <button data-val="Present" ${s==='Present'?'class="active"':''}>Present</button>
        <button data-val="Late" ${s==='Late'?'class="active"':''}>Late</button>
        <button data-val="Absent" ${s==='Absent'?'class="active"':''}>Absent</button>
      </div>
    `;
    row.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ setAttendance(date, p.id, b.dataset.val); renderAttendance(); }));
    list.appendChild(row);
  });
  $('#attendanceList').innerHTML=''; $('#attendanceList').appendChild(list);
}

function renderEligibility(){
  $('#gameDate').value ||= todayISO();
  const d = $('#gameDate').value;
  const need = state.settings.requiredPractices || 8;
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Jersey</th><th>Name</th><th>Count &lt; ${d}</th><th>Needed to ${need}</th><th>Status</th></tr></thead>`;
  const tb = document.createElement('tbody');
  state.players.slice().sort((a,b)=> (a.jersey||0)-(b.jersey||0)).forEach(p=>{
    const st = eligibleStatus(p.id, d);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>#${p.jersey||''}</td><td>${fmtName(p)}</td><td>${st.count}</td><td>${Math.max(0,(need-st.count))}</td><td><span class="badge ${st.cls}">${st.label}</span></td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  $('#eligibilityTable').innerHTML=''; $('#eligibilityTable').appendChild(table);
}

function renderDepth(){
  $('#depthGameDate').value ||= todayISO();
  const d = $('#depthGameDate').value;
  const only = $('#useEligibleOnly').checked;
  const data = generateDepth(d, only);

  const groups = {'Offense':[], 'Defense':[], 'Special Teams':[]};
  POSITIONS.forEach(([k,g])=>{ groups[g].push(k); });
  const wrapper = document.createElement('div');

  Object.keys(groups).forEach(g=>{
    const table = document.createElement('table');
    const thead = document.createElement('thead'); thead.innerHTML = `<tr><th colspan="4">${g}</th></tr>`; table.appendChild(thead);
    const tb = document.createElement('tbody');
    groups[g].forEach(pos=>{
      const picks = (data[pos]||[]);
      const names = picks.map(p=>`#${p.jersey} ${fmtName(p)}`).concat(['','','']).slice(0,3);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td style="width:120px"><strong>${pos}</strong></td><td>${names[0]||''}</td><td>${names[1]||''}</td><td>${names[2]||''}</td>`;
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    wrapper.appendChild(table);
  });
  $('#depthChart').innerHTML=''; $('#depthChart').appendChild(wrapper);
}

function renderSettings(){
  $('#requiredPractices').value = state.settings.requiredPractices || 8;
  const div = document.createElement('div'); div.className='list';
  POSITIONS.forEach(([k,g])=>{
    const row = document.createElement('div'); row.className='row';
    row.innerHTML = `<div class="pill">${g}</div><div><strong>${k}</strong></div><div></div><div></div>`;
    div.appendChild(row);
  });
  $('#positionList').innerHTML=''; $('#positionList').appendChild(div);
}

function exportData(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jfc_data.json';
  a.click();
}
async function importData(e){
  const file = e.target.files[0]; if(!file) return;
  const text = await file.text();
  try{ state = JSON.parse(text); saveLocal(); render(); }
  catch(err){ alert('Import failed: '+err.message); }
  e.target.value = '';
}

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js'));
}
