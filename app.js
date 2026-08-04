
(() => {
'use strict';
const $=id=>document.getElementById(id), uid=()=> 'id-'+Math.random().toString(36).slice(2,10), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const canvas=$('rigCanvas'),ctx=canvas.getContext('2d'),viewport=$('viewport');
const layers=[{id:'background',name:'Background',visible:true,locked:true},{id:'rigging',name:'Rigging',visible:true,locked:false},{id:'performers',name:'Performers',visible:true,locked:false},{id:'equipment',name:'Equipment',visible:true,locked:false},{id:'annotations',name:'Annotations',visible:true,locked:false},{id:'measurements',name:'Measurements',visible:true,locked:false}];

const assetCategories=[
{title:'Pulleys',key:'pulleys',items:[
{name:'Ronstan Front',type:'pulley',src:'assets/pulleys/Ronstan Front.png',w:120,h:150,points:[['Main attachment',.50,.11],['Rope / lower',.50,.90]]},
{name:'Double Rock Front',type:'pulley',src:'assets/pulleys/Double Rock Front.png',w:105,h:170,points:[['Main attachment',.50,.11],['Rope / lower',.50,.90]]},
{name:'Ronstan Pulley',type:'pulley',src:'assets/pulleys/Ronstan Pulley.png',w:70,h:190,points:[['Main attachment',.50,.08],['Rope / lower',.50,.90]]},
{name:'Double Rock Profile',type:'pulley',src:'assets/pulleys/Double Rock Profile.png',w:70,h:190,points:[['Main attachment',.50,.08],['Rope / lower',.50,.90]]},
{name:'Rock Profile',type:'pulley',src:'assets/pulleys/Rock Profile.png',w:65,h:185,points:[['Main attachment',.50,.08],['Rope / lower',.50,.90]]},
{name:'Rock Front',type:'pulley',src:'assets/pulleys/Rock Front.png',w:105,h:160,points:[['Main attachment',.50,.10],['Rope / lower',.50,.90]]}
]},
{title:'Rigging Hardware',key:'rigging-hardware',items:[
{name:'Carabiner Profile',type:'hardware',src:'assets/rigging-hardware/Carabiner Profile.png',w:70,h:150,points:[['End A',.50,.10],['End B',.50,.90]]},
{name:'Load Cell Front',type:'hardware',src:'assets/rigging-hardware/Load Cell Front.png',w:210,h:85,points:[['End A',.08,.50],['End B',.92,.50]]},
{name:'Clutch Profile',type:'hardware',src:'assets/rigging-hardware/Clutch Profile.png',w:185,h:95,points:[['End A',.08,.50],['End B',.92,.50]]},
{name:'Bow Shackle Profile',type:'hardware',src:'assets/rigging-hardware/Bow Shackle Profile.png',w:90,h:145,points:[['Bow',.50,.14],['Pin',.50,.86]]},
{name:'Doughty Lifting Eye Front',type:'hardware',src:'assets/rigging-hardware/Doughty Lifting Eye Front.png',w:120,h:155,points:[['Eye',.50,.10],['Clamp',.50,.88]]},
{name:'Clutch Top',type:'hardware',src:'assets/rigging-hardware/Clutch Top.png',w:210,h:65,points:[['End A',.07,.50],['End B',.93,.50]]},
{name:'Carabiner Front',type:'hardware',src:'assets/rigging-hardware/Carabiner Front.png',w:90,h:150,points:[['End A',.50,.10],['End B',.50,.90]]},
{name:'Goldtail Top',type:'hardware',src:'assets/rigging-hardware/Goldtail Top.png',w:230,h:55,points:[['End A',.06,.50],['End B',.94,.50]]},
{name:'Bow Shackle Front',type:'hardware',src:'assets/rigging-hardware/Bow Shackle Front.png',w:120,h:120,points:[['Bow',.50,.12],['Pin',.50,.88]]},
{name:'Goldtail Profile',type:'hardware',src:'assets/rigging-hardware/Goldtail Profile.png',w:230,h:70,points:[['End A',.06,.50],['End B',.94,.50]]},
{name:'Doughty Lifting Eye Profile',type:'hardware',src:'assets/rigging-hardware/Doughty Lifting Eye Profile.png',w:95,h:155,points:[['Eye',.50,.10],['Clamp',.50,.88]]},
{name:'Load Cell Top',type:'hardware',src:'assets/rigging-hardware/Load Cell Top.png',w:210,h:75,points:[['End A',.08,.50],['End B',.92,.50]]},
{name:'Doughty Lifting Eye Top',type:'hardware',src:'assets/rigging-hardware/Doughty Lifting Eye Top.png',w:95,h:145,points:[['Eye',.50,.10],['Clamp',.50,.88]]}
]},
{title:'Truss / Scaffold',key:'truss-scaffold',items:[
{name:'Goal Post Profile',type:'truss',src:'assets/truss-scaffold/Goal Post Profile.png',w:240,h:300,points:[['Top left',.23,.10],['Top centre',.50,.10],['Top right',.77,.10],['Base left',.23,.91],['Base right',.77,.91]]},
{name:'Goal Post Front',type:'truss',src:'assets/truss-scaffold/Goal Post Front.png',w:330,h:220,points:[['Top left',.10,.13],['Top centre',.50,.13],['Top right',.90,.13],['Base left',.10,.90],['Base right',.90,.90]]},
{name:'Truss Box Front Profile',type:'truss',src:'assets/truss-scaffold/Truss Box Front Profile.png',w:300,h:265,points:[['Top left',.17,.12],['Top centre',.50,.12],['Top right',.83,.12],['Bottom left',.17,.88],['Bottom right',.83,.88]]},
{name:'Truss Front',type:'truss',src:'assets/truss-scaffold/Truss Front.png',w:330,h:75,points:[['End A',.03,.50],['Centre',.50,.50],['End B',.97,.50]]},
{name:'Truss Box Top',type:'truss',src:'assets/truss-scaffold/Truss Box Top.png',w:280,h:280,points:[['Corner 1',.12,.12],['Corner 2',.88,.12],['Corner 3',.88,.88],['Corner 4',.12,.88]]},
{name:'Truss Top',type:'truss',src:'assets/truss-scaffold/Truss Top.png',w:100,h:100,points:[['Corner 1',.12,.12],['Corner 2',.88,.12],['Corner 3',.88,.88],['Corner 4',.12,.88]]}
]},
{title:'Machines',key:'machines',items:[
{name:'Telehandler Profile',type:'machine',src:'assets/machines/Telehandler Profile.png',w:420,h:280,points:[['Fork tip',.06,.30],['Carriage',.18,.29],['Boom head',.20,.24],['Boom pivot',.68,.51],['Front chassis',.62,.82],['Rear chassis',.90,.78]]},
{name:'Crane Front',type:'machine',src:'assets/machines/Crane Front.png',w:180,h:420,points:[['Hook / boom tip',.50,.04],['Boom pivot',.50,.78],['Left outrigger',.33,.95],['Right outrigger',.67,.95]]},
{name:'Crane Rear',type:'machine',src:'assets/machines/Crane Rear.png',w:210,h:420,points:[['Hook / boom tip',.50,.04],['Boom pivot',.52,.77],['Left outrigger',.31,.95],['Right outrigger',.69,.95]]},
{name:'Telehandler Front',type:'machine',src:'assets/machines/Telehandler Front.png',w:230,h:250,points:[['Fork left',.34,.08],['Fork right',.66,.08],['Carriage centre',.50,.16],['Left outrigger',.27,.91],['Right outrigger',.73,.91]]},
{name:'Telehandler Top',type:'machine',src:'assets/machines/Telehandler Top.png',w:270,h:230,points:[['Fork left',.15,.74],['Fork right',.23,.79],['Boom head',.25,.64],['Boom pivot',.63,.43],['Rear chassis',.82,.22]]},
{name:'Crane Profile',type:'machine',src:'assets/machines/Crane Profile.png',w:420,h:270,points:[['Hook / boom tip',.05,.08],['Boom pivot',.72,.77],['Front outrigger',.65,.92],['Rear outrigger',.93,.91]]},
{name:'Crane Top',type:'machine',src:'assets/machines/Crane Top.png',w:430,h:130,points:[['Hook / boom tip',.03,.35],['Boom pivot',.72,.48],['Rear chassis',.94,.55]]}
]},
{title:'Performers',key:'performers',items:[
{name:'Male Rear',type:'performer',src:'assets/performers/Male Rear.png',w:105,h:280,points:[['Dorsal',.50,.29],['Left shoulder',.36,.24],['Right shoulder',.64,.24],['Left hip',.42,.52],['Right hip',.58,.52],['Feet',.50,.94]]},
{name:'Test Bag',type:'performer',src:'assets/performers/Test Bag.png',w:90,h:250,points:[['Top attachment',.50,.05],['Bottom attachment',.50,.95]]},
{name:'Female Rear',type:'performer',src:'assets/performers/Female Rear.png',w:100,h:280,points:[['Dorsal',.50,.29],['Left shoulder',.36,.24],['Right shoulder',.64,.24],['Left hip',.42,.52],['Right hip',.58,.52],['Feet',.50,.94]]},
{name:'Male Profile',type:'performer',src:'assets/performers/Male Profile.png',w:90,h:280,points:[['Dorsal',.46,.29],['Chest',.56,.31],['Hip',.50,.52],['Feet',.50,.94]]},
{name:'Female Front',type:'performer',src:'assets/performers/Female Front.png',w:100,h:280,points:[['Chest',.50,.29],['Left shoulder',.36,.24],['Right shoulder',.64,.24],['Left hip',.42,.52],['Right hip',.58,.52],['Feet',.50,.94]]},
{name:'Male Front',type:'performer',src:'assets/performers/Male Front.png',w:105,h:280,points:[['Chest',.50,.29],['Left shoulder',.36,.24],['Right shoulder',.64,.24],['Left hip',.42,.52],['Right hip',.58,.52],['Feet',.50,.94]]},
{name:'Female Profile',type:'performer',src:'assets/performers/Female Profile.png',w:90,h:280,points:[['Dorsal',.46,.29],['Chest',.56,.31],['Hip',.50,.52],['Feet',.50,.94]]}
]}
];
const assets=assetCategories.flatMap(c=>c.items.map(i=>({...i,categoryKey:c.key,categoryTitle:c.title})));

const state={projectId:uid(),projectName:'Untitled Project',objects:[],lines:[],background:null,backgroundOpacity:.8,layers:JSON.parse(JSON.stringify(layers)),selectedId:null,tool:'select',perspective:false,zoom:1,history:[],future:[],drawings:[],calendar:[],month:new Date().getMonth(),year:new Date().getFullYear(),harnessNotes:'',sequences:[],currentSequenceId:null,currentRigId:null,harnessItems:[],harnessSelectedId:null,showObjectLabels:false,analysis:null,analysisVisible:false,additionalLineTensionKg:0,haulEnd:null,markHaulEndMode:false};
let bgImage=null,drag=null,drawing=null,imageCache=new Map();

function snapshot(){return JSON.stringify({projectId:state.projectId,projectName:state.projectName,objects:state.objects,lines:state.lines,background:state.background,backgroundOpacity:state.backgroundOpacity,layers:state.layers,drawings:state.drawings,calendar:state.calendar,harnessNotes:state.harnessNotes,sequences:state.sequences,currentSequenceId:state.currentSequenceId,currentRigId:state.currentRigId,harnessItems:state.harnessItems,showObjectLabels:state.showObjectLabels,additionalLineTensionKg:state.additionalLineTensionKg,haulEnd:state.haulEnd})}
function pushHistory(){state.history.push(snapshot());if(state.history.length>70)state.history.shift();state.future=[];$('saveStatus').textContent='Unsaved';clearTimeout(pushHistory.t);pushHistory.t=setTimeout(saveProject,700)}
function restore(raw){Object.assign(state,JSON.parse(raw));state.selectedId=null;if($('objectLabelsToggle'))$('objectLabelsToggle').checked=!!state.showObjectLabels;loadBackground();renderAll()}
function projectMap(){try{return JSON.parse(localStorage.getItem('simplerig-pro-projects')||'{}')}catch{return{}}}
function saveProject(){state.projectName=$('projectName').value.trim()||'Untitled Project';state.harnessNotes=$('harnessNotes').value;const ps=projectMap();ps[state.projectId]={id:state.projectId,name:state.projectName,updated:new Date().toISOString(),data:snapshot()};localStorage.setItem('simplerig-pro-projects',JSON.stringify(ps));localStorage.setItem('simplerig-pro-current',state.projectId);$('saveStatus').textContent='Saved locally';renderProjects()}
function loadProject(id){const p=projectMap()[id];if(!p)return;Object.assign(state,JSON.parse(p.data));$('projectName').value=state.projectName;$('harnessNotes').value=state.harnessNotes||'';state.selectedId=null;state.history=[];state.future=[];$('objectLabelsToggle').checked=!!state.showObjectLabels;loadBackground();renderAll();switchView('workspace')}
function newProject(){if(!confirm('Create a new project?'))return;Object.assign(state,{projectId:uid(),projectName:'Untitled Project',objects:[],lines:[],background:null,backgroundOpacity:.8,layers:JSON.parse(JSON.stringify(layers)),selectedId:null,history:[],future:[],drawings:[],calendar:[],harnessNotes:'',sequences:[],currentSequenceId:null,currentRigId:null,harnessItems:[],harnessSelectedId:null,showObjectLabels:false,additionalLineTensionKg:0,haulEnd:null,markHaulEndMode:false});$('projectName').value=state.projectName;$('harnessNotes').value='';loadBackground();renderAll();saveProject()}
function exportProject(){saveProject();download(new Blob([snapshot()],{type:'application/json'}),(state.projectName||'SimpleRig')+'.simplerig.json')}
function importProject(file){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);d.projectId=uid();d.projectName=(d.projectName||'Imported')+' Imported';Object.assign(state,d);$('projectName').value=state.projectName;$('harnessNotes').value=state.harnessNotes||'';loadBackground();renderAll();saveProject()}catch{alert('Invalid SimpleRig project file.')}};r.readAsText(file)}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function img(src,cors=false){if(imageCache.has(src))return imageCache.get(src);const i=new Image();if(cors)i.crossOrigin='anonymous';i.onload=draw;i.src=src;imageCache.set(src,i);return i}
function loadBackground(){bgImage=null;if(!state.background){draw();return}bgImage=new Image();bgImage.onload=draw;bgImage.src=state.background}
function makeQuad(x,y,w,h){return[{x:x-w/2,y:y-h/2},{x:x+w/2,y:y-h/2},{x:x+w/2,y:y+h/2},{x:x-w/2,y:y+h/2}]}
function centroid(q){return{x:q.reduce((s,p)=>s+p.x,0)/4,y:q.reduce((s,p)=>s+p.y,0)/4}}
function bbox(q){const xs=q.map(p=>p.x),ys=q.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
function rotateQuad(q,a,c=centroid(q)){a*=Math.PI/180;const ca=Math.cos(a),sa=Math.sin(a);return q.map(p=>({x:c.x+(p.x-c.x)*ca-(p.y-c.y)*sa,y:c.y+(p.x-c.x)*sa+(p.y-c.y)*ca}))}
function bilerp(q,u,v){return{x:(1-u)*(1-v)*q[0].x+u*(1-v)*q[1].x+u*v*q[2].x+(1-u)*v*q[3].x,y:(1-u)*(1-v)*q[0].y+u*(1-v)*q[1].y+u*v*q[2].y+(1-u)*v*q[3].y}}
function worldPoint(o,p){const u=o.flipH?1-p.u:p.u,v=o.flipV?1-p.v:p.v;return bilerp(o.quad,u,v)}
function pointInPoly(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const xi=p[i].x,yi=p[i].y,xj=p[j].x,yj=p[j].y;if(((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside}return inside}
function distanceSegment(p,a,b){const A=p.x-a.x,B=p.y-a.y,C=b.x-a.x,D=b.y-a.y,t=clamp((A*C+B*D)/(C*C+D*D||1),0,1);return Math.hypot(p.x-(a.x+t*C),p.y-(a.y+t*D))}
function cpoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/state.zoom,y:(e.clientY-r.top)/state.zoom}}
function layerVisible(id){return state.layers.find(l=>l.id===id)?.visible!==false}
function layerLocked(id){return state.layers.find(l=>l.id===id)?.locked===true}
function selected(){return state.objects.find(o=>o.id===state.selectedId)||state.lines.find(l=>l.id===state.selectedId)}
function endpoint(line,key){const a=line[key];if(a?.objectId){const o=state.objects.find(x=>x.id===a.objectId),cp=o?.points?.find(x=>x.id===a.pointId);if(o&&cp)return worldPoint(o,cp)}return{x:a?.x||0,y:a?.y||0}}
function nearestConnection(p,max=20,exclude=null){let best=null;for(const o of state.objects){if(o.id===exclude)continue;for(const cp of o.points||[]){const w=worldPoint(o,cp),d=Math.hypot(p.x-w.x,p.y-w.y);if(d<max&&(!best||d<best.d))best={objectId:o.id,pointId:cp.id,x:w.x,y:w.y,d}}}return best}

function isAttachableHardware(o){return o&&o.type==='hardware'&&(/carabiner|shackle/i.test(o.name))}
function syncAttachedObject(o,seen=new Set()){
  if(!o?.attachedTo||seen.has(o.id))return;
  seen.add(o.id);
  const target=state.objects.find(x=>x.id===o.attachedTo.objectId);
  const targetPoint=target?.points?.find(x=>x.id===o.attachedTo.pointId);
  if(!target||!targetPoint){o.attachedTo=null;return}
  syncAttachedObject(target,seen);
  const dest=worldPoint(target,targetPoint);
  const own=o.points?.find(x=>x.id===o.attachedTo.ownPointId)||o.points?.[0];
  if(!own)return;
  const now=worldPoint(o,own),dx=dest.x-now.x,dy=dest.y-now.y;
  o.quad=o.quad.map(p=>({x:p.x+dx,y:p.y+dy}));
}
function attachHardwareIfNear(o){
  if(!isAttachableHardware(o))return;
  let best=null;
  for(const own of o.points||[]){
    const ownWorld=worldPoint(o,own);
    const candidate=nearestConnection(ownWorld,24,o.id);
    if(candidate&&(!best||candidate.d<best.d))best={...candidate,ownPointId:own.id};
  }
  if(best){o.attachedTo={objectId:best.objectId,pointId:best.pointId,ownPointId:best.ownPointId};syncAttachedObject(o)}
}
function addAsset(a,x,y){
pushHistory();
const points=(a.points||[]).map(([name,u,v])=>({id:uid(),name,u,v}));
const defaultW=a.w||180, defaultH=(a.h||120)*.5;
const layer=a.categoryKey||(
  a.type==='pulley'?'pulleys':
  a.type==='hardware'?'rigging-hardware':
  a.type==='truss'?'truss-scaffold':
  a.type==='machine'?'machines':
  a.type==='performer'?'performers':'rigging-hardware'
);
const o={id:uid(),type:a.type||'image',categoryKey:a.categoryKey||layer,name:a.name||'Asset',
src:a.src,w:defaultW,h:defaultH,quad:makeQuad(x,y,defaultW,defaultH),rotation:0,opacity:1,
flipH:false,flipV:false,color:'#111827',notes:'',layer,points,remote:!!a.remote,
source:a.source||'',licence:a.licence||'',attachedTo:null};
state.objects.push(o);state.selectedId=o.id;renderAll();
}
function renderAssets(filter=''){
const el=$('assetLibrary');el.innerHTML='';
const q=filter.toLowerCase().trim();
for(const category of assetCategories){
  const matching=category.items.filter(a=>a.name.toLowerCase().includes(q));
  if(q&&!matching.length)continue;
  const details=document.createElement('details');
  details.className='asset-category';
  details.open=!q || matching.length>0;
  const summary=document.createElement('summary');
  summary.textContent=category.title;
  const grid=document.createElement('div');
  grid.className='asset-category-grid';
  for(const sourceAsset of matching){ const a={...sourceAsset,categoryKey:category.key,categoryTitle:category.title};
    const d=document.createElement('div');
    d.className='asset-item';d.draggable=true;d.dataset.asset=JSON.stringify(a);
    d.innerHTML=`<img src="${a.src}" alt=""><span>${a.name}</span>`;
    d.addEventListener('dragstart',e=>e.dataTransfer.setData('application/x-simplerig',d.dataset.asset));
    d.addEventListener('click',()=>addAsset(a,canvas.width/2,canvas.height/2));
    grid.appendChild(d);
  }
  details.append(summary,grid);el.appendChild(details);
}}
function drawGrid(){if(!$('gridToggle').checked)return;ctx.save();ctx.strokeStyle='#e5e7eb';for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}ctx.restore()}
function drawTriangle(im,s0,s1,s2,d0,d1,d2){const den=s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y);if(Math.abs(den)<1e-6)return;const a=(d0.x*(s1.y-s2.y)+d1.x*(s2.y-s0.y)+d2.x*(s0.y-s1.y))/den,c=(d0.x*(s2.x-s1.x)+d1.x*(s0.x-s2.x)+d2.x*(s1.x-s0.x))/den,e=(d0.x*(s1.x*s2.y-s2.x*s1.y)+d1.x*(s2.x*s0.y-s0.x*s2.y)+d2.x*(s0.x*s1.y-s1.x*s0.y))/den,b=(d0.y*(s1.y-s2.y)+d1.y*(s2.y-s0.y)+d2.y*(s0.y-s1.y))/den,d=(d0.y*(s2.x-s1.x)+d1.y*(s0.x-s2.x)+d2.y*(s1.x-s0.x))/den,f=(d0.y*(s1.x*s2.y-s2.x*s1.y)+d1.y*(s2.x*s0.y-s0.x*s2.y)+d2.y*(s0.x*s1.y-s1.x*s0.y))/den;ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,e,f);ctx.drawImage(im,0,0);ctx.restore()}
function drawWarp(im,q,fh,fv){if(!im.complete||!im.naturalWidth)return;const n=8,sw=im.naturalWidth,sh=im.naturalHeight;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const uu=[x/n,(x+1)/n],vv=[y/n,(y+1)/n],u0=(fh?1-uu[0]:uu[0]),u1=(fh?1-uu[1]:uu[1]),v0=(fv?1-vv[0]:vv[0]),v1=(fv?1-vv[1]:vv[1]);const d00=bilerp(q,x/n,y/n),d10=bilerp(q,(x+1)/n,y/n),d11=bilerp(q,(x+1)/n,(y+1)/n),d01=bilerp(q,x/n,(y+1)/n),s00={x:u0*sw,y:v0*sh},s10={x:u1*sw,y:v0*sh},s11={x:u1*sw,y:v1*sh},s01={x:u0*sw,y:v1*sh};drawTriangle(im,s00,s10,s11,d00,d10,d11);drawTriangle(im,s00,s11,s01,d00,d11,d01)}}
function drawObject(o){
syncAttachedObject(o);if(!layerVisible(o.layer))return;
ctx.save();ctx.globalAlpha=o.opacity??1;
if(o.type==='note'){
 const b=bbox(o.quad),c=centroid(o.quad);ctx.translate(c.x,c.y);ctx.rotate((o.rotation||0)*Math.PI/180);
 if(o.noteBackground!==false){ctx.fillStyle=o.noteBackgroundColor||'#ffffff';ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h);ctx.strokeStyle='#64748b';ctx.strokeRect(-b.w/2,-b.h/2,b.w,b.h)}
 ctx.fillStyle=o.noteTextColor||'#111827';ctx.font=`${o.noteFontSize||24}px system-ui`;ctx.textAlign='left';ctx.textBaseline='top';
 const pad=10,max=Math.max(20,b.w-pad*2),words=String(o.text||'Double-click to edit').split(/\s+/);let line='',y=-b.h/2+pad;
 for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>max&&line){ctx.fillText(line,-b.w/2+pad,y);line=word;y+=(o.noteFontSize||24)*1.25}else line=test}
 if(line)ctx.fillText(line,-b.w/2+pad,y);
}else drawWarp(img(o.src,o.remote),o.quad,o.flipH,o.flipV);
ctx.restore();

if(state.showObjectLabels&&o.type!=='note'){
 const b=bbox(o.quad),x=b.x+b.w/2,y=b.y+b.h+8;ctx.save();ctx.font='600 14px system-ui';ctx.textAlign='center';ctx.textBaseline='top';
 const pad=6,w=ctx.measureText(o.name||'Object').width+pad*2,h=24;ctx.fillStyle='rgba(255,255,255,.92)';ctx.strokeStyle='#64748b';
 ctx.fillRect(x-w/2,y,w,h);ctx.strokeRect(x-w/2,y,w,h);ctx.fillStyle='#111827';ctx.fillText(o.name||'Object',x,y+4);ctx.restore();
}
if(o.id===state.selectedId){ctx.save();ctx.strokeStyle='#0ea5e9';ctx.lineWidth=3;ctx.setLineDash([8,4]);ctx.beginPath();ctx.moveTo(o.quad[0].x,o.quad[0].y);o.quad.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#0ea5e9';o.quad.forEach(p=>ctx.fillRect(p.x-7,p.y-7,14,14));for(const cp of o.points||[]){const w=worldPoint(o,cp);ctx.beginPath();ctx.arc(w.x,w.y,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.stroke()}ctx.restore()}
}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);if(bgImage){ctx.save();ctx.globalAlpha=state.backgroundOpacity;const s=Math.min(canvas.width/bgImage.width,canvas.height/bgImage.height),w=bgImage.width*s,h=bgImage.height*s;ctx.drawImage(bgImage,(canvas.width-w)/2,(canvas.height-h)/2,w,h);ctx.restore()}drawGrid();for(const l of state.lines){if(!layerVisible(l.layer))continue;const a=endpoint(l,'start'),b=endpoint(l,'end');ctx.save();ctx.strokeStyle=l.color||'#111827';ctx.lineWidth=l.type==='measure'?2:4;if(l.type==='measure')ctx.setLineDash([9,5]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();if(l.type==='measure'){ctx.fillStyle='#111827';ctx.font='15px system-ui';ctx.fillText((Math.hypot(b.x-a.x,b.y-a.y)/100).toFixed(2)+' m',(a.x+b.x)/2+8,(a.y+b.y)/2-8)}if(l.id===state.selectedId){ctx.fillStyle='#0ea5e9';for(const p of [a,b]){ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fill()}}ctx.restore()}state.objects.forEach(drawObject);drawAnalysis();
if(drawing){
  ctx.save();
  for(const o of state.objects){
    if(!layerVisible(o.layer))continue;
    for(const cp of o.points||[]){
      const w=worldPoint(o,cp);
      ctx.beginPath();ctx.arc(w.x,w.y,7,0,Math.PI*2);
      ctx.fillStyle='#0ea5e9';ctx.fill();
      ctx.lineWidth=2;ctx.strokeStyle='#ffffff';ctx.stroke();
    }
  }
  ctx.restore();ctx.save();ctx.strokeStyle='#0ea5e9';ctx.lineWidth=3;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(drawing.x1,drawing.y1);ctx.lineTo(drawing.x2,drawing.y2);ctx.stroke();ctx.restore()}}
function objectAt(p){for(let i=state.objects.length-1;i>=0;i--){const o=state.objects[i];if(layerVisible(o.layer)&&pointInPoly(p.x,p.y,o.quad))return o}for(let i=state.lines.length-1;i>=0;i--){const l=state.lines[i],a=endpoint(l,'start'),b=endpoint(l,'end');if(distanceSegment(p,a,b)<10)return l}return null}
function cornerAt(o,p){for(let i=0;i<4;i++)if(Math.hypot(o.quad[i].x-p.x,o.quad[i].y-p.y)<15)return i;return-1}

canvas.addEventListener('pointerdown',e=>{const p=cpoint(e);
if(state.markHaulEndMode){
 const hit=nearestLineEndpoint(p,30);
 if(hit){
  state.haulEnd={lineId:hit.lineId,end:hit.end};
  state.markHaulEndMode=false;
  $('markHaulEndBtn').textContent='Mark Haul End';
  pushHistory();
  if(state.analysisVisible)analyseRig();else renderAll();
 }else{
  $('haulEndStatus').textContent='No rig-line endpoint found. Click closer to the end of a line.';
 }
 return;
}if(state.tool==='line'||state.tool==='measure'){const snap=$('snapToggle').checked?nearestConnection(p):null;drawing={type:state.tool,x1:snap?snap.x:p.x,y1:snap?snap.y:p.y,x2:p.x,y2:p.y,startSnap:snap};canvas.setPointerCapture(e.pointerId);return}if(state.tool==='label'){const t=prompt('Label text:');if(t){pushHistory();state.lines.push({id:uid(),type:'label',name:t,start:{x:p.x,y:p.y},end:{x:p.x+1,y:p.y},color:'#111827',layer:'labels'});renderAll()}return}const cur=selected();if(cur?.quad){const ci=cornerAt(cur,p);if(ci>=0){pushHistory();drag={kind:state.perspective?'corner':'scale',index:ci,start:p,orig:JSON.parse(JSON.stringify(cur.quad))};canvas.setPointerCapture(e.pointerId);return}}const item=objectAt(p);state.selectedId=item?.id||null;if(item?.quad&&!layerLocked(item.layer)){pushHistory();drag={kind:'moveObject',start:p,orig:JSON.parse(JSON.stringify(item.quad))};canvas.setPointerCapture(e.pointerId)}else if(item&&!item.quad&&!layerLocked(item.layer)){pushHistory();const a=endpoint(item,'start'),b=endpoint(item,'end');drag={kind:'moveLine',start:p,orig:{a,b}};canvas.setPointerCapture(e.pointerId)}else if(state.tool==='pan'){drag={kind:'pan',sx:e.clientX,sy:e.clientY,sl:viewport.scrollLeft,st:viewport.scrollTop};canvas.setPointerCapture(e.pointerId)}renderAll()});
canvas.addEventListener('pointermove',e=>{const p=cpoint(e);if(drawing){const snap=$('snapToggle').checked?nearestConnection(p):null;drawing.x2=snap?snap.x:p.x;drawing.y2=snap?snap.y:p.y;drawing.endSnap=snap;draw();return}if(!drag)return;if(drag.kind==='pan'){viewport.scrollLeft=drag.sl-(e.clientX-drag.sx);viewport.scrollTop=drag.st-(e.clientY-drag.sy);return}const s=selected();if(drag.kind==='moveObject'&&s?.quad){let dx=p.x-drag.start.x,dy=p.y-drag.start.y;if($('snapToggle').checked){dx=Math.round(dx/10)*10;dy=Math.round(dy/10)*10}s.quad=drag.orig.map(q=>({x:q.x+dx,y:q.y+dy}))}else if(drag.kind==='corner'&&s?.quad){s.quad[drag.index]={x:p.x,y:p.y}}else if(drag.kind==='scale'&&s?.quad){const oi=(drag.index+2)%4,opp=drag.orig[oi],oc=drag.orig[drag.index],sx=(p.x-opp.x)/(oc.x-opp.x||1),sy=(p.y-opp.y)/(oc.y-opp.y||1);s.quad=drag.orig.map(q=>({x:opp.x+(q.x-opp.x)*sx,y:opp.y+(q.y-opp.y)*sy}))}else if(drag.kind==='moveLine'&&s&&!s.quad){const dx=p.x-drag.start.x,dy=p.y-drag.start.y;s.start={x:drag.orig.a.x+dx,y:drag.orig.a.y+dy};s.end={x:drag.orig.b.x+dx,y:drag.orig.b.y+dy}}renderAll()});
canvas.addEventListener('pointerup',e=>{if(drawing){pushHistory();state.lines.push({id:uid(),type:drawing.type,name:drawing.type==='measure'?'Measurement':'Rig line',start:drawing.startSnap?{objectId:drawing.startSnap.objectId,pointId:drawing.startSnap.pointId}:{x:drawing.x1,y:drawing.y1},end:drawing.endSnap?{objectId:drawing.endSnap.objectId,pointId:drawing.endSnap.pointId}:{x:drawing.x2,y:drawing.y2},color:drawing.type==='measure'?'#dc2626':'#111827',layer:drawing.type==='measure'?'measurements':'rig-lines',notes:''});drawing=null;renderAll()}if(drag&&drag.kind==='moveObject'){const moved=selected();attachHardwareIfNear(moved)}
drag=null});
canvas.addEventListener('dblclick',e=>{const p=cpoint(e),o=objectAt(p);if(o?.type==='note'){state.selectedId=o.id;renderAll();editNoteText(o)}});
canvas.addEventListener('dragover',e=>e.preventDefault());canvas.addEventListener('drop',e=>{e.preventDefault();const raw=e.dataTransfer.getData('application/x-simplerig');if(raw){const p=cpoint(e);addAsset(JSON.parse(raw),p.x,p.y)}});

function addNote(){
 pushHistory();const x=canvas.width/2,y=canvas.height/2,w=280,h=110;
 const o={id:uid(),type:'note',name:'Note',text:'Double-click to edit',quad:makeQuad(x,y,w,h),rotation:0,opacity:1,color:'#111827',noteTextColor:'#111827',noteBackgroundColor:'#ffffff',noteBackground:true,noteFontSize:24,notes:'',layer:'labels',points:[]};
 state.objects.push(o);state.selectedId=o.id;renderAll();editNoteText(o);
}
function editNoteText(o){
 if(!o||o.type!=='note')return;document.querySelector('.note-editor-overlay')?.remove();
 const b=bbox(o.quad),canvasRect=canvas.getBoundingClientRect(),viewRect=viewport.getBoundingClientRect();
 const editor=document.createElement('textarea');editor.className='note-editor-overlay';editor.value=o.text||'';
 editor.style.left=(canvasRect.left-viewRect.left+viewport.scrollLeft+b.x*state.zoom)+'px';
 editor.style.top=(canvasRect.top-viewRect.top+viewport.scrollTop+b.y*state.zoom)+'px';
 editor.style.width=Math.max(140,b.w*state.zoom)+'px';editor.style.height=Math.max(48,b.h*state.zoom)+'px';
 editor.style.fontSize=((o.noteFontSize||24)*state.zoom)+'px';editor.style.color=o.noteTextColor||'#111827';
 editor.style.background=o.noteBackground===false?'rgba(255,255,255,.1)':(o.noteBackgroundColor||'#ffffff');
 viewport.style.position='relative';viewport.appendChild(editor);editor.focus();editor.select();
 const finish=()=>{if(!editor.isConnected)return;pushHistory();o.text=editor.value;const ew=editor.offsetWidth,eh=editor.offsetHeight,c=centroid(o.quad);o.quad=makeQuad(c.x,c.y,ew/state.zoom,eh/state.zoom);editor.remove();renderAll()};
 editor.addEventListener('blur',finish);editor.addEventListener('keydown',e=>{if(e.key==='Escape'){editor.remove();renderAll()}if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();finish()}});
}
function renderInspector(){const s=selected();$('emptyInspector').hidden=!!s;$('inspector').hidden=!s;if(!s)return;$('objName').value=s.name||'';$('objColor').value=s.color||'#111827';$('objNotes').value=s.notes||'';$('imageControls').hidden=!s.quad;$('noteControls').hidden=s.type!=='note';$('analysisObjectControls').hidden=s.type==='note';if(s.type!=='note'){$('isLoadToggle').checked=!!s.isLoad;$('loadMassKg').value=s.loadMassKg??(s.type==='performer'?80:0);$('pulleyRole').value=s.pulleyRole||'auto';$('pulleyEfficiency').value=s.pulleyEfficiency??95;$('objectWllKg').value=s.wllKg??'';}if(s.type==='note'){$('noteFontSize').value=s.noteFontSize||24;$('noteTextColor').value=s.noteTextColor||'#111827';$('noteBackgroundColor').value=s.noteBackgroundColor||'#ffffff';$('noteBackgroundToggle').checked=s.noteBackground!==false}if(s.quad){const b=bbox(s.quad);$('objWidth').value=Math.round(b.w);$('objHeight').value=Math.round(b.h);$('objRotation').value=Math.round(s.rotation||0);$('objOpacity').value=s.opacity||1;$('connectionInfo').textContent=(s.points||[]).map(p=>p.name).join(', ')||'No defined points.'}else $('connectionInfo').textContent='Lines can attach to blue object connection points.'}
function updateInspector(){const s=selected();if(!s)return;pushHistory();s.name=$('objName').value;s.color=$('objColor').value;s.notes=$('objNotes').value;if(s.type==='note'){s.noteFontSize=+$('noteFontSize').value||24;s.noteTextColor=$('noteTextColor').value;s.noteBackgroundColor=$('noteBackgroundColor').value;s.noteBackground=$('noteBackgroundToggle').checked}else{s.isLoad=$('isLoadToggle').checked;s.loadMassKg=Math.max(0,+$('loadMassKg').value||0);s.pulleyRole=$('pulleyRole').value;s.pulleyEfficiency=Math.max(1,Math.min(100,+$('pulleyEfficiency').value||95));s.wllKg=Math.max(0,+$('objectWllKg').value||0)}if(s.quad){const b=bbox(s.quad),c=centroid(s.quad),nw=Math.max(10,+$('objWidth').value),nh=Math.max(10,+$('objHeight').value),sx=nw/(b.w||1),sy=nh/(b.h||1);s.quad=s.quad.map(p=>({x:c.x+(p.x-c.x)*sx,y:c.y+(p.y-c.y)*sy}));const delta=+$('objRotation').value-(s.rotation||0);s.quad=rotateQuad(s.quad,delta,c);s.rotation=+$('objRotation').value;s.opacity=+$('objOpacity').value}renderAll()}
function deleteSelected(){if(!state.selectedId)return;pushHistory();state.objects=state.objects.filter(o=>o.id!==state.selectedId);state.lines=state.lines.filter(l=>l.id!==state.selectedId);state.selectedId=null;renderAll()}
function duplicate(){const s=selected();if(!s)return;pushHistory();const c=JSON.parse(JSON.stringify(s));c.id=uid();c.name+=' Copy';if(c.quad)c.quad=c.quad.map(p=>({x:p.x+30,y:p.y+30}));else{c.start={x:endpoint(c,'start').x+30,y:endpoint(c,'start').y+30};c.end={x:endpoint(c,'end').x+30,y:endpoint(c,'end').y+30}}(c.quad?state.objects:state.lines).push(c);state.selectedId=c.id;renderAll()}
function resetTransform(){const s=selected();if(!s?.quad)return;pushHistory();const c=centroid(s.quad),b=bbox(s.quad);s.quad=makeQuad(c.x,c.y,b.w,b.h);s.rotation=0;s.flipH=s.flipV=false;renderAll()}
function flip(k){const s=selected();if(!s?.quad)return;pushHistory();s[k]=!s[k];renderAll()}

function objectLineConnections(objectId){const out=[];for(const line of state.lines){if(line.type!=='line')continue;if(line.start?.objectId===objectId)out.push({line,end:'start',other:line.end});if(line.end?.objectId===objectId)out.push({line,end:'end',other:line.start})}return out}
function objectCentre(o){return centroid(o.quad)}
function vectorAngleDeg(v1,v2){const m1=Math.hypot(v1.x,v1.y)||1,m2=Math.hypot(v2.x,v2.y)||1,c=Math.max(-1,Math.min(1,(v1.x*v2.x+v1.y*v2.y)/(m1*m2)));return Math.acos(c)*180/Math.PI}
function pulleyResultantKg(o,tensionKg){const conns=objectLineConnections(o.id);if(conns.length<2)return tensionKg;const c=objectCentre(o),pts=conns.slice(0,2).map(cn=>{const p=cn.other?.objectId?endpoint(cn.line,cn.end==='start'?'end':'start'):cn.other;return{x:p.x-c.x,y:p.y-c.y}}),theta=vectorAngleDeg(pts[0],pts[1]);return Math.abs(2*tensionKg*Math.cos((theta*Math.PI/180)/2))}
function determinePulleyRole(o,load){if(o.pulleyRole&&o.pulleyRole!=='auto')return o.pulleyRole;const conns=objectLineConnections(o.id),lc=objectCentre(load),pc=objectCentre(o),near=Math.hypot(pc.x-lc.x,pc.y-lc.y)<Math.max(bbox(load.quad).h*1.2,180),direct=conns.some(c=>c.other?.objectId===load.id);return near||direct?'moving':'fixed'}
function analyseRig(){const loads=state.objects.filter(o=>o.isLoad&&o.loadMassKg>0);if(!loads.length)return alert('Mark a performer, camera or other object as a load and enter its mass first.');const load=loads[0],mass=+load.loadMassKg,loadConns=objectLineConnections(load.id);if(!loadConns.length)return alert('The selected load is not connected to any rig lines.');const pulleyIds=new Set(),hardwareIds=new Set(),visited=new Set([load.id]),queue=[load.id],lineIds=new Set();while(queue.length){const oid=queue.shift();for(const c of objectLineConnections(oid)){lineIds.add(c.line.id);const otherId=c.other?.objectId;if(!otherId||visited.has(otherId))continue;visited.add(otherId);queue.push(otherId);const obj=state.objects.find(o=>o.id===otherId);if(obj?.type==='pulley')pulleyIds.add(otherId);else if(obj)hardwareIds.add(otherId)}}const pulleys=[...pulleyIds].map(id=>state.objects.find(o=>o.id===id)).filter(Boolean),moving=pulleys.filter(p=>determinePulleyRole(p,load)==='moving'),fixed=pulleys.filter(p=>determinePulleyRole(p,load)!=='moving');let supporting=0;if(moving.length){for(const p of moving)supporting+=Math.max(1,objectLineConnections(p.id).length)}else supporting=Math.max(1,loadConns.length);const idealMA=Math.max(1,Math.min(12,supporting)),eff=pulleys.map(p=>(+p.pulleyEfficiency||95)/100).reduce((a,b)=>a*b,1),effectiveMA=Math.max(.01,idealMA*eff),pullKg=mass/effectiveMA,additionalLineTensionKg=Math.max(0,+$('additionalLineTensionKg').value||0),tensionKg=pullKg+additionalLineTensionKg,lineLoads={};state.additionalLineTensionKg=additionalLineTensionKg;for(const id of lineIds)lineLoads[id]=tensionKg;const objectLoads={};objectLoads[load.id]={kg:mass,kind:'load'};for(const p of pulleys){const role=determinePulleyRole(p,load),kg=role==='moving'?Math.min(mass,pulleyResultantKg(p,tensionKg)):pulleyResultantKg(p,tensionKg);objectLoads[p.id]={kg,kind:role==='moving'?'moving pulley':'fixed pulley'}}for(const id of hardwareIds){const o=state.objects.find(x=>x.id===id);if(!o||o.id===load.id)continue;const conns=objectLineConnections(o.id),kg=conns.length>=2?pulleyResultantKg(o,tensionKg):tensionKg;objectLoads[o.id]={kg,kind:o.type==='machine'?'anchor / machine':'anchor / hardware'}}const warnings=[];for(const [id,res] of Object.entries(objectLoads)){const o=state.objects.find(x=>x.id===id);if(o?.wllKg>0&&res.kg>o.wllKg)warnings.push(`${o.name}: ${res.kg.toFixed(1)} kg exceeds WLL ${o.wllKg} kg`);else if(o?.wllKg>0&&res.kg>o.wllKg*.8)warnings.push(`${o.name}: ${res.kg.toFixed(1)} kg is above 80% of WLL`)}const haulEndValid=!!(state.haulEnd&&lineLoads[state.haulEnd.lineId]!=null);const haulEndPullKg=haulEndValid?tensionKg:null;state.analysis={loadMassKg:mass,idealMA,effectiveMA,pullKg,additionalLineTensionKg,tensionKg,haulEndPullKg,haulEndValid,lineLoads,objectLoads,warnings,movingPulleyCount:moving.length,fixedPulleyCount:fixed.length};state.analysisVisible=true;renderAll()}
function clearAnalysis(){state.analysis=null;state.analysisVisible=false;renderAll()}
function drawAnalysis(){
 if(state.haulEnd){
  const line=haulEndLine();
  if(line){
   const p=endpoint(line,state.haulEnd.end);
   ctx.save();
   ctx.beginPath();ctx.arc(p.x,p.y,12,0,Math.PI*2);
   ctx.fillStyle='#a855f7';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#ffffff';ctx.stroke();
   ctx.font='700 14px system-ui';ctx.textAlign='left';ctx.textBaseline='middle';
   const pull=state.analysis?.haulEndPullKg;
   const text=pull!=null?`HAUL END · Lifter pull ${pull.toFixed(1)} kgf`:'HAUL END';
   const w=ctx.measureText(text).width+14;
   ctx.fillStyle='rgba(255,255,255,.97)';ctx.strokeStyle='#a855f7';ctx.lineWidth=2;
   ctx.fillRect(p.x+16,p.y-13,w,26);ctx.strokeRect(p.x+16,p.y-13,w,26);
   ctx.fillStyle='#111827';ctx.fillText(text,p.x+23,p.y);
   ctx.restore();
  }
 }
 if(!state.analysisVisible||!state.analysis)return;
 const a=state.analysis;ctx.save();for(const line of state.lines){const kg=a.lineLoads[line.id];if(kg==null)continue;const p1=endpoint(line,'start'),p2=endpoint(line,'end');ctx.strokeStyle='#2563eb';ctx.lineWidth=7;ctx.globalAlpha=.42;ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.globalAlpha=1;const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,text=`${kg.toFixed(1)} kgf total line tension`;ctx.font='600 14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';const w=ctx.measureText(text).width+12;ctx.fillStyle='rgba(255,255,255,.96)';ctx.strokeStyle='#2563eb';ctx.lineWidth=1;ctx.fillRect(mx-w/2,my-12,w,24);ctx.strokeRect(mx-w/2,my-12,w,24);ctx.fillStyle='#111827';ctx.fillText(text,mx,my)}for(const [id,res] of Object.entries(a.objectLoads)){const o=state.objects.find(x=>x.id===id);if(!o)continue;const b=bbox(o.quad),x=b.x+b.w/2,y=b.y-22,text=`${res.kg.toFixed(1)} kg · ${res.kind}`;ctx.font='600 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';const w=ctx.measureText(text).width+12;ctx.fillStyle='rgba(255,255,255,.96)';ctx.strokeStyle='#64748b';ctx.lineWidth=2;ctx.fillRect(x-w/2,y-12,w,24);ctx.strokeRect(x-w/2,y-12,w,24);ctx.fillStyle='#111827';ctx.fillText(text,x,y)}ctx.restore()}
function renderAnalysisSummary(){const el=$('analysisSummary');if(!el)return;if($('additionalLineTensionKg'))$('additionalLineTensionKg').value=state.additionalLineTensionKg??0;if(!state.analysisVisible||!state.analysis){el.className='analysis-summary hint';el.innerHTML='Connect a load, pulleys and anchors with rig lines, then select <strong>Analyse Rig</strong>.';return}const a=state.analysis;el.className='analysis-summary';el.innerHTML=`<div class="analysis-card"><span>Load</span><strong>${a.loadMassKg.toFixed(1)} kg</strong></div><div class="analysis-card"><span>Ideal mechanical advantage</span><strong>${a.idealMA.toFixed(2)} : 1</strong></div><div class="analysis-card"><span>Estimated effective advantage</span><strong>${a.effectiveMA.toFixed(2)} : 1</strong></div><div class="analysis-card"><span>Estimated pull from load</span><strong>${a.pullKg.toFixed(1)} kgf</strong></div><div class="analysis-card"><span>Additional line tension</span><strong>${a.additionalLineTensionKg.toFixed(1)} kgf</strong></div><div class="analysis-card"><span>Total line tension</span><strong>${a.tensionKg.toFixed(1)} kgf</strong></div>${a.haulEndValid?`<div class="analysis-card"><span>Lifter pull at haul end</span><strong>${a.haulEndPullKg.toFixed(1)} kgf</strong></div>`:`<div class="analysis-card analysis-warning">Mark a connected rig-line endpoint as the Haul End to display lifter pull.</div>`}<div class="analysis-card"><span>Pulleys</span><strong>${a.movingPulleyCount} moving · ${a.fixedPulleyCount} fixed</strong></div>${a.warnings.map(w=>`<div class="analysis-card analysis-warning">${w}</div>`).join('')}<div class="analysis-card analysis-warning">Planning estimate. Additional line tension is added to the calculated pull and increases the calculated load on connected rope segments, pulleys, shackles, hardware and anchors. Verify pulley roles, friction, angles, WLLs and dynamic effects independently.</div>`}

function renderLayers(){
const el=$('layerList');el.innerHTML='';
state.layers.forEach(l=>{
 const r=document.createElement('div');r.className='layer-category-row';
 r.innerHTML=`<button data-v>${l.visible?'👁':'🚫'}</button><button data-l>${l.locked?'🔒':'🔓'}</button><span>${l.name}</span>`;
 r.querySelector('[data-v]').onclick=()=>{pushHistory();l.visible=!l.visible;renderAll()};
 r.querySelector('[data-l]').onclick=()=>{pushHistory();l.locked=!l.locked;renderAll()};
 el.appendChild(r);
});
}
function renderAll(){draw();renderInspector();renderLayers();renderHaulEndStatus();renderAnalysisSummary();renderHierarchy();renderDrawingLibrary();renderCalendar();renderProjects();drawHarness()}


function ensureHierarchy(){
 if(!Array.isArray(state.sequences))state.sequences=[];
 if(!state.sequences.length){
   const seq={id:uid(),name:'Sequence 1',colour:'#0ea5e9',rigs:[]};
   const rig={id:uid(),name:'Rig / Move 1',drawingId:null,harnessNotes:'',harnessItems:[]};
   seq.rigs.push(rig);state.sequences.push(seq);state.currentSequenceId=seq.id;state.currentRigId=rig.id;
 }
 let seq=state.sequences.find(s=>s.id===state.currentSequenceId)||state.sequences[0];
 state.currentSequenceId=seq.id;
 if(!seq.rigs.length)seq.rigs.push({id:uid(),name:'Rig / Move 1',drawingId:null,harnessNotes:'',harnessItems:[]});
 let rig=seq.rigs.find(r=>r.id===state.currentRigId)||seq.rigs[0];
 state.currentRigId=rig.id;
}
function currentSequence(){ensureHierarchy();return state.sequences.find(s=>s.id===state.currentSequenceId)}
function currentRig(){const seq=currentSequence();return seq.rigs.find(r=>r.id===state.currentRigId)}
function renderHierarchy(){
 if(!$('sequenceSelect'))return;ensureHierarchy();
 const seqSel=$('sequenceSelect'),rigSel=$('rigSelect');seqSel.innerHTML='';rigSel.innerHTML='';
 for(const s of state.sequences){const o=document.createElement('option');o.value=s.id;o.textContent=s.name;o.style.color=s.colour;seqSel.appendChild(o)}
 seqSel.value=state.currentSequenceId;
 const seq=currentSequence();
 for(const r of seq.rigs){const o=document.createElement('option');o.value=r.id;o.textContent=r.name;rigSel.appendChild(o)}
 rigSel.value=state.currentRigId;$('sequenceColour').value=seq.colour||'#0ea5e9';
}
function addSequence(){
 const name=prompt('Sequence name:','New Sequence');if(!name)return;
 const s={id:uid(),name,colour:$('sequenceColour').value||'#0ea5e9',rigs:[{id:uid(),name:'Rig / Move 1',drawingId:null,harnessNotes:'',harnessItems:[]}]};
 state.sequences.push(s);state.currentSequenceId=s.id;state.currentRigId=s.rigs[0].id;pushHistory();renderAll();
}
function addRig(){
 const seq=currentSequence(),name=prompt('Rig / Move name:','New Rig / Move');if(!name)return;
 const r={id:uid(),name,drawingId:null,harnessNotes:'',harnessItems:[]};seq.rigs.push(r);state.currentRigId=r.id;
 state.harnessNotes='';state.harnessItems=[];$('harnessNotes').value='';pushHistory();renderAll();drawHarness();
}
function saveCurrentRig(){
 const rig=currentRig();rig.harnessNotes=$('harnessNotes').value;rig.harnessItems=JSON.parse(JSON.stringify(state.harnessItems));
 state.harnessNotes=rig.harnessNotes;
 state.selectedId=null;draw();
 try{
  const image=canvas.toDataURL('image/png');
  let drawing=state.drawings.find(d=>d.id===rig.drawingId);
  if(!drawing){drawing={id:uid(),name:rig.name,image,created:new Date().toISOString(),sequenceId:state.currentSequenceId,rigId:rig.id};state.drawings.push(drawing);rig.drawingId=drawing.id}
  else{drawing.name=rig.name;drawing.image=image;drawing.sequenceId=state.currentSequenceId;drawing.rigId=rig.id;drawing.updated=new Date().toISOString()}
  drawing.harnessNotes=rig.harnessNotes;drawing.harnessImage=harnessCanvas.toDataURL('image/png');
  pushHistory();saveProject();renderAll();
 }catch{alert('Unable to save this rig / move because a remote image blocks canvas export.')}
}
function selectRig(seqId,rigId){
 state.currentSequenceId=seqId;state.currentRigId=rigId;const rig=currentRig();
 state.harnessNotes=rig.harnessNotes||'';state.harnessItems=JSON.parse(JSON.stringify(rig.harnessItems||[]));
 $('harnessNotes').value=state.harnessNotes;renderAll();drawHarness();
}

function saveDrawing(){saveCurrentRig()}
function renderDrawingLibrary(){
const el=$('drawingLibrary');if(!el)return;el.innerHTML='';ensureHierarchy();
const all=[];
for(const seq of state.sequences)for(const rig of seq.rigs){const d=state.drawings.find(x=>x.id===rig.drawingId);if(d)all.push({seq,rig,d})}
if(!all.length){el.innerHTML='<p>No saved rigs / moves yet.</p>';return}
for(const {seq,rig,d} of all){
 const c=document.createElement('div');c.className='drawing-card';c.draggable=true;c.dataset.id=d.id;
 c.style.borderLeft=`8px solid ${seq.colour}`;
 c.innerHTML=`<img src="${d.image}" alt=""><h4>${seq.name} → ${rig.name}</h4><p>Drag onto a calendar date</p><button data-open>Open</button> <button data-download>Download</button>`;
 c.addEventListener('dragstart',e=>e.dataTransfer.setData('text/simplerig-drawing',d.id));
 c.querySelector('[data-open]').onclick=()=>selectRig(seq.id,rig.id);
 c.querySelector('[data-download]').onclick=()=>download(dataUrlBlob(d.image),rig.name+'.png');
 el.appendChild(c);
}}
function dataUrlBlob(url){const [meta,data]=url.split(','),mime=meta.match(/:(.*?);/)[1],bin=atob(data),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type:mime})}
function renderCalendar(){
const el=$('calendarGrid');if(!el)return;el.innerHTML='';
['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(x=>{const h=document.createElement('div');h.className='calendar-head';h.textContent=x;el.appendChild(h)});
const first=new Date(state.year,state.month,1),off=(first.getDay()+6)%7,start=new Date(state.year,state.month,1-off);
$('calendarTitle').textContent=first.toLocaleString('en-GB',{month:'long',year:'numeric'});
for(let i=0;i<42;i++){
 const d=new Date(start);d.setDate(start.getDate()+i);const key=d.toISOString().slice(0,10),cell=document.createElement('div');
 cell.className='calendar-day'+(d.getMonth()!==state.month?' other':'');cell.innerHTML=`<div class="daynum">${d.getDate()}</div>`;
 state.calendar.filter(x=>x.date===key).forEach(item=>{
  const dr=state.drawings.find(x=>x.id===item.drawingId);if(!dr)return;
  const seq=state.sequences.find(s=>s.id===dr.sequenceId),rig=seq?.rigs.find(r=>r.id===dr.rigId);
  const card=document.createElement('div');card.className='calendar-drawing';card.draggable=true;card.dataset.id=item.id;
  card.style.borderLeftColor=seq?.colour||'#0ea5e9';
  card.innerHTML=`<button class="calendar-remove" title="Remove">×</button><img src="${dr.image}" alt=""><div>${seq?.name||'Sequence'} → ${rig?.name||dr.name}</div><small>Harness reference included</small>`;
  card.querySelector('.calendar-remove').onclick=e=>{e.stopPropagation();state.calendar=state.calendar.filter(x=>x.id!==item.id);pushHistory();renderCalendar()};
  card.addEventListener('dragstart',e=>e.dataTransfer.setData('text/calendar-item',item.id));
  cell.appendChild(card);
 });
 cell.addEventListener('dragover',e=>e.preventDefault());
 cell.addEventListener('drop',e=>{e.preventDefault();const drawingId=e.dataTransfer.getData('text/simplerig-drawing'),itemId=e.dataTransfer.getData('text/calendar-item');if(drawingId)state.calendar.push({id:uid(),drawingId,date:key});else if(itemId){const it=state.calendar.find(x=>x.id===itemId);if(it)it.date=key}pushHistory();renderCalendar()});
 el.appendChild(cell);
}}
function exportICS(){let txt='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SimpleRig//EN\r\n';for(const item of state.calendar){const d=state.drawings.find(x=>x.id===item.drawingId);if(!d)continue;txt+=`BEGIN:VEVENT\r\nUID:${item.id}@simplerig\r\nDTSTART;VALUE=DATE:${item.date.replaceAll('-','')}\r\nSUMMARY:${d.name.replace(/[,;\\]/g,' ')}\r\nDESCRIPTION:SimpleRig drawing scheduled for ${state.projectName.replace(/[,;\\]/g,' ')}\r\nEND:VEVENT\r\n`}txt+='END:VCALENDAR\r\n';download(new Blob([txt],{type:'text/calendar'}),(state.projectName||'SimpleRig')+'-calendar.ics')}
function renderProjects(){const el=$('projectsGrid');if(!el)return;el.innerHTML='';Object.values(projectMap()).sort((a,b)=>b.updated.localeCompare(a.updated)).forEach(p=>{const c=document.createElement('div');c.className='project-card';c.innerHTML=`<h3>${p.name.replace(/[<>]/g,'')}</h3><p>Updated ${new Date(p.updated).toLocaleString('en-GB')}</p><div class="project-actions"><button data-open>Open</button><button data-copy>Duplicate</button><button data-delete>Delete</button></div>`;c.querySelector('[data-open]').onclick=()=>loadProject(p.id);c.querySelector('[data-copy]').onclick=()=>{const ps=projectMap(),d=JSON.parse(p.data),id=uid();d.projectId=id;d.projectName+=' Copy';ps[id]={id,name:d.projectName,updated:new Date().toISOString(),data:JSON.stringify(d)};localStorage.setItem('simplerig-pro-projects',JSON.stringify(ps));renderProjects()};c.querySelector('[data-delete]').onclick=()=>{if(confirm('Delete this project?')){const ps=projectMap();delete ps[p.id];localStorage.setItem('simplerig-pro-projects',JSON.stringify(ps));renderProjects()}};el.appendChild(c)})}
async function liveSearch(){const q=$('liveQuery').value.trim();if(!q)return;$('liveStatus').textContent='Searching…';$('liveResults').innerHTML='';const url='https://commons.wikimedia.org/w/api.php?origin=*&action=query&format=json&generator=search&gsrnamespace=6&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=300';try{const r=await fetch(url),data=await r.json(),pages=Object.values(data.query?.pages||{});$('liveStatus').textContent=pages.length+' results';for(const p of pages){const inf=p.imageinfo?.[0];if(!inf)continue;const card=document.createElement('div');card.className='live-card';const licence=inf.extmetadata?.LicenseShortName?.value||'See source';card.innerHTML=`<img src="${inf.thumburl||inf.url}" alt=""><p title="${p.title}">${p.title.replace(/^File:/,'')}</p><p>${licence}</p><button>Add</button>`;card.querySelector('button').onclick=()=>addAsset({name:p.title.replace(/^File:/,''),type:'image',src:inf.url,w:220,h:160,points:[],remote:true,source:inf.descriptionurl,licence},canvas.width/2,canvas.height/2);$('liveResults').appendChild(card)}}catch(e){$('liveStatus').textContent='Search failed. Check your connection.'}}
function calculate(){const kg=Math.max(0,+$('calcLoad').value||0),r=Math.max(1,+$('calcRatio').value||1),eff=clamp(+$('calcEfficiency').value||100,1,100)/100,dis=Math.max(.1,+$('calcDisadvantage').value||1),reds=Math.max(0,+$('calcRedirects').value||0),load=kg*9.81,ideal=load/r,actual=ideal/eff*dis;$('rLoad').textContent=load.toFixed(0)+' N';$('rIdeal').textContent=ideal.toFixed(0)+' N';$('rActual').textContent=actual.toFixed(0)+' N';$('rKg').textContent=(actual/9.81).toFixed(1)+' kgf';$('rTension').textContent=actual.toFixed(0)+' N';$('rRedirect').textContent=reds?(actual*2).toFixed(0)+' N × '+reds:'None';$('rTravel').textContent=r.toFixed(1)+' m';$('rFactor').textContent=(r*eff/dis).toFixed(2)+':1'}
function switchView(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
const harnessCanvas=$('harnessCanvas'),hctx=harnessCanvas?.getContext('2d');
let harnessBg=null,harnessDrag=null;
function loadHarnessBackground(){
 if(!harnessCanvas)return;
 harnessBg=new Image();harnessBg.onload=drawHarness;harnessBg.src='assets/harness-reference.png';
}
function harnessHit(p){
 for(let i=state.harnessItems.length-1;i>=0;i--){const it=state.harnessItems[i];
  if(it.type==='shackle'&&Math.hypot(p.x-it.x,p.y-it.y)<Math.max(it.w,it.h)/2)return it;
  if(it.type==='leader'){
   if(Math.hypot(p.x-it.x1,p.y-it.y1)<18)return {...it,handle:'start'};
   if(Math.hypot(p.x-it.x2,p.y-it.y2)<18)return {...it,handle:'end'};
   if(Math.abs(p.x-it.tx)<90&&Math.abs(p.y-it.ty)<28)return {...it,handle:'text'};
  }
 }return null;
}
function drawLoop(x,y,angle){
 hctx.save();hctx.translate(x,y);hctx.rotate(angle);hctx.strokeStyle='#111827';hctx.lineWidth=5;hctx.beginPath();hctx.ellipse(0,0,13,8,0,0,Math.PI*2);hctx.stroke();hctx.restore();
}
function drawHarness(){
 if(!harnessCanvas||!hctx)return;
 hctx.clearRect(0,0,harnessCanvas.width,harnessCanvas.height);hctx.fillStyle='#92949a';hctx.fillRect(0,0,harnessCanvas.width,harnessCanvas.height);
 if(harnessBg?.complete){
  const s=Math.min((harnessCanvas.width-30)/harnessBg.width,(harnessCanvas.height-30)/harnessBg.height);
  const w=harnessBg.width*s,h=harnessBg.height*s;hctx.drawImage(harnessBg,(harnessCanvas.width-w)/2,(harnessCanvas.height-h)/2,w,h);
 }
 for(const it of state.harnessItems){
  if(it.type==='shackle'){const im=img('assets/rigging-hardware/Bow Shackle Front.png');if(im.complete)hctx.drawImage(im,it.x-it.w/2,it.y-it.h/2,it.w,it.h)}
  if(it.type==='leader'){
   const a=Math.atan2(it.y2-it.y1,it.x2-it.x1);hctx.strokeStyle='#111827';hctx.lineWidth=5;hctx.beginPath();hctx.moveTo(it.x1,it.y1);hctx.lineTo(it.x2,it.y2);hctx.stroke();
   drawLoop(it.x1,it.y1,a);drawLoop(it.x2,it.y2,a);
   hctx.fillStyle='rgba(255,255,255,.94)';hctx.strokeStyle='#111827';hctx.lineWidth=1;hctx.fillRect(it.tx-88,it.ty-24,176,48);hctx.strokeRect(it.tx-88,it.ty-24,176,48);
   hctx.fillStyle='#111827';hctx.font='16px system-ui';hctx.textAlign='center';hctx.fillText('_______cm/m',it.tx,it.ty-3);hctx.fillText('3mm/6mm',it.tx,it.ty+17);
  }
  if(it.id===state.harnessSelectedId){hctx.strokeStyle='#0ea5e9';hctx.lineWidth=3;hctx.setLineDash([7,4]);if(it.type==='shackle')hctx.strokeRect(it.x-it.w/2-5,it.y-it.h/2-5,it.w+10,it.h+10);else{hctx.beginPath();hctx.moveTo(it.x1,it.y1);hctx.lineTo(it.x2,it.y2);hctx.stroke()}hctx.setLineDash([])}
 }
}
function harnessPoint(e){const r=harnessCanvas.getBoundingClientRect();return{x:(e.clientX-r.left)*harnessCanvas.width/r.width,y:(e.clientY-r.top)*harnessCanvas.height/r.height}}
function addHarnessShackle(){state.harnessItems.push({id:uid(),type:'shackle',x:450,y:420,w:95,h:95});state.harnessSelectedId=state.harnessItems.at(-1).id;pushHistory();drawHarness()}
function addHarnessLeader(){state.harnessItems.push({id:uid(),type:'leader',x1:330,y1:500,x2:570,y2:500,tx:450,ty:455});state.harnessSelectedId=state.harnessItems.at(-1).id;pushHistory();drawHarness()}
if(harnessCanvas){
 harnessCanvas.addEventListener('pointerdown',e=>{const p=harnessPoint(e),hit=harnessHit(p);state.harnessSelectedId=hit?.id||null;if(hit){harnessDrag={id:hit.id,handle:hit.handle||'body',start:p};harnessCanvas.setPointerCapture(e.pointerId)}drawHarness()});
 harnessCanvas.addEventListener('pointermove',e=>{if(!harnessDrag)return;const p=harnessPoint(e),it=state.harnessItems.find(x=>x.id===harnessDrag.id);if(!it)return;const dx=p.x-harnessDrag.start.x,dy=p.y-harnessDrag.start.y;harnessDrag.start=p;
  if(it.type==='shackle'){it.x+=dx;it.y+=dy}
  else if(harnessDrag.handle==='start'){it.x1+=dx;it.y1+=dy}
  else if(harnessDrag.handle==='end'){it.x2+=dx;it.y2+=dy}
  else if(harnessDrag.handle==='text'){it.tx+=dx;it.ty+=dy}
  else{it.x1+=dx;it.y1+=dy;it.x2+=dx;it.y2+=dy;it.tx+=dx;it.ty+=dy}drawHarness()
 });
 harnessCanvas.addEventListener('pointerup',()=>{if(harnessDrag)pushHistory();harnessDrag=null});
}

document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$(v+'View').classList.add('active');renderAll()}


const harnessCanvas=$('harnessCanvas'),hctx=harnessCanvas?.getContext('2d');
let harnessBg=null,harnessDrag=null;
function loadHarnessBackground(){
 if(!harnessCanvas)return;
 harnessBg=new Image();harnessBg.onload=drawHarness;harnessBg.src='assets/harness-reference.png';
}
function harnessHit(p){
 for(let i=state.harnessItems.length-1;i>=0;i--){const it=state.harnessItems[i];
  if(it.type==='shackle'&&Math.hypot(p.x-it.x,p.y-it.y)<Math.max(it.w,it.h)/2)return it;
  if(it.type==='leader'){
   if(Math.hypot(p.x-it.x1,p.y-it.y1)<18)return {...it,handle:'start'};
   if(Math.hypot(p.x-it.x2,p.y-it.y2)<18)return {...it,handle:'end'};
   if(Math.abs(p.x-it.tx)<90&&Math.abs(p.y-it.ty)<28)return {...it,handle:'text'};
  }
 }return null;
}
function drawLoop(x,y,angle){
 hctx.save();hctx.translate(x,y);hctx.rotate(angle);hctx.strokeStyle='#111827';hctx.lineWidth=5;hctx.beginPath();hctx.ellipse(0,0,13,8,0,0,Math.PI*2);hctx.stroke();hctx.restore();
}
function drawHarness(){
 if(!harnessCanvas||!hctx)return;
 hctx.clearRect(0,0,harnessCanvas.width,harnessCanvas.height);hctx.fillStyle='#92949a';hctx.fillRect(0,0,harnessCanvas.width,harnessCanvas.height);
 if(harnessBg?.complete){
  const s=Math.min((harnessCanvas.width-30)/harnessBg.width,(harnessCanvas.height-30)/harnessBg.height);
  const w=harnessBg.width*s,h=harnessBg.height*s;hctx.drawImage(harnessBg,(harnessCanvas.width-w)/2,(harnessCanvas.height-h)/2,w,h);
 }
 for(const it of state.harnessItems){
  if(it.type==='shackle'){const im=img('assets/rigging-hardware/Bow Shackle Front.png');if(im.complete)hctx.drawImage(im,it.x-it.w/2,it.y-it.h/2,it.w,it.h)}
  if(it.type==='leader'){
   const a=Math.atan2(it.y2-it.y1,it.x2-it.x1);hctx.strokeStyle='#111827';hctx.lineWidth=5;hctx.beginPath();hctx.moveTo(it.x1,it.y1);hctx.lineTo(it.x2,it.y2);hctx.stroke();
   drawLoop(it.x1,it.y1,a);drawLoop(it.x2,it.y2,a);
   hctx.fillStyle='rgba(255,255,255,.94)';hctx.strokeStyle='#111827';hctx.lineWidth=1;hctx.fillRect(it.tx-88,it.ty-24,176,48);hctx.strokeRect(it.tx-88,it.ty-24,176,48);
   hctx.fillStyle='#111827';hctx.font='16px system-ui';hctx.textAlign='center';hctx.fillText('_______cm/m',it.tx,it.ty-3);hctx.fillText('3mm/6mm',it.tx,it.ty+17);
  }
  if(it.id===state.harnessSelectedId){hctx.strokeStyle='#0ea5e9';hctx.lineWidth=3;hctx.setLineDash([7,4]);if(it.type==='shackle')hctx.strokeRect(it.x-it.w/2-5,it.y-it.h/2-5,it.w+10,it.h+10);else{hctx.beginPath();hctx.moveTo(it.x1,it.y1);hctx.lineTo(it.x2,it.y2);hctx.stroke()}hctx.setLineDash([])}
 }
}
function harnessPoint(e){const r=harnessCanvas.getBoundingClientRect();return{x:(e.clientX-r.left)*harnessCanvas.width/r.width,y:(e.clientY-r.top)*harnessCanvas.height/r.height}}
function addHarnessShackle(){state.harnessItems.push({id:uid(),type:'shackle',x:450,y:420,w:95,h:95});state.harnessSelectedId=state.harnessItems.at(-1).id;pushHistory();drawHarness()}
function addHarnessLeader(){state.harnessItems.push({id:uid(),type:'leader',x1:330,y1:500,x2:570,y2:500,tx:450,ty:455});state.harnessSelectedId=state.harnessItems.at(-1).id;pushHistory();drawHarness()}
if(harnessCanvas){
 harnessCanvas.addEventListener('pointerdown',e=>{const p=harnessPoint(e),hit=harnessHit(p);state.harnessSelectedId=hit?.id||null;if(hit){harnessDrag={id:hit.id,handle:hit.handle||'body',start:p};harnessCanvas.setPointerCapture(e.pointerId)}drawHarness()});
 harnessCanvas.addEventListener('pointermove',e=>{if(!harnessDrag)return;const p=harnessPoint(e),it=state.harnessItems.find(x=>x.id===harnessDrag.id);if(!it)return;const dx=p.x-harnessDrag.start.x,dy=p.y-harnessDrag.start.y;harnessDrag.start=p;
  if(it.type==='shackle'){it.x+=dx;it.y+=dy}
  else if(harnessDrag.handle==='start'){it.x1+=dx;it.y1+=dy}
  else if(harnessDrag.handle==='end'){it.x2+=dx;it.y2+=dy}
  else if(harnessDrag.handle==='text'){it.tx+=dx;it.ty+=dy}
  else{it.x1+=dx;it.y1+=dy;it.x2+=dx;it.y2+=dy;it.tx+=dx;it.ty+=dy}drawHarness()
 });
 harnessCanvas.addEventListener('pointerup',()=>{if(harnessDrag)pushHistory();harnessDrag=null});
}

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll('.tool[data-tool]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tool[data-tool]').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.tool=b.dataset.tool});
$('saveBtn').onclick=saveProject;$('exportProjectBtn').onclick=exportProject;$('importProjectInput').onchange=e=>e.target.files[0]&&importProject(e.target.files[0]);$('projectName').oninput=pushHistory;$('newProjectBtn').onclick=newProject;
$('addSequenceBtn').onclick=addSequence;
$('addRigBtn').onclick=addRig;
$('saveRigBtn').onclick=saveCurrentRig;
$('sequenceSelect').onchange=e=>{state.currentSequenceId=e.target.value;state.currentRigId=currentSequence().rigs[0].id;selectRig(state.currentSequenceId,state.currentRigId)};
$('rigSelect').onchange=e=>selectRig(state.currentSequenceId,e.target.value);
$('sequenceColour').onchange=e=>{currentSequence().colour=e.target.value;pushHistory();renderAll()};
$('renameSequenceBtn').onclick=()=>{const s=currentSequence(),n=prompt('Sequence name:',s.name);if(n){s.name=n;pushHistory();renderAll()}};
$('deleteSequenceBtn').onclick=()=>{if(state.sequences.length<2)return alert('A project must contain at least one sequence.');if(confirm('Delete this sequence and its rigs?')){state.sequences=state.sequences.filter(s=>s.id!==state.currentSequenceId);state.currentSequenceId=state.sequences[0].id;state.currentRigId=state.sequences[0].rigs[0].id;pushHistory();renderAll()}};
$('renameRigBtn').onclick=()=>{const r=currentRig(),n=prompt('Rig / Move name:',r.name);if(n){r.name=n;const d=state.drawings.find(x=>x.id===r.drawingId);if(d)d.name=n;pushHistory();renderAll()}};
$('deleteRigBtn').onclick=()=>{const s=currentSequence();if(s.rigs.length<2)return alert('A sequence must contain at least one Rig / Move.');if(confirm('Delete this Rig / Move?')){const r=currentRig();state.drawings=state.drawings.filter(d=>d.id!==r.drawingId);state.calendar=state.calendar.filter(c=>c.drawingId!==r.drawingId);s.rigs=s.rigs.filter(x=>x.id!==r.id);state.currentRigId=s.rigs[0].id;pushHistory();renderAll()}};

$('deleteSelectedBtn').onclick=deleteSelected;$('addNoteBtn').onclick=addNote;$('objectLabelsToggle').checked=!!state.showObjectLabels;$('objectLabelsToggle').onchange=e=>{state.showObjectLabels=e.target.checked;pushHistory();draw()};$('duplicateBtn').onclick=duplicate;$('flipHBtn').onclick=()=>flip('flipH');$('flipVBtn').onclick=()=>flip('flipV');$('resetTransformBtn').onclick=resetTransform;$('perspectiveBtn').onclick=()=>{state.perspective=!state.perspective;$('perspectiveBtn').classList.toggle('active',state.perspective)};
['objName','objWidth','objHeight','objRotation','objOpacity','objColor','objNotes','noteFontSize','noteTextColor','noteBackgroundColor','noteBackgroundToggle','isLoadToggle','loadMassKg','pulleyRole','pulleyEfficiency','objectWllKg'].forEach(id=>$(id).onchange=updateInspector);
$('backgroundInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{pushHistory();state.background=r.result;loadBackground()};r.readAsDataURL(f)};$('backgroundOpacity').oninput=e=>{state.backgroundOpacity=+e.target.value;pushHistory();draw()};$('clearBackgroundBtn').onclick=()=>{pushHistory();state.background=null;loadBackground()};
$('customAssetInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>addAsset({name:f.name.replace(/\.[^.]+$/,''),type:'image',src:r.result,w:230,h:160,points:[]},canvas.width/2,canvas.height/2);r.readAsDataURL(f)};$('assetFilter').oninput=e=>renderAssets(e.target.value);
$('zoomInBtn').onclick=()=>setZoom(state.zoom+.1);$('zoomOutBtn').onclick=()=>setZoom(state.zoom-.1);$('fitBtn').onclick=()=>setZoom(Math.min((viewport.clientWidth-50)/canvas.width,(viewport.clientHeight-50)/canvas.height));$('undoBtn').onclick=()=>{if(state.history.length){state.future.push(snapshot());restore(state.history.pop())}};$('redoBtn').onclick=()=>{if(state.future.length){state.history.push(snapshot());restore(state.future.pop())}};
$('exportPngBtn').onclick=()=>{state.selectedId=null;draw();try{canvas.toBlob(b=>download(b,(state.projectName||'SimpleRig')+'.png'))}catch{alert('A remote image blocks export. Download and re-import it locally.')}};$('saveDrawingBtn').onclick=saveDrawing;$('markHaulEndBtn').onclick=markHaulEndMode;$('clearHaulEndBtn').onclick=clearHaulEnd;$('analyseRigBtn').onclick=analyseRig;$('clearAnalysisBtn').onclick=clearAnalysis;$('additionalLineTensionKg').value=state.additionalLineTensionKg??0;$('additionalLineTensionKg').addEventListener('change',e=>{state.additionalLineTensionKg=Math.max(0,+e.target.value||0);pushHistory();if(state.analysisVisible)analyseRig();else saveProject()});
$('liveSearchBtn').onclick=liveSearch;$('liveQuery').onkeydown=e=>{if(e.key==='Enter')liveSearch()};$('googleSearchBtn').onclick=()=>window.open('https://www.google.com/search?tbm=isch&q='+encodeURIComponent($('liveQuery').value||'stunt rigging equipment'),'_blank');
$('prevMonthBtn').onclick=()=>{state.month--;if(state.month<0){state.month=11;state.year--}renderCalendar()};$('nextMonthBtn').onclick=()=>{state.month++;if(state.month>11){state.month=0;state.year++}renderCalendar()};$('exportIcsBtn').onclick=exportICS;$('printCalendarBtn').onclick=()=>window.print();
$('saveHarnessNotesBtn').onclick=saveCurrentRig;
$('addHarnessShackleBtn').onclick=addHarnessShackle;
$('addHarnessLeaderBtn').onclick=addHarnessLeader;
$('deleteHarnessItemBtn').onclick=()=>{if(!state.harnessSelectedId)return;state.harnessItems=state.harnessItems.filter(x=>x.id!==state.harnessSelectedId);state.harnessSelectedId=null;pushHistory();drawHarness()};

['calcLoad','calcRatio','calcEfficiency','calcDisadvantage','calcRedirects'].forEach(id=>$(id).oninput=calculate);$('calculateBtn').onclick=calculate;
function setZoom(z){state.zoom=clamp(z,.25,2);canvas.style.transform=`scale(${state.zoom})`;canvas.style.marginRight=`${canvas.width*(state.zoom-1)}px`;canvas.style.marginBottom=`${canvas.height*(state.zoom-1)}px`;$('zoomLabel').textContent=Math.round(state.zoom*100)+'%'}
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveProject()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$('undoBtn').click()}if(e.key==='Delete'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName))deleteSelected()});
const current=localStorage.getItem('simplerig-pro-current'),ps=projectMap();if(current&&ps[current]){Object.assign(state,JSON.parse(ps[current].data));$('projectName').value=state.projectName;$('harnessNotes').value=state.harnessNotes||'';loadBackground()}else saveProject();
ensureHierarchy();loadHarnessBackground();renderAssets();setZoom(1);renderAll();calculate();
})();
