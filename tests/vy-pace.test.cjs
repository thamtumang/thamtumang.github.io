const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,total,nextActions,sourceReadingTarget,focusRequest:()=>{focusSharedRequest=true}};\n  render();\n})();');
function load(saved,withReader=false){
 let persisted,focused=null;
 const location={hash:''},listeners={};
 const body={scrollTop:0,getBoundingClientRect:()=>({top:100}),addEventListener:(name,fn)=>listeners[name]=fn,
  querySelector:selector=>['#recruiter-today','.request-context'].includes(selector)?{
   getBoundingClientRect:()=>({top:100+(selector==='#recruiter-today'?640:1100)-body.scrollTop}),
   focus(){focused=selector;}
  }:null};
 const host={innerHTML:'',addEventListener(){},querySelector:selector=>withReader&&location.hash==='#recruiter'&&selector==='.source-body'?body:null};
 const context={document:{getElementById:()=>host},window:{scrollY:0,scrollTo(){},frameElement:{caTrucStorage:{load:()=>saved,save:s=>persisted=JSON.parse(JSON.stringify(s))}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,context);const t=context.test;
 t.view=v=>{location.hash='#'+v;t.render();};t.do=(a,id)=>{t.act(a,id);t.render();};t.saved=()=>persisted;t.html=()=>host.innerHTML;t.body=body;t.focused=()=>focused;t.scroll=y=>{body.scrollTop=y;listeners.scroll?.();};return t;
}
// Receipt follow-up replaces the generic promise; it does not turn reading into verification.
for(const choice of [0,1]){
 const t=load();t.view('receipt');t.do('send-evidence','receipt-'+choice);
 const count=t.state.messages.length,ui=t.nextActions();
 assert.equal((ui.match(/href="#post"/g)||[]).length,1);assert.doesNotMatch(ui,/href="#club"|data-action="pause"/);
 assert.match(ui,/data-id="stop"/);assert.match(ui,/data-action="risk"/);
 t.view('post');assert.equal(t.state.messages.length,count);assert.equal(t.state.asked.length,0);assert.equal(t.state.verifiedShared,false);assert.equal(t.total(),'500.000đ');
}
// Found Studio and an unforwarded answer are reused, never disclosed to Vy automatically.
for(const answered of [false,true]){
 const t=load();t.view('club');if(answered)t.do('ask','process');t.view('receipt');t.do('send-evidence','receipt-0');
 const ui=t.nextActions();assert.equal((ui.match(/href="#club"/g)||[]).length,1);assert.doesNotMatch(ui,/href="#post"|data-action="pause"/);assert.equal(t.state.verifiedShared,false);assert.equal(t.state.stopped,false);
 t.view('club');assert.equal(t.state.asked.length,answered?1:0);assert.equal(t.state.messages.length,2);
}
// Existing decisions win over a later interpretation/revision; the paid total never rolls back.
for(const kind of ['stopped','verified','paid']){
 const t=load();if(kind==='stopped')t.do('scene','stop');if(kind==='verified'){t.view('club');t.do('ask','process');t.do('share-process');}if(kind==='paid'){t.do('risk');t.do('proceed');}
 t.view('receipt');t.do('send-evidence','receipt-0');assert.equal(t.total(),kind==='paid'?'1.500.000đ':'500.000đ');
 if(kind!=='paid')assert.equal(t.state.stopped,true);
 t.do('review','receipt');t.do('draft','receipt-1');t.do('send-draft');assert.equal(t.total(),kind==='paid'?'1.500.000đ':'500.000đ');assert.doesNotMatch(t.nextActions(),/data-action="risk"/);
}
// First open anchors at the change of work, then user scroll positions (including zero) win.
let t=load(undefined,true);assert.equal(t.sourceReadingTarget('recruiter'),'#recruiter-today');t.view('recruiter');assert.equal(t.body.scrollTop,632);assert.equal(t.state.scrolls.recruiter,632);assert.equal(t.state.messages.length,0);assert.match(t.html(),/id="recruiter-today"/);
t.scroll(178);t.view('inbox');t.view('recruiter');assert.equal(t.body.scrollTop,178);t=load(t.saved(),true);assert.equal(t.body.scrollTop,178);
t.scroll(0);t.view('inbox');t.view('recruiter');assert.equal(t.body.scrollTop,0);
for(const old of [{view:'recruiter',scrolls:{recruiter:0}},{view:'recruiter',scrolls:{recruiter:245}},{view:'recruiter',seen:['recruiter']}]){
 t=load(old,true);assert.equal(t.body.scrollTop,old.scrolls?.recruiter||0);
}
// An explicit excerpt link overrides the restore only for that navigation.
t.focusRequest();t.view('recruiter');assert.equal(t.body.scrollTop,1092);assert.equal(t.focused(),'.request-context');t.scroll(64);t.render();assert.equal(t.body.scrollTop,64);
// Stopping inside support keeps the pane and adds one pair only, at either total.
for(const paid of [false,true]){
 t=load();if(paid){t.do('risk');t.do('proceed');}t.view('recover');const count=t.state.messages.length;t.do('stop');
 assert.equal(t.state.view,'recover');assert.equal(t.state.messages.length,count+2);assert.equal(t.state.messages.at(-1).supportKind,'stop');assert.match(t.html(),/stop-confirmation/);
 assert.equal(t.state.receiptSaved,false);assert.equal(t.state.chatSaved,false);assert.equal(t.state.reported,false);assert.equal(t.state.dossier,false);assert.equal(t.state.helpSeen.length,0);assert.equal(t.state.helpShared.length,0);
 const events=t.state.timeline.length;t.do('stop');assert.equal(t.state.messages.length,count+2);assert.equal(t.state.timeline.length,events);
 t.view('proofs');t.do('keep','receiptSaved');assert.equal(t.state.chatSaved,false);t.do('keep','chatSaved');assert.equal(t.state.receiptSaved,true);assert.equal(t.total(),paid?'1.500.000đ':'500.000đ');
}
// Legacy text, attachment, pending draft and saved document are never rewritten.
const old={view:'inbox',openingVersion:3,messages:[{sent:true,text:'Ý cũ',attachment:{source:'Ví học đường · Biên lai',quote:'Biên lai cũ'}}],draft:{id:'post',choice:1},dossierSnapshot:{amount:'500.000đ',summary:'Bản cũ',attachments:[]},scrolls:{recruiter:0}};
t=load(old);assert.equal(JSON.stringify(t.state.messages),JSON.stringify(old.messages));assert.equal(JSON.stringify(t.state.draft),JSON.stringify(old.draft));assert.equal(JSON.stringify(t.state.dossierSnapshot),JSON.stringify(old.dossierSnapshot));assert.equal(t.sourceReadingTarget('recruiter'),null);
console.log('PASS: receipt context routes, no inferred verification, retained decisions/totals, first-open vs saved-zero reading, explicit excerpt links, in-place support stop, idempotence and legacy data.');
