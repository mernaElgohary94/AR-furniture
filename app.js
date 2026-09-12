import { PRODUCTS } from '/catalogue/products.js';
import { MATERIALS } from '/catalogue/materials.js';

function productSlugFromURL() {
  const routeMatch = location.pathname.match(/^\/products\/([^/]+)/);
  return routeMatch ? routeMatch[1] : new URLSearchParams(location.search).get('product') || 'onda-chair';
}

const activeProduct = PRODUCTS[productSlugFromURL()] || PRODUCTS['onda-chair'];
const PARTS = activeProduct.parts;
const isARHandoff = new URLSearchParams(location.search).get('ar') === '1';
const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const $ = (id) => document.getElementById(id);
const viewer = () => $('product-model');
let activePart = PARTS[0].id;
let selections = Object.fromEntries(PARTS.map((part) => [part.id, part.defaultMaterial]));
let requestId = 0;
const materialById = (id) => MATERIALS.find((item) => item.id === id);
// Add `baseColor`, `normal`, `roughness`, and `thumbnail` URLs to any MATERIALS
// item to replace its generated placeholder texture with production PBR texture maps.
const textureSource = (material) => material.baseColor || svgTexture(material);
const thumbnailSource = (material) => material.thumbnail || textureSource(material);

function svgTexture(material) {
  const one = material.colours[0], two = material.colours[1];
  const patterns = {
    weave: '<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="' + one + '"/><path d="M0 3h14M0 10h14M3 0v14M10 0v14" stroke="' + two + '" stroke-width="1.7" opacity=".64"/></pattern>',
    herringbone: '<pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="' + one + '"/><path d="M-5 0 5 10-5 20M4-2l10 10L4 18M13-2l10 10-10 10" fill="none" stroke="' + two + '" stroke-width="3" opacity=".72"/></pattern>',
    boucle: '<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="' + one + '"/><circle cx="3" cy="4" r="2.4" fill="' + two + '"/><circle cx="10" cy="10" r="2.8" fill="' + two + '" opacity=".8"/></pattern>',
    leather: '<filter id="n"><feTurbulence baseFrequency=".65" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .13 0"/></filter><rect width="100%" height="100%" fill="' + one + '"/><rect width="100%" height="100%" filter="url(#n)" fill="' + two + '"/>',
    metal: '<linearGradient id="p" x2="0" y2="1"><stop stop-color="' + two + '"/><stop offset=".42" stop-color="' + one + '"/><stop offset="1" stop-color="' + two + '"/></linearGradient>'
  };
  const fill = material.pattern === 'leather' ? '' : '<rect width="100%" height="100%" fill="url(#p)"/>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">' + patterns[material.pattern] + fill + '</svg>');
}
function setConfigurationFromURL() {
  const params = new URLSearchParams(location.search);
  PARTS.forEach((part) => { const value = params.get(part.id); if (materialById(value)) selections[part.id] = value; });
}
function configurationURL() {
  const url = new URL(location.href); url.pathname = '/products/' + activeProduct.slug; url.search = '';
  PARTS.forEach((part) => url.searchParams.set(part.id, selections[part.id]));
  return url.toString();
}
function syncURL() { history.replaceState({}, '', configurationURL()); }
function arHandoffURL() {
  const url = new URL(configurationURL());
  url.searchParams.set('ar', '1');
  return url.toString();
}
function renderParts() {
  $('part-options').innerHTML = PARTS.map((part) => {
    const material = materialById(selections[part.id]);
    return '<button class="part-button ' + (part.id === activePart ? 'selected' : '') + '" data-part="' + part.id + '" role="tab" aria-selected="' + (part.id === activePart) + '"><i style="background-image:url(' + thumbnailSource(material) + ')"></i><span>' + part.label + '</span><b>' + material.name + '</b></button>';
  }).join('');
  document.querySelectorAll('[data-part]').forEach((button) => button.onclick = () => { activePart = button.dataset.part; renderParts(); renderMaterials(); });
}
function renderMaterials() {
  const query = $('material-search').value.trim().toLowerCase();
  const allowedFamilies = PARTS.find((part) => part.id === activePart).families;
  const filtered = MATERIALS.filter((item) => allowedFamilies.includes(item.family) && (item.family + ' ' + item.name).toLowerCase().includes(query));
  const families = [...new Set(filtered.map((item) => item.family))];
  $('material-groups').innerHTML = families.length ? families.map((family) => {
    const choices = filtered.filter((item) => item.family === family);
    const cards = choices.map((item) => '<button class="material-card ' + (selections[activePart] === item.id ? 'selected' : '') + '" data-material="' + item.id + '" aria-label="' + item.family + ' ' + item.name + '"><i style="background-image:url(' + thumbnailSource(item) + ')"></i><span>' + item.name + '</span></button>').join('');
    return '<details class="material-family" open><summary><span>−</span> ' + family + '<em>' + choices.length + '</em></summary><div class="material-grid">' + cards + '</div></details>';
  }).join('') : '<p class="empty-state">No materials match your search.</p>';
  document.querySelectorAll('[data-material]').forEach((button) => button.onclick = async () => {
    selections[activePart] = button.dataset.material; syncURL(); renderParts(); renderMaterials(); renderSummary(); await applyPart(activePart);
  });
}
function findTarget(part) {
  const materials = viewer().model?.materials || [];
  const names = PARTS.find((item) => item.id === part).targets.map((name) => name.toLowerCase());
  return materials.find((item) => names.includes((item.name || '').toLowerCase()));
}
async function applyPart(part) {
  const target = findTarget(part);
  if (!target || !viewer().model) return;
  const job = ++requestId, material = materialById(selections[part]);
  const hex = material.colours[0].replace('#', '');
  const colour = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  // Show the selected colour first; this remains visible if an image map fails
  // to load because of a missing URL or a browser CORS restriction.
  target.pbrMetallicRoughness.setBaseColorFactor([...colour, 1]);
  target.pbrMetallicRoughness.setRoughnessFactor(part === 'metal' ? .32 : .8);
  target.pbrMetallicRoughness.setMetallicFactor(part === 'metal' ? .8 : 0);
  try {
    const texture = await viewer().createTexture(textureSource(material));
    if (job !== requestId) return;
    target.pbrMetallicRoughness.setBaseColorTexture(texture);
    // Both production maps and the generated placeholder map already contain
    // colour. A white multiplier avoids tinting the fabric twice.
    target.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
    if (part === 'upholstery') {
      // The source GLB's velvet material contains an orange sheen. Remove it
      // for configurator fabrics so the selected map determines the colour.
      target.setSheenColorFactor([0, 0, 0]);
      target.setSheenRoughnessFactor(1);
    }
    if (material.normal && target.normalTexture) target.normalTexture.setTexture(await viewer().createTexture(material.normal));
    if (material.roughness) target.pbrMetallicRoughness.setRoughnessTexture(await viewer().createTexture(material.roughness));
  } catch (error) {
    console.warn('Material texture could not load; showing selected colour instead.', error);
  }
}
async function applyAllParts() { for (const part of PARTS) await applyPart(part.id); }
function renderSummary() {
  $('selected-summary').innerHTML = '<p>Your configuration</p>' + PARTS.map((part) => { const item = materialById(selections[part.id]); return '<div><span>' + part.label + '</span><strong>' + item.family + ' — ' + item.name + '</strong></div>'; }).join('');
}
function renderProductDetails() {
  $('product-code').textContent = activeProduct.code;
  $('product-type').textContent = activeProduct.type;
  $('product-eyebrow').textContent = activeProduct.type.toUpperCase() + ' / ' + activeProduct.code;
  $('product-name').textContent = activeProduct.name;
  $('product-description').textContent = activeProduct.description;
  $('product-width').textContent = activeProduct.dimensions.width;
  $('product-depth').textContent = activeProduct.dimensions.depth;
  $('product-height').textContent = activeProduct.dimensions.height;
  viewer().setAttribute('alt', 'Configured ' + activeProduct.name);
}
function openQR() {
  const url = arHandoffURL(); $('config-link').href = url; $('config-link').textContent = url.replace(/^https?:\/\//, '');
  $('qr-code').replaceChildren();
  if (window.QRCode) new QRCode($('qr-code'), { text: url, width: 190, height: 190, correctLevel: QRCode.CorrectLevel.M });
  $('qr-modal').showModal();
}
async function launchAR(button) {
  try {
    button.disabled = true;
    await viewer().activateAR();
    button.disabled = false;
  } catch (error) {
    button.disabled = false;
    $('fallback').hidden = false;
    $('fallback').textContent = 'AR could not start on this device. Open this page in Safari on iPhone/iPad or Chrome on Android, over HTTPS.';
  }
}
function prepareARHandoff() {
  if (!isARHandoff) return;
  const selectionText = PARTS.map((part) => {
    const material = materialById(selections[part.id]);
    return part.label + ': ' + material.name;
  }).join(' · ');
  $('ar-handoff-summary').textContent = activeProduct.name + ' — ' + selectionText;
  $('ar-handoff').hidden = false;
  if (viewer().canActivateAR) {
    $('start-ar').disabled = false;
  } else {
    $('start-ar').disabled = true;
    $('ar-handoff-summary').textContent = 'AR is not available in this browser. Open this link in Safari on iPhone/iPad or Chrome on an ARCore-compatible Android phone.';
  }
}
$('material-search').addEventListener('input', renderMaterials);
if (isMobileDevice) {
  $('qr-button').innerHTML = 'Open in AR <span>↗</span>';
  $('qr-button').onclick = () => launchAR($('qr-button'));
} else {
  $('qr-button').innerHTML = 'Open in AR <span>QR ↗</span>';
  $('qr-button').onclick = openQR;
}
$('qr-close').onclick = () => $('qr-modal').close();
$('start-ar').onclick = () => launchAR($('start-ar'));
viewer().addEventListener('load', async () => { await applyAllParts(); prepareARHandoff(); });
viewer().addEventListener('ar-status', (event) => { if (event.detail.status === 'failed') { $('fallback').hidden = false; $('fallback').textContent = 'AR could not start. Use HTTPS and a compatible phone browser.'; } });
setConfigurationFromURL();
renderProductDetails();
viewer().setAttribute('src', activeProduct.model);
renderParts(); renderMaterials(); renderSummary();
