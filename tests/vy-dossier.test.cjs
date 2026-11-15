const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,summary,dossierItems,dossierData,dossierKey};\n  render();\n})();');
function load(saved){
 let persisted,hash='';const location={get hash(){return hash},set hash(v){hash=v&&!v.startsWith('#')?'#'+v:v}};
 const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const ctx={document:{getElementById:()=>host},requestAnimationFrame:fn=>fn(),window:{scrollTo(){},scrollY:0,frameElement:{caTrucStorage:{load:()=>saved,save(s){persisted=JSON.parse(JSON.stringify(s))}}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,ctx);const t=ctx.test;
 t.view=v=>{location.hash=v;t.render()};t.do=(a,id)=>{t.act(a,id);t.render()};t.saved=()=>persisted;t.html=()=>host.innerHTML;
 t.choose=(...ids)=>{t.view('dossier');for(const id of ids)t.do('dossier-toggle',id);t.do('dossier-preview')};return t;
}
// Every source combination keeps the attached documents, stored evidence and money distinct.
const responses=new Set();
for(let mask=0;mask<16;mask++){
 const ids=['receipt45','transfers','demands','post'].filter((_,i)=>mask&(1<<i));const t=load();t.choose(...ids);
 const before=t.state.messages.length;assert.equal(t.state.dossier,false);assert.equal(t.state.receiptSaved,false);assert.equal(t.state.chatSaved,false);
 assert.deepEqual(Array.from(t.state.dossierDraft.selected),ids);t.do('dossier-send');responses.add(t.state.messages.at(-1).text);
 assert.equal(t.state.messages.length,before+2);assert.equal(t.state.dossier,false);assert.equal(t.state.dossierSent.length,1);
 assert.deepEqual(Array.from(t.state.dossierSent[0].attachments.map(x=>x.id)),ids);
 const sent=t.state.messages.length;t.view('dossier');t.do('dossier-send');assert.equal(t.state.messages.length,sent);
 t.do('dossier-save');assert.equal(t.state.messages.length,sent);assert.equal(t.state.dossier,true);assert.equal(t.state.receiptSaved,false);
 const count=t.state.timeline.length;t.do('dossier-save');assert.equal(t.state.timeline.length,count);assert.equal(t.state.dossierArchive.length,0);
}
assert.ok(responses.size>=5);
// Repeated native change delivery sets the checkbox state instead of toggling it twice.
{const t=load();t.view('dossier');t.act('dossier-toggle','transfers',true);t.act('dossier-toggle','transfers',true);assert.equal(t.state.dossierSelection.length,1);t.act('dossier-toggle','transfers',false);assert.equal(t.state.dossierSelection.length,0);}
// Saved evidence never becomes an attachment automatically. Gated Studio answers stay unavailable.
let t=load();t.view('proofs');t.do('keep','receiptSaved');t.do('keep','chatSaved');t.view('dossier');assert.equal(t.state.dossierSelection.length,0);
t.do('dossier-toggle','studioProcess');assert.equal(t.state.dossierSelection.length,0);assert.equal(t.dossierItems().studioProcess,undefined);
t.view('club');t.do('ask','post');assert.ok(t.dossierItems().studioPost);assert.equal(t.dossierItems().studioProcess,undefined);t.do('ask','process');assert.ok(t.dossierItems().studioProcess);
// Drafting, cancellation and opening do not replace a saved version or add sent messages.
t=load();t.choose('receipt45');t.do('dossier-save');const old=JSON.stringify(t.state.dossierSnapshot),messages=t.state.messages.length;
t.do('dossier-edit');t.do('dossier-toggle','demands');t.do('dossier-preview');t.do('dossier-cancel');assert.equal(JSON.stringify(t.state.dossierSnapshot),old);assert.equal(t.state.messages.length,messages);assert.equal(t.state.dossierSent.length,0);
// Revision adds a document and retains the previous sent snapshot. Repeated send adds nothing.
t=load();t.choose('transfers');t.do('dossier-send');const first=JSON.stringify(t.state.dossierSent[0]);t.do('dossier-supplement','demands');assert.equal(t.state.dossierDraft,null);t.do('dossier-preview');t.do('dossier-send');assert.equal(t.state.dossierSent.length,2);assert.equal(JSON.stringify(t.state.dossierSent[0]),first);assert.notEqual(t.state.messages[2]?.text,t.state.messages.at(-1).text);
const lastCount=t.state.messages.length;t.view('dossier');t.do('dossier-send');assert.equal(t.state.messages.length,lastCount);
// An added transfer never changes the 500k version. Stale drafts cannot be sent or saved.
t=load();t.choose('transfers');t.do('dossier-save');const saved500=JSON.stringify(t.state.dossierSnapshot);t.view('inbox');t.do('risk');t.do('proceed');t.do('proceed');assert.equal(t.state.extraPaid,true);assert.equal(JSON.stringify(t.state.dossierSnapshot),saved500);assert.equal(t.state.dossier,true);
t.view('dossier');const before=t.state.messages.length;t.do('dossier-send');t.do('dossier-save');assert.equal(t.state.messages.length,before);assert.equal(JSON.stringify(t.state.dossierSnapshot),saved500);
t.do('dossier-preview');assert.equal(t.state.dossierDraft.amount,'1.500.000đ');assert.match(t.state.dossierDraft.attachments[0].quote,/MP-500-042.*MP-1000-043/);t.do('dossier-save');assert.equal(t.state.dossierArchive.length,1);assert.equal(JSON.stringify(t.state.dossierArchive[0]),saved500);
// Saving sources after selecting them leaves an old draft/version unchanged until explicit refresh.
t=load();t.choose('transfers');t.do('dossier-send');t.view('dossier');t.do('dossier-save');const stored=JSON.stringify(t.state.dossierSnapshot);t.view('proofs');t.do('keep','receiptSaved');assert.equal(JSON.stringify(t.state.dossierSnapshot),stored);t.view('dossier');t.do('dossier-preview');t.do('dossier-send');assert.equal(t.state.dossierSent.length,1);t.do('dossier-save');assert.equal(t.state.dossierArchive.length,1);
// Old payment-v1 content and messages survive with no inferred new choices or new introduction.
const legacy={amount:'500.000đ',receipts:true,chat:false};t=load({view:'dossier',dossier:true,dossierSnapshot:legacy,messages:[{name:'Vy',text:'old message'}],receiptSaved:true});assert.equal(JSON.stringify(t.state.dossierSnapshot),JSON.stringify(legacy));assert.equal(t.state.dossierSelection.length,0);assert.equal(t.state.dossierSent.length,0);assert.equal(t.state.messages.length,1);
t.do('dossier-toggle','receipt45');t.do('dossier-preview');const reloaded=load(t.saved());assert.equal(reloaded.state.dossierDraft.selected[0],'receipt45');assert.equal(reloaded.state.messages.length,1);
assert.equal(load().state.dossierSelection.length,0);assert.equal(load().state.dossierDraft,null);
console.log('PASS: 16 document sets, distinct feedback, source gating, cancel/save/send separation, immutable revisions, stale totals, persistence and legacy migration.');

// Saving from a sent turn targets its immutable snapshot, not a newer unsent draft.
t=load();t.choose('receipt45');t.do('dossier-send');const sent45=JSON.stringify(t.state.dossierSent[0]);
t.view('dossier');t.do('dossier-edit');t.do('dossier-toggle','demands');t.do('dossier-preview');const unsent=JSON.stringify(t.state.dossierDraft),countBefore=t.state.messages.length;
t.view('inbox');t.do('dossier-save','0');assert.equal(JSON.stringify(t.state.dossierSnapshot),sent45);assert.equal(JSON.stringify(t.state.dossierDraft),unsent);assert.equal(t.state.messages.length,countBefore);
// Revisiting an exact archived sent/saved set cannot manufacture another version.
t.view('dossier');t.do('dossier-send');t.view('dossier');t.do('dossier-save');const versions=t.state.dossierSent.length,archives=t.state.dossierArchive.length;
t.do('dossier-edit');t.do('dossier-toggle','demands');t.do('dossier-preview');t.do('dossier-send');t.do('dossier-save');assert.equal(t.state.dossierSent.length,versions);assert.equal(t.state.dossierArchive.length,archives);
console.log('PASS: sent-copy save targets and duplicate archived-version guards.');
