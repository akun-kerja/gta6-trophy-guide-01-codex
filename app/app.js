const KEY='leonida-field-manual-v1';
const rows=document.querySelector('#rows'), kind=document.querySelector('#kind'), grade=document.querySelector('#grade'), spoiler=document.querySelector('#spoilers');
const doc=await (await fetch('data/trophies.json')).json();
let earned=new Set();
try { earned=new Set(JSON.parse(localStorage.getItem(KEY)||'[]')); } catch {}
function save(){localStorage.setItem(KEY,JSON.stringify([...earned]));}
function render(){
 rows.replaceChildren();
 const list=doc.trophies.filter(t=>(kind.value==='all'||(kind.value==='missable'?t.kind.includes('missable'):kind.value==='collectibles'?t.kind.includes('collectibles'):t.kind===kind.value))&&(grade.value==='all'||t.grade===grade.value));
 for(const t of list){
  const card=document.createElement('article'); card.className='trophy'+(earned.has(t.name)?' earned':'');
  const check=document.createElement('input'); check.type='checkbox'; check.checked=earned.has(t.name); check.setAttribute('aria-label',`Mark ${t.name} earned`);
  check.addEventListener('change',()=>{check.checked?earned.add(t.name):earned.delete(t.name);save();render();});
  const status=document.createElement('div');status.className='check';status.append(check);
  const main=document.createElement('div');main.className='detail';
  const hidden=t.kind==='story'&&!earned.has(t.name)&&!spoiler.checked;
  const title=document.createElement('h3');title.textContent=hidden?'Story trophy · spoiler hidden':t.name; main.append(title);
  const desc=document.createElement('p');desc.className='official';desc.textContent=hidden?'Earn this during the story, or mark it earned to reveal its details.':t.description;main.append(desc);
  const guide=document.createElement('p');guide.className='guide';
  const match=t.guide.match(/^(.*) Source: (.*?) — (https?:\/\/\S+)$/);
  guide.textContent=match?match[1]+' ':t.guide;
  if(match){const link=document.createElement('a');link.href=match[3];link.textContent=match[2]+' ↗';link.target='_blank';link.rel='noreferrer';guide.append(link);}
  main.append(guide);
  if(t.kind==='missable collectibles'){const badge=document.createElement('span');badge.className='warning';badge.textContent='MISSABLE · CHAPTER 1'; main.append(badge);}
  const medal=document.createElement('div');medal.className='medal '+t.grade;medal.innerHTML=`<span>${t.grade==='platinum'?'◆':t.grade==='gold'?'✦':t.grade==='silver'?'✧':'●'}</span>${t.grade}`;
  card.append(status,main,medal);rows.append(card);
 }
 const n=earned.size, total=doc.trophies.length;
 document.querySelector('#progress').textContent=`${n} / ${total} earned`;
 document.querySelector('#hero-progress').textContent=`${n} / ${total}`;
 document.querySelector('#meter').style.width=`${n/total*100}%`;
}
kind.addEventListener('change',render);grade.addEventListener('change',render);spoiler.addEventListener('change',render);
document.querySelector('#export').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({format:1,earned:[...earned]})],{type:'application/json'}));a.download='leonida-progress.json';a.click();URL.revokeObjectURL(a.href);});
document.querySelector('#import').addEventListener('change',async e=>{try{const data=JSON.parse(await e.target.files[0].text());const names=Array.isArray(data)?data:data.earned;if(!Array.isArray(names))throw Error();earned=new Set(names.filter(n=>doc.trophies.some(t=>t.name===n)));save();render();}catch{alert('That progress file could not be read. Choose a Leonida progress export.');}e.target.value='';});
render();
