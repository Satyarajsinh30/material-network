'use strict';
let catalog;
let category = 'all';
let toastTimer;
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function metalArt(item, suffix) {
  const id = `${item.id}-${suffix}`;
  const brass = item.tone === 'brass';
  const dark = item.tone === 'steel';
  const colors = brass ? ['#f0d391','#b89752','#dec280','#8c713c'] : dark ? ['#a4b0a1','#5e7567','#8b9c8b','#41594b'] : ['#edf0e9','#9bafa3','#d0dcd1','#708b7b'];
  let shape;
  if (item.type === 'round') shape = `<path d="M76 127 180 67 Q211 48 224 79 L118 141Z" fill="url(#${id})"/><ellipse cx="96" cy="133" rx="27" ry="19" transform="rotate(29 96 133)" fill="${colors[2]}" stroke="${colors[0]}"/><ellipse cx="96" cy="133" rx="19" ry="12" transform="rotate(29 96 133)" fill="none" stroke="${colors[3]}" opacity=".2"/><path d="M103 111 192 60" stroke="${colors[0]}" opacity=".65"/>`;
  else shape = `<path d="M59 104 162 46 241 90 138 150Z" fill="url(#${id})"/><path d="M138 150 241 90 241 ${item.type==='flat'?108:123} 138 ${item.type==='flat'?168:183}Z" fill="${colors[3]}"/><path d="M59 104 138 150 138 ${item.type==='flat'?168:183} 59 ${item.type==='flat'?122:137}Z" fill="${colors[1]}"/><path d="M68 104 161 53 230 90" fill="none" stroke="${colors[0]}" opacity=".7"/>`;
  return `<svg viewBox="0 0 300 210" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".3" stop-color="${colors[1]}"/><stop offset=".55" stop-color="${colors[2]}"/><stop offset="1" stop-color="${colors[3]}"/></linearGradient></defs><ellipse cx="150" cy="166" rx="98" ry="16" fill="#4b614f" opacity=".1"/>${shape}</svg>`;
}

function render() {
  const query = $('#search').value.toLowerCase().trim();
  const shape = $('#shape').value;
  const matches = catalog.materials.filter(item => (category==='all'||item.category===category) && (shape==='all'||item.shape===shape) && `${item.name} ${item.grade} ${item.dimensions} ${item.shape} ${item.make||''} ${(item.lengths||[]).join(' ')}`.toLowerCase().includes(query));
  $('#result-count').textContent = `${matches.length} ${catalog.demo ? 'example' : ''} listing${matches.length===1?'':'s'}`;
  $('#empty-state').hidden = matches.length !== 0;
  $('#material-grid').classList.toggle('single-stock',catalog.materials.length===1);
  $('#material-grid').innerHTML = matches.map(item => `<article class="material-card"><div class="material-art ${escapeHTML(item.tone)}">${item.photos?.length?`<img class="stock-photo" src="${escapeHTML(item.photos[0])}" alt="EN8 D round bar stock at Navjyot, photographed by the seller" loading="lazy"><span class="photo-label">WORKSHOP PHOTO</span>`:`${catalog.demo?'<span class="sample-tag">EXAMPLE LISTING</span>':''}${metalArt(item,'card')}<span class="illustration-label">ILLUSTRATION</span>`}</div><div class="card-content"><div class="card-category">${escapeHTML(item.category)} · ${escapeHTML(item.id)}</div><h3>${escapeHTML(item.name)}</h3><div class="card-dimensions">${escapeHTML(item.dimensions)} diameter</div>${item.lengths?`<div class="length-tags">${item.lengths.map(length=>`<span>${length} mm</span>`).join('')}</div>`:''}<div class="card-specs"><span>${escapeHTML(item.shape)}</span><i></i><span>${escapeHTML(item.quantity)}</span></div>${item.make?`<p class="stock-meta">Make: ${escapeHTML(item.make)} &nbsp; · &nbsp; Purchased ${escapeHTML(item.purchaseYear)}</p><p class="stock-status">Seller-reported stock · ${escapeHTML(item.updated)}</p>`:''}<div class="card-seller">${catalog.seller.networkVerified?'<span class="mini-check" aria-label="Network verified">✓</span>':''}${escapeHTML(catalog.seller.name)}</div><div class="card-bottom"><span>${catalog.demo?'Stock unconfirmed':'Ask for price & quantity'}</span><button data-detail="${escapeHTML(item.id)}" aria-label="View ${escapeHTML(item.name)} details">View details ↗</button></div></div></article>`).join('');
}

function showToast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500);
}

function openDialog(id) {
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  $(id).showModal();
}

function whatsapp(message) {
  const url = `https://wa.me/${catalog.seller.whatsapp}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
}

async function share(url, title, text) {
  try {
    if (navigator.share) await navigator.share({url,title,text});
    else {await navigator.clipboard.writeText(url);showToast('Link copied. Share it with your workshop network.');}
  } catch(error) {
    if(error.name!=='AbortError') {window.prompt('Copy this link to share:',url);}
  }
}

function detail(id) {
  const item=catalog.materials.find(item=>item.id===id);
  if(!item)return;
  const gallery=item.photos?.length ? `<div class="stock-gallery"><img id="gallery-photo" src="${escapeHTML(item.photos[0])}" alt="Seller photo 1 of EN8 D stock at Navjyot"><div class="gallery-bottom"><span>Seller photos · mixed lengths</span><a id="full-photo" href="${escapeHTML(item.photos[0])}" target="_blank" rel="noopener noreferrer">Open full photo ↗</a></div><div class="gallery-thumbs" role="group" aria-label="Stock photos">${item.photos.map((photo,index)=>`<button data-photo="${index}" aria-label="View stock photo ${index+1}" aria-pressed="${index===0}"><img src="${escapeHTML(photo)}" alt="" loading="lazy"></button>`).join('')}</div></div>` : `<div class="material-art detail-art ${escapeHTML(item.tone)}">${catalog.demo?'<span class="sample-tag">EXAMPLE LISTING · NOT CONFIRMED STOCK</span>':''}${metalArt(item,'detail')}<span class="illustration-label">ILLUSTRATION</span></div>`;
  $('#detail-content').innerHTML = `${gallery}<div class="card-category">${escapeHTML(item.category)} · ${escapeHTML(item.id)}</div><h2>${escapeHTML(item.name)}</h2><dl class="detail-specs"><div><dt>${catalog.demo?'Example dimensions':'Diameter'}</dt><dd>${escapeHTML(item.dimensions)}</dd></div><div><dt>Total stock, all lengths</dt><dd>${escapeHTML(item.quantity)}</dd></div><div><dt>Material grade</dt><dd>${escapeHTML(item.grade)}</dd></div><div><dt>Lengths</dt><dd>${(item.lengths||[]).map(escapeHTML).join(' / ')} mm</dd></div><div><dt>Make (seller stated)</dt><dd>${escapeHTML(item.make||'Confirm with seller')}</dd></div><div><dt>Purchase year</dt><dd>${escapeHTML(item.purchaseYear||'Confirm with seller')}</dd></div><div><dt>Price / minimum order</dt><dd>Confirm with seller</dd></div><div><dt>Stock reported</dt><dd>${escapeHTML(item.updated||'Confirm with seller')}</dd></div></dl><p class="detail-note">${escapeHTML(item.note)}</p><p class="detail-seller">${escapeHTML(catalog.seller.name)} · ${escapeHTML(catalog.seller.location)}</p><div class="listing-inquiry"><label for="inquiry-length">Preferred length</label><select id="inquiry-length"><option value="Please advise">Please advise / any length</option>${(item.lengths||[]).map(length=>`<option value="${length} mm">${length} mm</option>`).join('')}</select><label for="inquiry-quantity">Quantity needed <span class="optional">Optional</span></label><input id="inquiry-quantity" placeholder="e.g. 5 bars or 100 kg" maxlength="100"></div><div class="detail-actions"><button id="inquire-item" class="button button-dark">Ask on WhatsApp <span>↗</span></button><button id="share-item" class="share-detail" aria-label="Share this listing">Share</button></div><p class="form-note">Confirm grade documents, condition, available quantity, price and pickup.</p>`;
  document.querySelectorAll('[data-photo]').forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.photo);
    $('#gallery-photo').src=item.photos[index];
    $('#gallery-photo').alt=`Seller photo ${index+1} of EN8 D stock at Navjyot`;
    $('#full-photo').href=item.photos[index];
    document.querySelectorAll('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
  $('#inquire-item').onclick=()=>whatsapp(`Hello Navjyot Engineering, I am interested in listing ${item.id}: ${item.name}.\n\nGrade: ${item.grade}\nDiameter: ${item.dimensions}\nPreferred length: ${$('#inquiry-length').value}\nQuantity required: ${$('#inquiry-quantity').value.trim()||'To discuss'}\nMake: ${item.make}\nPurchase year: ${item.purchaseYear}\n\nI saw approximately 4 tonnes listed across all lengths. Please confirm current quantity in my preferred length, condition, material documents, price, minimum order and pickup details.`);
  $('#share-item').onclick=()=>{const url=new URL(window.location.href);url.hash=`material=${encodeURIComponent(item.id)}`;share(url.href,item.name,`${item.name} · ${item.dimensions} · ${item.quantity}. Ask Navjyot about availability.`);};
  openDialog('#detail-dialog');
}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-request]'))openDialog('#request-dialog');
  const closer=event.target.closest('[data-close]');if(closer)closer.closest('dialog').close();
  const detailButton=event.target.closest('[data-detail]');if(detailButton)detail(detailButton.dataset.detail);
});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));
$('#search').addEventListener('input',()=>catalog&&render());
$('#shape').addEventListener('change',()=>catalog&&render());
$('#filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-category]');if(!button)return;
  category=button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(catalog)render();
});
$('#clear-filters').onclick=()=>{$('#search').value='';$('#shape').value='all';$('[data-category="all"]').click();};
$('#share-site').onclick=()=>{const url=new URL(window.location.href);url.hash='';share(url.href,'Navjyot Materials','Small quantities of raw material for Ahmedabad workshops. Explore the pilot and send your requirement.');};
$('#verification-button').onclick=$('#footer-verification').onclick=()=>openDialog('#verification-dialog');
$('#request-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(!catalog){showToast('Seller details are still loading. Please try again.');return;}
  const data=new FormData(event.target);
  whatsapp(`Hello Navjyot Engineering, I have a material requirement from Navjyot Materials.\n\nMaterial: ${data.get('material')}\nGrade: ${data.get('grade')||'Please advise / to be confirmed'}\nQuantity: ${data.get('quantity')}\nDimensions / shape: ${data.get('dimensions')}\n${data.get('notes')?`Additional details: ${data.get('notes')}\n`:''}\nPlease confirm available stock, condition, documentation, price and pickup details.`);
});
function readHash(){if(location.hash.startsWith('#material='))detail(decodeURIComponent(location.hash.slice(10)));}
window.addEventListener('hashchange',()=>{if(catalog)readHash();});
fetch('catalog.json').then(response=>{if(!response.ok)throw new Error('Catalog unavailable');return response.json();}).then(data=>{
  catalog=data;
  render();readHash();
}).catch(()=>{$('#result-count').textContent='Catalog could not load. Please refresh.';$('#material-grid').innerHTML='<p>Having trouble loading materials? You can still <a href="https://wa.me/919978441381?text=Hello%20Navjyot%20Engineering%2C%20I%20have%20a%20material%20requirement." target="_blank" rel="noopener noreferrer">contact Navjyot on WhatsApp ↗</a>.</p>';});
