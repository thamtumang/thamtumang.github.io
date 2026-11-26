const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,total,nextActions};\n  render();\n})();');
function load(saved){
 let persisted;
 const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''},context={document:{getElementById:()=>host},window:{scrollY:0,scrollTo(){},frameElement:{caTrucStorage:{load:()=>saved,save:s=>persisted=JSON.parse(JSON.stringify(s))}}},location,history:{replaceState(a,b,h){location.hash=h}},addEventListener(){}};
 vm.runInNewContext(source,context);const t=context.test;
 t.view=v=>{location.hash='#'+v;t.render();};t.do=(a,id)=>{t.act(a,id);t.render();};t.html=()=>host.innerHTML;t.saved=()=>persisted;return t;
}
// New turns expose a decision before sources, without a reply-menu disclosure.
let t=load();
const initial=t.html();
assert.equal(t.state.openingVersion,4);
assert.match(initial,/Bạn là bạn của Vy/);
assert.match(initial,/Lần trước chị ấy trả tớ 45k thật/);
assert.ok(initial.indexOf('class="reply-options"')<initial.indexOf('class="shared-content"'));
assert.match(initial,/<details class="shared-content"[^>]* open>/);
assert.doesNotMatch(initial,/reply-menu|data-action="select-excerpt"/);
assert.equal((initial.match(/data-action="scene" data-id="stop"/g)||[]).length,1);
t.do('pause');assert.equal(t.state.paused,true);assert.equal(t.state.disclosures.shared,true);assert.equal(t.state.messages.length,2);assert.equal(t.total(),'500.000đ');
// Comparing is optional at each relevant source; opening sources has no side effect.
for(const view of ['post','task']){
 t.view(view);const html=t.html();
 assert.match(html,/<details class="optional-tools" data-disclosure="compare-[01]" ><summary>Xem thêm/);
 assert.equal(t.state.messages.length,2);assert.equal(t.state.selected.length,0);
}
// Weak/limited interpretations differ, and independent process verification changes a decision.
t=load();t.view('receipt');t.do('send-evidence','receipt-0');
assert.match(t.state.messages.at(-1).text,/500k lần này vẫn chưa về/);assert.equal(t.state.stopped,false);assert.equal(t.state.draft,null);
t.view('club');t.do('ask','post');t.do('send-evidence','post-0');
assert.match(t.state.messages.at(-1).text,/Họ xác nhận bài đăng thôi/);assert.equal(t.state.verifiedShared,false);
t.view('club');t.do('ask','process');t.do('share-process');
assert.match(t.state.messages.at(-1).text,/Vậy tớ không chuyển thêm nữa/);assert.equal(t.state.stopped,true);assert.equal(t.total(),'500.000đ');
t.do('review','receipt');t.do('draft','receipt-1');t.do('send-draft');assert.match(t.state.messages.at(-1).text,/Studio đã nói/);assert.equal(t.state.stopped,true);
// A prior stop is remembered. A confirmed additional transfer is never described as 500k only.
t=load();t.do('scene','stop');t.view('club');t.do('ask','process');t.do('share-process');assert.match(t.state.messages.at(-1).text,/vẫn không chuyển thêm/);
t=load();t.do('risk');t.do('proceed');t.view('club');t.do('ask','process');t.do('share-process');assert.match(t.state.messages.at(-1).text,/1,5 triệu/);assert.equal(t.total(),'1.500.000đ');
// Existing wording, draft and saved snapshots are preserved rather than silently upgraded.
const old={openingVersion:3,messages:[{name:'Vy',text:'Lời cũ'}],draft:{id:'receipt',choice:1},dossier:true,dossierSnapshot:{amount:'500.000đ',selected:['receipt45'],attachments:[],summary:'Bản cũ'}};
t=load(old);assert.equal(t.state.openingVersion,3);assert.deepEqual(JSON.parse(JSON.stringify(t.state.messages)),old.messages);assert.deepEqual(JSON.parse(JSON.stringify(t.state.draft)),old.draft);assert.equal(t.state.dossierSnapshot.summary,'Bản cũ');
console.log('PASS: visible initial decision, open initial sources, optional comparison, distinct evidence limits, verified stop, exact paid total and legacy continuity.');
