const assert=require('node:assert/strict');
const G=require('../ca-truc/game.js');
const apply=(s,a,p)=>G.step(s,a,p);
function learn(s,a,b,relation){
 for(const id of [a,b]){
  s=apply(s,id==='school'?'inspect':'ask',{id});
  s=apply(s,'note',{id});
 }
 return apply(s,'pair',{a,b,relation});
}
function plan(s,ids){for(const id of ids)s=apply(s,'planToggle',{id});return apply(s,'finish');}
// Claiming fraud without any supporting comparison cannot close a case.
let s=G.fresh('vy');
s=apply(s,'advice',{choice:'stop'});assert.equal(s.phase,'play');assert.equal(s.tab,'notebook');
assert.equal(apply(s,'finish').phase,'play');
// Full prevention route includes an independent source and a defensible comparison.
s=G.fresh('vy');s=apply(s,'pause');s=learn(s,'ad','task','conflict');
s=apply(s,'ask',{id:'claim'});s=apply(s,'note',{id:'claim'});s=apply(s,'inspect',{id:'school'});
s=apply(s,'advice',{choice:'stop'});assert.equal(s.phase,'plan');
s=plan(s,['halt','proof','adult','report']);assert.equal(s.phase,'review');assert.equal(G.score(s).total,100);
const finished=JSON.stringify(s);assert.equal(JSON.stringify(apply(s,'advice',{choice:'proceed'})),finished);
// A real small payment is not sufficient proof to proceed. Recovery remains playable.
s=G.fresh('vy');s=apply(s,'ask',{id:'receipt'});s=apply(s,'advice',{choice:'proceed'});
assert.equal(s.transferred,true);assert.equal(s.phase,'plan');assert.ok(s.messages.some(m=>m.text?.includes('2 triệu')));
s=apply(s,'planToggle',{id:'fee'});s=apply(s,'planToggle',{id:'proof'});s=apply(s,'finish');
assert.equal(s.phase,'plan');assert.match(s.notice,/rủi ro/);
s=apply(s,'planToggle',{id:'fee'});s=apply(s,'planToggle',{id:'bank'});s=apply(s,'finish');
assert.equal(s.phase,'plan');assert.match(s.notice,/dừng chuyển/);
s=apply(s,'planToggle',{id:'halt'});s=apply(s,'finish');assert.equal(s.phase,'review');assert.ok(G.score(s).total<100);
// Legitimate case requires independent confirmation, even if ad and task agree.
s=G.fresh('event');s=learn(s,'ad','task','confirm');s=apply(s,'advice',{choice:'proceed'});assert.equal(s.phase,'play');
s=apply(s,'inspect',{id:'profile'});assert.equal(s.checks.length,0);
s=apply(s,'inspect',{id:'school'});s=apply(s,'note',{id:'school'});s=apply(s,'advice',{choice:'proceed'});
assert.equal(s.phase,'plan');s=plan(s,['channel','terms','privacy']);assert.equal(s.phase,'review');assert.equal(G.score(s).total,100);
// Pairing, repeated actions and a JSON reload cannot manufacture evidence or points.
s=G.fresh('vy');const before=JSON.stringify(s);assert.equal(G.compare(s,'ad','task','conflict'),false);
s=apply(s,'pair',{a:'ad',b:'task',relation:'conflict'});assert.equal(s.pairs.length,0);
s=learn(s,'ad','task','conflict');const score=G.score(s).total;
s=apply(s,'pair',{a:'task',b:'ad',relation:'conflict'});assert.equal(s.pairs.length,1);assert.equal(G.score(s).total,score);
s=apply(s,'ask',{id:'task'});const messages=s.messages.length;s=apply(s,'ask',{id:'task'});assert.equal(s.messages.length,messages);
const resumed=JSON.parse(JSON.stringify(s));assert.equal(G.compare(resumed,'ad','task','conflict'),true);
assert.equal(JSON.stringify(G.fresh('vy')),before);
// Two similar messages are a lead, not proof of common ownership.
s.phase='review';s=apply(s,'ack',{relation:'same'});assert.equal(s.ack,false);s=apply(s,'ack',{relation:'lead'});assert.equal(s.ack,true);
console.log('PASS: prevention, recovery, legitimate offer, evidence gating, independent verification, scoring, immutable completion, replay-safe serialization, and qualified lead.');

// An efficient two-source solution can earn full recognition without collecting every clue.
s=G.fresh('event');s=learn(s,'ad','school','confirm');s=apply(s,'advice',{choice:'proceed'});s=plan(s,['channel','terms','privacy']);assert.equal(G.score(s).total,100);
// Waiting once does not erase a later unsafe transfer recommendation.
s=G.fresh('vy');s=apply(s,'advice',{choice:'wait'});s=learn(s,'ad','task','conflict');s=apply(s,'inspect',{id:'school'});s=apply(s,'advice',{choice:'proceed'});s=plan(s,['halt','bank','proof','adult']);assert.equal(G.score(s).total,90);
console.log('PASS: efficient evidence selection and consequences remain reflected in scoring.');
