const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,sceneLines,sceneChoices,sceneFollowup,nextActions,total};\n  render();\n})();');
function load(saved){
 let persisted;const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''},ctx={document:{getElementById:()=>host},window:{scrollY:0,scrollTo(){},frameElement:{caTrucStorage:{load:()=>saved,save:s=>persisted=JSON.parse(JSON.stringify(s))}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,ctx);const t=ctx.test;t.view=v=>{location.hash='#'+v;t.render()};t.do=(a,id)=>{t.act(a,id);t.render()};t.saved=()=>persisted;return t;
}
function noUnchosenEffects(t){assert.equal(t.total(),'500.000đ');assert.equal(t.state.extraPaid,false);assert.equal(t.state.verifiedShared,false);assert.equal(t.state.receiptSaved,false);assert.equal(t.state.chatSaved,false);assert.equal(t.state.reported,false);assert.equal(t.state.helpSeen.length,0);assert.equal(t.state.helpShared.length,0);}
// One confirmed send produces a player turn and a specific reply, once only.
for(const kind of ['stop','studio','request']){
 const t=load();t.do('scene',kind);assert.equal(t.state.sceneSent.length,1);assert.equal(t.state.messages.length,2);assert.equal(t.state.messages[0].sent,true);assert.equal(t.state.messages[1].sceneKind,kind);
 assert.equal(t.state.messages[0].text,t.sceneLines[kind]);noUnchosenEffects(t);assert.equal(t.state.stopped,kind==='stop');assert.equal(t.state.paused,kind==='studio');assert.equal(t.state.asked.length,0);
 const before=JSON.stringify(t.state.messages);t.do('scene',kind);t.view('inbox');assert.equal(JSON.stringify(t.state.messages),before);
}
// Reading is distinct from requesting, asking, forwarding and saving.
let t=load();t.do('scene','request');assert.equal(t.state.seen.includes('recruiter'),false);t.view('recruiter');assert.equal(t.state.seen.includes('recruiter'),true);noUnchosenEffects(t);t.view('inbox');const count=t.state.messages.length;t.do('scene','request');assert.equal(t.state.messages.length,count);
t=load();t.view('recruiter');t.view('inbox');t.do('scene','request');assert.notEqual(t.state.messages[0].text,t.sceneLines.request);assert.equal(t.state.messages.length,2);noUnchosenEffects(t);
// Promise to ask does not ask; an existing answer is reused and never re-requested.
t=load();t.do('scene','studio');assert.equal(t.state.asked.length,0);t.view('club');t.do('ask','post');assert.equal(t.state.verifiedShared,false);t.do('ask','process');t.view('inbox');const answered=t.state.messages.length;t.do('scene','studio');assert.equal(t.state.messages.length,answered);assert.equal((t.nextActions().match(/href="#club"/g)||[]).length,1);
t.view('club');t.do('share-process');const verified=JSON.stringify(t.state.messages);t.view('inbox');for(const kind of ['stop','studio','request'])t.do('scene',kind);t.do('risk');t.do('proceed');assert.equal(JSON.stringify(t.state.messages),verified);assert.equal(t.state.stopped,true);assert.equal(t.total(),'500.000đ');assert.equal(t.sceneChoices(),'');
// Different order remains possible, without undoing Vy's stop or rewriting events.
t=load();t.do('scene','request');t.view('recruiter');t.view('inbox');t.do('scene','stop');t.do('scene','studio');assert.equal(t.state.stopped,true);t.view('club');t.do('ask','process');t.do('share-process');assert.deepEqual(Array.from(t.state.sceneSent),['request','stop','studio']);assert.equal(t.state.timeline[0].includes('Chưa mở'),true);assert.equal(t.state.verifiedShared,true);
// Risk remains a separate explicit decision; rethink adds no transaction.
t=load();t.do('scene','studio');t.do('risk');const pending=t.state.messages.length;t.do('scene','stop');assert.equal(t.state.messages.length,pending);t.do('rethink');assert.equal(t.state.extraPaid,false);t.do('risk');t.do('proceed');t.do('proceed');assert.equal(t.total(),'1.500.000đ');assert.equal(t.state.messages.filter(m=>m.text==='Tớ vừa chuyển thêm 1 triệu rồi.').length,1);const paid=t.state.messages.length;t.do('scene','studio');assert.equal(t.state.messages.length,paid);
// Old payment-v1 turns are not upgraded into invented new dialogue or choices.
const old={messages:[{name:'Vy',text:'old text'}],timeline:['old action'],paused:true};t=load(old);assert.equal(t.state.openingVersion,1);assert.equal(t.state.sceneSent.length,0);assert.equal(JSON.stringify(t.state.messages),JSON.stringify(old.messages));assert.deepEqual(Array.from(t.state.timeline),old.timeline);
t=load();t.do('scene','studio');const resumed=load(t.saved());assert.equal(resumed.state.openingVersion,2);assert.equal(resumed.state.messages.length,2);resumed.do('scene','studio');assert.equal(resumed.state.messages.length,2);assert.equal(load().state.sceneSent.length,0);
console.log('PASS: three separate scene effects, context-aware rereading, reuse of answers, ordered sends, risk confirmation and payment-v1 continuity.');

// Returning after forwarding a post-only opinion keeps access to the Studio conversation.
t=load();t.do('scene','studio');t.view('club');t.do('ask','post');t.do('draft','post-1');t.do('send-draft');t.view('inbox');assert.equal(t.state.verifiedShared,false);assert.equal(t.state.stopped,false);assert.ok(t.nextActions().includes('href="#club"'));
