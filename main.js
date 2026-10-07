import {PROJECTS} from './projects.js';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const init=()=>{document.documentElement.classList.add('ready');$('#year')&&($('#year').textContent=new Date().getFullYear());setupLoader();setupMenu();setupCursor();setupTilt();setupReveal();renderProjects();setupFilters();renderProjectDetail();setupContact()};
function setupLoader(){const l=$('.loader');if(!l)return;window.addEventListener('load',()=>setTimeout(()=>l.classList.add('done'),650));setTimeout(()=>l.classList.add('done'),1800)}
function setupMenu(){const b=$('.menu-btn'),m=$('.mobile-menu'),c=$('.menu-close');if(!b||!m)return;b.onclick=()=>m.classList.add('open');c?.addEventListener('click',()=>m.classList.remove('open'));$$('.mobile-menu a').forEach(a=>a.onclick=()=>m.classList.remove('open'))}
function setupCursor(){const d=$('.cursor-dot'),r=$('.cursor-ring');if(!d||!r||matchMedia('(pointer:coarse)').matches)return;let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;d.style.left=x+'px';d.style.top=y+'px'});const tick=()=>{rx+=(x-rx)*.14;ry+=(y-ry)*.14;r.style.left=rx+'px';r.style.top=ry+'px';requestAnimationFrame(tick)};tick();$$('a,button,.project-card,input,textarea,select').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'))})}
function setupTilt(){if(matchMedia('(pointer:coarse)').matches)return;$$('[data-tilt]').forEach(el=>{const strength=+el.dataset.tiltStrength||8;el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1200px) rotateX(${-y*strength}deg) rotateY(${x*strength}deg)`});el.addEventListener('mouseleave',()=>el.style.transform='')})}
function setupReveal(){const els=$$('.reveal');if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('visible'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e))}
function card(p){return `<a class="project-card reveal" href="project.html?id=${p.id}" data-category="${p.category}"><div class="project-image"><img loading="lazy" src="${p.cover}" alt="${p.title} architecture project"></div><div class="project-info"><div><strong>${p.title}</strong><br><small>${p.category} · ${p.location}</small></div><span>${p.year} ↗</span></div></a>`}
function renderProjects(){const f=$('#featured-projects'),a=$('#all-projects');if(f)f.innerHTML=PROJECTS.slice(0,4).map(card).join('');if(a)a.innerHTML=PROJECTS.map(card).join('');}
function setupFilters(){const wrap=$('#filters');if(!wrap)return;wrap.addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;$$('.filter',wrap).forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;$$('#all-projects .project-card').forEach(c=>{c.style.display=f==='all'||c.dataset.category===f?'block':'none'})})}
function renderProjectDetail(){const root=$('#project-detail');if(!root)return;const id=new URLSearchParams(location.search).get('id')||PROJECTS[0].id,p=PROJECTS.find(x=>x.id===id)||PROJECTS[0];root.innerHTML=`<section class="detail-hero"><p class="eyebrow">${p.category} / ${p.year}</p><h1 class="detail-title">${p.title}</h1><div class="detail-meta"><div>Location<b>${p.location}</b></div><div>Area<b>${p.area}</b></div><div>Status<b>${p.status}</b></div><div>Type<b>${p.category}</b></div></div></section><div class="detail-hero-image"><img src="${p.cover}" alt="${p.title}"></div><section class="detail-body"><div class="detail-description"><div><p class="eyebrow">Project / ${p.year}</p></div><div><p class="large-copy">${p.description}</p></div></div><div class="gallery">${p.images.map((im,i)=>`<img loading="lazy" src="${im}" alt="${p.title} view ${i+1}">`).join('')}</div><div class="viewer-wrap"><p class="eyebrow">Interactive model</p><h2>Explore the project in 3D.</h2><div class="viewer" id="viewer" data-model="${p.model}"><div class="viewer-controls"><span>HOLD + DRAG TO ORBIT</span><span>SCROLL TO ZOOM</span></div></div><p class="form-note">Place the exported Archicad GLB/GLTF file at <code>${p.model}</code>. If the file is absent, the viewer shows a fallback architectural placeholder.</p></div></section>`;initViewer($('#viewer'),p)}
async function initViewer(el,p){
 if(!el)return;
 const {default:THREE}=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
 const {OrbitControls}=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js');
 const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js');
 const scene=new THREE.Scene(); scene.background=new THREE.Color(0x11110f);
 const camera=new THREE.PerspectiveCamera(38,el.clientWidth/el.clientHeight,.05,200); camera.position.set(7,4.5,9);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(el.clientWidth,el.clientHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.localClippingEnabled=true; el.prepend(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.target.set(0,1,0); controls.minDistance=1.5; controls.maxDistance=40; controls.enablePan=true;
 const ambient=new THREE.HemisphereLight(0xffffff,0x333333,1.8); scene.add(ambient);
 const sun=new THREE.DirectionalLight(0xfff1cf,3.2); sun.position.set(5,10,5); scene.add(sun);
 const moon=new THREE.DirectionalLight(0x7f9bcf,0.35); moon.position.set(-5,7,-4); scene.add(moon);
 const grid=new THREE.GridHelper(20,40,0x333333,0x202020); grid.position.y=-1; scene.add(grid);
 const fallback=new THREE.Group(); const fmat=new THREE.MeshStandardMaterial({color:0xd5d0c5,roughness:.75});
 const base=new THREE.Mesh(new THREE.BoxGeometry(5,.6,3.5),fmat); base.position.y=-.65; fallback.add(base);
 for(let i=0;i<5;i++){const box=new THREE.Mesh(new THREE.BoxGeometry(3.8,.55,2.5),fmat);box.position.set(0,i*.55-.25,0);fallback.add(box)} scene.add(fallback);
 let model=null, modelRoot=null, materials=new Map(), componentNodes=new Map(), floorNodes=new Map(), roofNodes=[], exteriorNodes=[], interiorNodes=[];
 let sectionEnabled=false, sectionValue=.5, mode='exterior', night=false;
 const controlsPanel=document.createElement('div'); controlsPanel.className='viewer-config';
 controlsPanel.innerHTML=`<div class="viewer-config-head"><strong>MODEL CONTROLS</strong><button type="button" data-action="collapse" aria-label="Collapse controls">−</button></div><div class="viewer-config-body">
 <div class="viewer-group"><span>LIGHT</span><div class="viewer-buttons"><button class="vbtn active" data-light="day">Day</button><button class="vbtn" data-light="night">Night</button></div></div>
 <div class="viewer-group"><span>VIEW</span><div class="viewer-buttons"><button class="vbtn active" data-mode="exterior">Exterior</button><button class="vbtn" data-mode="interior">Interior</button></div></div>
 <div class="viewer-group"><span>FLOORS</span><div class="viewer-buttons" data-floors><button class="vbtn active" data-floor="all">All</button></div></div>
 <div class="viewer-group"><span>MATERIALS</span><div class="viewer-buttons" data-materials><button class="vbtn active" data-material="original">Original</button></div></div>
 <div class="viewer-group"><span>ROOF</span><div class="viewer-buttons"><button class="vbtn active" data-roof="show">Visible</button><button class="vbtn" data-roof="hide">Hidden</button></div></div>
 <div class="viewer-group"><span>SECTION CUT</span><div class="viewer-buttons"><button class="vbtn active" data-section="off">Off</button><button class="vbtn" data-section="on">On</button></div><input class="section-slider" type="range" min="0" max="100" value="50" aria-label="Section cut position"></div>
 <div class="viewer-group"><span>COMPONENTS</span><div class="component-list" data-components><em>Loaded model components appear here.</em></div></div>
 <button class="viewer-reset" data-action="reset">Reset view</button></div>`;
 el.appendChild(controlsPanel);
 const footerHint=document.createElement('div'); footerHint.className='viewer-controls'; footerHint.innerHTML='<span>HOLD + DRAG TO ORBIT</span><span>SCROLL TO ZOOM</span>'; el.appendChild(footerHint);
 const q=s=>controlsPanel.querySelector(s), qa=s=>[...controlsPanel.querySelectorAll(s)];
 function setButtons(attr,value){qa(`[data-${attr}]`).forEach(b=>b.classList.toggle('active',b.dataset[attr]===value));}
 function isFloor(name){return /(?:^|[_ -])floor[_ -]?\d+/i.test(name)||/^level[_ -]?\d+/i.test(name);}
 function floorId(name){const m=name.match(/(?:floor|level)[_ -]?(\d+)/i);return m?m[1]:null;}
 function isRoof(name){return /roof|parapet|canopy/i.test(name)}
 function isInterior(name){return /interior|inside|furniture|fixture|kitchen|bath|bed|wardrobe|ceiling/i.test(name)}
 function isExterior(name){return /exterior|facade|façade|window|door|wall|slab|column|stair|landscape/i.test(name)}
 function visibleForMode(node){ if(mode==='interior') return !exteriorNodes.includes(node) || interiorNodes.includes(node); return !interiorNodes.includes(node); }
 function applyVisibility(){
   if(!modelRoot)return;
   modelRoot.traverse(o=>{if(!o.isMesh)return; let visible=true;
     if(roofNodes.includes(o)) visible=q('[data-roof="show"]').classList.contains('active');
     if(mode==='interior' && exteriorNodes.includes(o)) visible=false;
     if(mode==='exterior' && interiorNodes.includes(o)) visible=false;
     const selected=q('[data-floor].active')?.dataset.floor || 'all'; const fid=floorId(o.name);
     if(fid && selected!=='all' && fid!==selected) visible=false;
     const selectedComponent=qa('[data-component].active').map(x=>x.dataset.component);
     if(selectedComponent.length && !selectedComponent.includes('all')) visible=selectedComponent.includes(o.userData.twpComponentId||'') ? visible : false;
     o.visible=visible;
   });
 }
 function addFloorButtons(){
   const wrap=q('[data-floors]'); const ids=[...floorNodes.keys()].sort((a,b)=>Number(a)-Number(b)); ids.forEach(id=>{const b=document.createElement('button');b.className='vbtn';b.dataset.floor=id;b.textContent=`Floor ${id}`;wrap.appendChild(b)});
 }
 function addMaterialButtons(){
   const wrap=q('[data-materials]'); [...materials.keys()].sort().slice(0,12).forEach(name=>{const b=document.createElement('button');b.className='vbtn';b.dataset.material=name;b.textContent=name;wrap.appendChild(b)});
 }
 function addComponentButtons(){
   const wrap=q('[data-components]'); wrap.innerHTML='<button class="vbtn active" data-component="all">All</button>';
   [...componentNodes.keys()].sort().slice(0,24).forEach(id=>{const b=document.createElement('button');b.className='vbtn';b.dataset.component=id;b.textContent=id.replaceAll('_',' ');wrap.appendChild(b)});
 }
 function originalMaterials(){ if(!modelRoot)return; modelRoot.traverse(o=>{if(o.isMesh){o.userData.twpOriginalMaterial=o.material;}}); }
 function applyMaterial(name){
   if(!modelRoot)return; modelRoot.traverse(o=>{if(!o.isMesh||!o.userData.twpOriginalMaterial)return; if(name==='original'){o.material=o.userData.twpOriginalMaterial;return;} if(materials.has(name)){const source=materials.get(name); o.material=source.clone();}});
 }
 function updateSection(){ if(!modelRoot)return; const box=new THREE.Box3().setFromObject(modelRoot), size=box.getSize(new THREE.Vector3()), min=box.min.y, max=box.max.y; sectionPlane.constant=-(min+(max-min)*sectionValue); renderer.clippingPlanes=sectionEnabled?[sectionPlane]:[]; sectionHelper.visible=sectionEnabled; }
 const sectionPlane=new THREE.Plane(new THREE.Vector3(0,-1,0),0); const sectionHelper=new THREE.PlaneHelper(sectionPlane,8,0xffb36b); sectionHelper.visible=false; scene.add(sectionHelper);
 controlsPanel.addEventListener('click',e=>{
   const b=e.target.closest('button'); if(!b)return;
   if(b.dataset.action==='collapse'){controlsPanel.classList.toggle('collapsed');b.textContent=controlsPanel.classList.contains('collapsed')?'+':'−';return}
   if(b.dataset.action==='reset'){camera.position.set(7,4.5,9);controls.target.set(0,1,0);controls.update();return}
   if(b.dataset.light){night=b.dataset.light==='night';setButtons('light',b.dataset.light);sun.intensity=night?.65:3.2;moon.intensity=night?1.8:.35;ambient.intensity=night?.5:1.8;scene.background.set(night?0x070b16:0x11110f);grid.visible=!night;return}
   if(b.dataset.mode){mode=b.dataset.mode;setButtons('mode',mode);applyVisibility();return}
   if(b.dataset.floor){setButtons('floor',b.dataset.floor);applyVisibility();return}
   if(b.dataset.material){setButtons('material',b.dataset.material);applyMaterial(b.dataset.material);return}
   if(b.dataset.roof){setButtons('roof',b.dataset.roof);applyVisibility();return}
   if(b.dataset.section){sectionEnabled=b.dataset.section==='on';setButtons('section',b.dataset.section);updateSection();return}
   if(b.dataset.component){if(b.dataset.component==='all'){qa('[data-component]').forEach(x=>x.classList.remove('active'));b.classList.add('active');}else{q('[data-component="all"]')?.classList.remove('active');b.classList.toggle('active');}applyVisibility();}
 });
 q('.section-slider').addEventListener('input',e=>{sectionValue=Number(e.target.value)/100;updateSection()});
 try{
   const gltf=await new GLTFLoader().loadAsync(p.model); fallback.visible=false; modelRoot=gltf.scene; model=modelRoot; scene.add(modelRoot);
   modelRoot.traverse(o=>{
     if(!o.name)return;
     if(o.isMesh){o.castShadow=true;o.receiveShadow=true; o.userData.twpOriginalMaterial=o.material; const mats=Array.isArray(o.material)?o.material:[o.material]; mats.forEach(m=>{if(m?.name){if(!materials.has(m.name))materials.set(m.name,m);}}); const fid=floorId(o.name); if(fid){if(!floorNodes.has(fid))floorNodes.set(fid,[]);floorNodes.get(fid).push(o)};
       if(isRoof(o.name))roofNodes.push(o); if(isInterior(o.name))interiorNodes.push(o); if(isExterior(o.name))exteriorNodes.push(o);
       const component=o.name.split(/[.:/]/)[0]||o.name; o.userData.twpComponentId=component; if(!componentNodes.has(component))componentNodes.set(component,[]);
     }
   });
   originalMaterials(); addFloorButtons(); addMaterialButtons(); addComponentButtons(); applyVisibility(); updateSection();
 }catch(e){ console.warn('GLB/GLTF not found; using fallback model.',e); }
 const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)}; addEventListener('resize',resize);
 const animate=()=>{requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}; animate();
}
function setupContact(){const f=$('#contact-form');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f),subject=encodeURIComponent(`Project inquiry — ${d.get('type')}`),body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nProject type: ${d.get('type')}\n\n${d.get('message')}`);location.href=`mailto:thewonderspalace@gmail.com?subject=${subject}&body=${body}`})}
init();
