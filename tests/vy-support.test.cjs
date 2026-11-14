const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,summary};\n  render();\n})();');
function load(saved){
 const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''};
 let persisted;
 const context={document:{getElementById:()=>host},requestAnimationFrame:fn=>fn(),window:{scrollTo(){},scrollY:0,frameElement:{caTrucStorage:{load:()=>saved,save(value){persisted=JSON.parse(JSON.stringify(value));}}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,context);const t=context.test;
 t.view=v=>{location.hash='#'+v;t.render();};t.do=(a,id)=>{t.act(a,id);t.render();};t.html=()=>host.innerHTML;t.saved=()=>persisted;
 return t;
}
// Scene is one-time; opening artifacts does not save or contact anyone.
let t=load();t.do('pause');t.view('recover');const initial=t.state.messages.length;
t.view('proofs');t.view('recover');assert.equal(t.state.messages.length,initial);
assert.equal(t.state.receiptSaved,false);assert.equal(t.state.chatSaved,false);
t.view('proofs');t.do('keep','receiptSaved');const after=t.state.messages.length;t.do('keep','receiptSaved');assert.equal(t.state.messages.length,after);
t.do('support-finish');assert.equal(t.state.extraPaid,false);assert.equal(t.state.verifiedShared,false);assert.equal(t.state.helpShared.length,0);
assert.match(t.summary(),/Còn thiếu tin nhắn/);
// Directory, source, draft, forwarding and preparing are separate transitions.
t=load();t.view('club');t.do('ask','process');t.do('share-process');t.view('recover');t.view('help');assert.equal(t.state.helpSeen.length,0);
t.view('bankHelp');assert.equal(t.state.helpSeen.length,1);const logsize=t.state.timeline.length;t.view('help');t.view('bankHelp');assert.equal(t.state.timeline.length,logsize);
t.do('draft-help','bankHelp');assert.equal(t.state.helpShared.length,0);t.do('cancel-help','bankHelp');assert.equal(t.state.helpShared.length,0);
t.do('draft-help','bankHelp');t=load(t.saved());assert.equal(t.state.helpDraft,'bankHelp');t.do('share-help','bankHelp');const sent=t.state.messages.length;t.do('share-help','bankHelp');assert.equal(t.state.messages.length,sent);
assert.equal(t.state.dossier,false);t.view('dossier');assert.equal(t.state.dossier,false);t.do('dossier');assert.equal(t.state.dossier,true);assert.equal(t.state.dossierSnapshot.receipts,false);assert.equal(t.state.dossierSnapshot.chat,false);assert.equal(t.state.reported,false);
const prepared=t.state.timeline.length;t.do('dossier');assert.equal(t.state.timeline.length,prepared);
t.view('proofs');t.do('keep','receiptSaved');assert.equal(t.state.dossierSnapshot.receipts,false); // no silent dossier update
const ordered=t.state.timeline.join('\n');assert.ok(ordered.indexOf('Đã mở hướng dẫn')<ordered.indexOf('Đã gửi hướng dẫn'));assert.ok(ordered.indexOf('Đã gửi hướng dẫn')<ordered.indexOf('Đã chuẩn bị'));
// Report preview/cancel do not report. A stale amount must be reviewed again.
t=load();t.view('report');t.do('report');assert.equal(t.state.reported,false);t.do('draft-report');t.do('cancel-report');assert.equal(t.state.reported,false);
t.do('draft-report');const oldDraft=t.state.reportDraft;t=load(t.saved());assert.equal(t.state.reportDraft.amount,oldDraft.amount);
t.view('inbox');t.do('risk');t.do('proceed');t.do('proceed');assert.equal(t.state.extraPaid,true);assert.equal(t.state.messages.filter(m=>m.text==='Tớ vừa chuyển thêm 1 triệu rồi.').length,1);
t.view('report');t.do('report');assert.equal(t.state.reported,false);t.do('draft-report');t.do('report');assert.equal(t.state.reportSnapshot.amount,'1.500.000đ');const reported=t.state.messages.length;t.do('report');assert.equal(t.state.messages.length,reported);
assert.equal(t.state.dossier,false);assert.equal(t.state.helpShared.length,0);t.view('recover');t.do('stop');t.view('proofs');t.do('keep','chatSaved');t.do('keep','receiptSaved');t.view('dossier');t.do('dossier');assert.equal(t.state.dossierSnapshot.amount,'1.500.000đ');assert.equal(t.state.reported,true);
// Old reports are not rewritten by later transactions; no new support actions inferred.
t=load();t.view('report');t.do('draft-report');t.do('report');t.view('inbox');t.do('risk');t.do('proceed');assert.equal(t.state.reportSnapshot.amount,'500.000đ');
t=load({view:'recover',messages:[],seen:[],sent:[],asked:[],reported:true,dossier:true,receiptSaved:true,chatSaved:true,stopped:true});assert.equal(t.state.helpSeen.length,0);assert.equal(t.state.helpShared.length,0);assert.equal(t.state.reportSnapshot,null);assert.equal(t.state.dossierSnapshot,null);const oldMessages=t.state.messages.length;t=load(t.saved());assert.equal(t.state.messages.length,oldMessages);
assert.equal(load().state.helpSeen.length,0);assert.equal(load().state.supportOpened,false);
console.log('PASS: one-time scene, partial evidence, independent source/draft/share/prepare states, report confirmation/cancel/stale amount, old saves, ordered logs and single additional payment.');
