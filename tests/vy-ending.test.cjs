const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,summary,endingState,endingInvitation};\n  render();\n})();');
function load(saved,closable=true){
 let persisted,closed=0;const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''};const frame={caTrucStorage:{load:()=>saved,save:s=>persisted=JSON.parse(JSON.stringify(s))}};
 if(closable)frame.caTrucClose=()=>closed++;
 const ctx={document:{getElementById:()=>host},window:{scrollY:0,scrollTo(){},frameElement:frame},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,ctx);const t=ctx.test;t.view=v=>{location.hash='#'+v;t.render()};t.do=(a,id)=>{t.act(a,id);t.render()};t.saved=()=>persisted;t.closed=()=>closed;return t;
}
// Outcomes derive from real decisions, independently of reports, evidence or the last panel.
for(const extraPaid of [false,true])for(const stopped of [false,true])for(const paused of [false,true])for(const verifiedShared of [false,true]){
 const t=load({finished:true,extraPaid,stopped,paused,verifiedShared,reported:true,dossier:true,receiptSaved:true,chatSaved:true});
 const snapshot=JSON.stringify(t.state);const result=t.endingState();
 assert.equal(result.kind,extraPaid?'extra':verifiedShared&&stopped?'verified':stopped?'stopped':paused?'paused':'undecided');
 assert.equal(result.amount,extraPaid?'1.500.000đ':'500.000đ');assert.equal(result.stopped,stopped);
 t.summary();t.endingInvitation();assert.equal(JSON.stringify(t.state),snapshot);
 if(!stopped)assert.equal(t.endingInvitation().view,'recover');
}
// Support suggestions reflect read/shared/evidence states, without executing any action.
for(const [saved,view] of [
 [{stopped:true},'help'],
 [{stopped:true,helpSeen:['bankHelp']},'bankHelp'],
 [{stopped:true,helpSeen:['policeHelp']},'policeHelp'],
 [{stopped:true,helpSeen:['bankHelp','policeHelp']},'help'],
 [{stopped:true,helpSeen:['bankHelp'],helpShared:['bankHelp'],receiptSaved:true},'proofs'],
 [{stopped:true,helpSeen:['bankHelp'],helpShared:['bankHelp'],receiptSaved:true,chatSaved:true},'recover']
 ]){const t=load(saved);const before=JSON.stringify(t.state);assert.equal(t.endingInvitation().view,view);assert.equal(JSON.stringify(t.state),before);}
// Returning to desktop only closes this window; it saves, never resets or invents actions.
let t=load({view:'result',finished:true,stopped:true,extraPaid:true,dossierDraft:{schema:2,amount:'500.000đ',selected:[],attachments:[]},timeline:['existing']});
const before=JSON.stringify({...t.state,scrolls:{result:0}});t.act('leave-case');assert.equal(t.closed(),1);assert.equal(JSON.stringify(t.saved()),before);
const resumed=load(t.saved());assert.equal(resumed.state.extraPaid,true);assert.equal(resumed.state.dossierDraft.amount,'500.000đ');assert.deepEqual(Array.from(resumed.state.timeline),['existing']);
t=load({finished:true},false);t.view('result');t.act('leave-case');assert.equal(t.closed(),0);
// Default ending content never includes a task list; all detailed lists stay in disclosures.
t=load({finished:true});const html=t.summary(),main=html.slice(html.indexOf('<section class="ending-main"'),html.indexOf('</section>'));
assert.ok(!main.includes('<ul>'));assert.equal((html.match(/<details class="ending-/g)||[]).length,3);
assert.ok(!/<details class="ending-[^>]+\sopen(?:\s|>)/.test(html));
console.log('PASS: outcome/CTA state combinations, side-effect-free summaries, retained desktop-close state and collapsed detail structure.');
