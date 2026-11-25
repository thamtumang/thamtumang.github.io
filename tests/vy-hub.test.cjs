const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,total};\n  render();\n})();');
function load(saved){
 let persisted;
 const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''},context={document:{getElementById:()=>host},window:{scrollY:0,scrollTo(){},frameElement:{caTrucStorage:{load:()=>saved,save:s=>persisted=JSON.parse(JSON.stringify(s))}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,context);const t=context.test;
 t.view=v=>{location.hash='#'+v;t.render();};t.do=(a,id)=>{t.act(a,id);t.render();};t.html=()=>host.innerHTML;t.saved=()=>persisted;return t;
}
let t=load();
assert.match(t.html(),/Xem nội dung Vy gửi/);assert.match(t.html(),/Nhắn lại Vy/);
assert.doesNotMatch(t.html(),/data-action="scene" data-id="studio"|data-action="scene" data-id="request"/);
for(const view of ['post','page','club','recruiter','transactions','receipt','tasks','task','recover','dossier']){
 t.view(view);assert.match(t.html(),/class="surface vy-main inbox"/);assert.equal((t.html().match(/class="source-pane"/g)||[]).length,1);
 assert.match(t.html(),/Về cuộc trò chuyện với Vy/);assert.equal(t.state.messages.length,0);assert.equal(t.total(),'500.000đ');
 assert.equal(t.state.dossier,false);assert.equal(t.state.reported,false);
}
t.view('receipt');t.do('send-evidence','receipt-0');assert.equal(t.state.messages.length,2);assert.equal(t.state.draft,null);assert.equal(t.state.verifiedShared,false);assert.equal(t.state.extraPaid,false);
t.do('send-evidence','receipt-0');assert.equal(t.state.messages.length,2);
t.view('club');t.do('ask','post');t.do('send-evidence','post-0');assert.equal(t.state.verifiedShared,false);assert.equal(t.state.messages.length,4);
t.view('club');t.do('ask','process');t.do('share-process');assert.equal(t.state.stopped,true);assert.equal(t.total(),'500.000đ');
t.do('review','receipt');t.do('draft','receipt-1');const draftCount=t.state.messages.length;
t=load(t.saved());assert.equal(t.state.draft.choice,1);t.do('discard-draft');assert.equal(t.state.messages.length,draftCount);
t.do('draft','receipt-1');t.do('send-draft');assert.match(t.state.messages.at(-1).text,/Studio đã nói/);assert.equal(t.state.extraPaid,false);
// A prior stop is acknowledged, not forgotten when an independent answer arrives later.
t=load();t.do('scene','stop');t.view('club');t.do('ask','process');t.do('share-process');assert.match(t.state.messages.at(-1).text,/vẫn không chuyển thêm/);
// Direct guidance send is explicit; opening alone neither sends nor contacts.
t=load();t.view('bankHelp');assert.equal(t.state.helpShared.length,0);assert.equal(t.state.messages.length,0);t.do('send-help','bankHelp');assert.equal(t.state.helpShared.length,1);const count=t.state.messages.length;t.do('send-help','bankHelp');assert.equal(t.state.messages.length,count);
// Risk retains its confirmation and can only add one payment.
t=load();t.do('risk');assert.equal(t.total(),'500.000đ');t.do('rethink');assert.equal(t.total(),'500.000đ');t.do('risk');t.do('proceed');t.do('proceed');assert.equal(t.total(),'1.500.000đ');
// Existing messages, draft and immutable dossier snapshots survive the new UI defaults.
const old={view:'club',messages:[{name:'Vy',text:'Lời cũ',reflection:true}],draft:{id:'receipt',choice:0},dossier:true,dossierSnapshot:{amount:'500.000đ',selected:['receipt45'],attachments:[],summary:'Bản cũ'},timeline:['Việc cũ']};
t=load(old);assert.deepEqual(JSON.parse(JSON.stringify(t.state.messages)),old.messages);assert.equal(t.state.draft.choice,0);assert.equal(t.state.dossierSnapshot.summary,'Bản cũ');
t.state.uiTrail=['post','page'];t.do('source-back');assert.equal(t.state.view,'page');t.do('close-source');assert.equal(t.state.view,'inbox');assert.equal(t.state.draft.choice,0);
assert.equal(load().state.messages.length,0);assert.equal(load().state.dossier,false);
console.log('PASS: one source pane, persistent Vy context, no open-triggered messages, direct/idempotent sends, revisions, independent verification, preserved stop, risk confirmation and payment-v1 defaults.');
