const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('ca-truc/ban-thu/app.js','utf8').replace('  render();\n})();','  globalThis.test={act,render,state,evidence,currentOpinion,summary,inbox};\n  render();\n})();');
function load(saved){
 const host={innerHTML:'',addEventListener(){},querySelector(){return null;}};
 const location={hash:''};
 const context={document:{getElementById:()=>host},window:{frameElement:{caTrucStorage:{load:()=>saved,save(){}}}},location,history:{replaceState(a,b,hash){location.hash=hash}},addEventListener(){}};
 vm.runInNewContext(source,context);
 const t=context.test;
 t.view=v=>{location.hash='#'+v;t.render()};
 t.do=(a,id)=>{t.act(a,id);t.render()};
 return t;
}
// Drafts do not change history. Revisions preserve both messages and collapse again.
for(const id of ['receipt','post','compare']){
 let t=load();t.state.asked=['post'];t.state.selected=id==='compare'?['0','1']:[];
 t.do('draft',id+'-0');assert.equal(t.state.messages.length,0);
 t.do('send-draft');assert.equal(t.currentOpinion(id),0);assert.equal(t.state.review,null);
 assert.doesNotMatch(t.inbox(),/Đang chọn 2\/2/); // compare selection removed below for receipt/post
 t.do('review',id);t.do('draft',id+'-1');
 const before=t.state.messages.length;t.do('discard-draft');assert.equal(t.state.messages.length,before);
 t.do('draft',id+'-1');
 t=load(JSON.parse(JSON.stringify(t.state)));assert.equal(t.state.draft.choice,1);
 t.do('send-draft');assert.equal(t.currentOpinion(id),1);assert.match(t.state.messages.at(-2).text,/Tớ xem lại rồi/);
 t.do('review',id);t.do('draft',id+'-1');assert.equal(t.state.draft,null);
 t.do('draft',id+'-0');t.do('close-review',id);assert.equal(t.state.draft,null);assert.equal(t.currentOpinion(id),1);
 t.do('review',id);t.do('draft',id+'-0');t.do('send-draft');assert.equal(t.currentOpinion(id),0);
 t.do('send-draft');assert.equal(t.state.messages.length,before+4);
}
// An unrelated draft appears once when a comparison has only one selected excerpt.
{const t=load();t.state.selected=['0'];t.do('draft','receipt-0');assert.equal((t.inbox().match(/class="draft-box"/g)||[]).length,1);}
// Verification before weak evidence must remain before it in the ordered summary.
let t=load();t.view('club');t.do('ask','process');t.do('share-process');t.do('draft','receipt-0');t.do('send-draft');
assert.equal(t.state.extraPaid,false);assert.match(t.state.messages.at(-1).text,/Studio đã nói/);
let html=t.summary();assert.ok(html.indexOf('Đã chuyển phản hồi')<html.indexOf('Đã gửi biên lai'));
assert.doesNotMatch(html,/Ban đầu|Sau đó/);
// Reflection is retrospective, one-time, and is not logged as a player's action.
t.view('task');t.view('inbox');t.view('task');assert.equal(t.state.messages.filter(m=>m.reflection).length,1);
t=load(JSON.parse(JSON.stringify(t.state)));t.view('task');assert.equal(t.state.messages.filter(m=>m.reflection).length,1);
// Both old choices are interpreted in message order. Unknown order remains neutral.
const item=t.evidence.receipt;
t=load({view:'inbox',sent:['receipt-0','receipt-1'],messages:[{sent:true,text:item.options[1],attachment:item},{sent:true,text:item.options[0],attachment:item}],paused:true,finished:true});
assert.equal(t.currentOpinion('receipt'),0);assert.match(t.summary(),/không xác định đầy đủ thứ tự/);
assert.equal(t.state.messages.length,2);
t=load({sent:['receipt-0','receipt-1'],messages:[],paused:true,finished:true});assert.equal(t.currentOpinion('receipt'),null);
// Money and each support action remain idempotent and independently logged.
t=load();t.do('risk');t.do('proceed');t.do('proceed');assert.equal(t.state.messages.filter(m=>m.text==='Tớ vừa chuyển thêm 1 triệu rồi.').length,1);
t.view('recover');t.do('stop');t.view('recover');t.do('keep','receiptSaved');t.do('keep','receiptSaved');
assert.match(t.summary(),/Còn thiếu tin nhắn/);assert.equal(t.state.timeline.filter(x=>x==='Đã lưu chứng từ chuyển tiền.').length,1);
t.do('keep','chatSaved');t.do('dossier');assert.equal(t.state.reported,false);assert.equal(t.state.dossier,true);
assert.match(t.summary(),/1.500.000đ/);assert.match(t.summary(),/chưa được thu hồi/);
console.log('PASS: three evidence groups, draft/cancel/revise/reload, historical ordering, legacy saves, reflection, verified decision, transfer/support idempotency.');
