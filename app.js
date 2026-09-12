// Replace each asset pair below with the production GLB/USDZ exported from the same source scene.
// Source measurements must be in metres: 1 unit in the model = 1 metre in the room.
//
// PRODUCTS supports more than one item — add entries here to populate the
// carousel above the viewer with additional chairs/sofas/rugs. Each product
// can declare its own sizes and its own materialSlots (see Alder Sofa below).
const PRODUCTS = [
  {
    id: 'alder-sofa',
    name: 'Alder Sofa',
    eyebrow: 'MODULAR SEATING / 01',
    intro: 'A softly structured sofa made for long evenings. Choose a size and fabric, then place the exact configuration in your space.',
    thumb: './assets/sofa-poster.svg',
    sizes: [
      { id: 'compact', name: 'Compact', dimensions: ['180 cm', '92 cm', '76 cm'], price: 1890, glb: './assets/alder-compact.glb', usdz: './assets/alder-compact.usdz' },
      { id: 'standard', name: 'Standard', dimensions: ['220 cm', '92 cm', '76 cm'], price: 2290, glb: './assets/alder-standard.glb', usdz: './assets/alder-standard.usdz' },
      { id: 'grand', name: 'Grand', dimensions: ['260 cm', '92 cm', '76 cm'], price: 2790, glb: './assets/alder-grand.glb', usdz: './assets/alder-grand.usdz' }
    ],
    // Each slot targets one material by name inside the GLB (case-insensitive match).
    // On a chair this is where you'd add Legs / Back / Seat instead of Fabric / Frame.
    // A slot with no `swatches` still gets a working, generically-labelled colour row —
    // useful while testing against a placeholder model whose material names don't match yet.
    materialSlots: [
      {
        material: 'Fabric',
        label: 'Fabric',
        swatches: [
          { id: 'oat', name: 'Oat Bouclé', hex: '#cfc4ad' },
          { id: 'moss', name: 'Moss Linen', hex: '#596e59' },
          { id: 'clay', name: 'Clay Weave', hex: '#a86d57' },
          { id: 'ink', name: 'Ink Wool', hex: '#26313b' }
        ]
      },
      {
        material: 'Legs',
        label: 'Legs',
        swatches: [
          { id: 'oak', name: 'Natural Oak', hex: '#b98c56' },
          { id: 'walnut', name: 'Walnut', hex: '#4a3222' },
          { id: 'black', name: 'Black Steel', hex: '#20201f' }
        ]
      }
    ]
  }
];

// This makes AR testable immediately. Set to false only after the calibrated files
// named in README.md have been added to /assets and deployed over HTTPS.
const DEMO_MODE = false;
const DEMO_ASSET = {
  glb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
};

// IMPORTANT — AR + live material edits:
// ios-src is deliberately still set below (real per-size USDZ). That guarantees the
// exact calibrated geometry ships to Quick Look, but Quick Look will show that file's
// baked-in default colours, not whatever the shopper picked here — Apple's AR Quick
// Look reflects live scene-graph edits only when ios-src is left unset (model-viewer
// then auto-generates a USDZ from current state). WebXR (Android in-browser AR) always
// reflects live edits either way. If shipping the shopper's exact colours to iOS AR
// matters more than a hand-authored USDZ, remove the ios-src line in applyProduct().
const GENERIC_PALETTE = ['#26313b', '#a86d57', '#596e59', '#cfc4ad', '#b98c56', '#20201f'];

let activeProduct = PRODUCTS[0];
let selectedSize = activeProduct.sizes[1];
let materialSelections = {}; // { [materialSlotKeyLowercased]: hex }
const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const model = () => $('product-model');

function resetMaterialSelections(product) {
  materialSelections = {};
  (product.materialSlots || []).forEach((slot) => {
    if (slot.swatches && slot.swatches.length) {
      materialSelections[slot.material.toLowerCase()] = slot.swatches[0].hex;
    }
  });
}

function renderCarousel() {
  $('product-carousel').innerHTML = PRODUCTS.map((p) => `
    <button class="carousel-card ${p.id === activeProduct.id ? 'selected' : ''}" data-product="${p.id}">
      <img src="${p.thumb}" alt="" />
      <span>${p.name}</span>
    </button>`).join('');
  document.querySelectorAll('[data-product]').forEach((button) => {
    button.onclick = () => {
      const product = PRODUCTS.find((p) => p.id === button.dataset.product);
      if (product.id === activeProduct.id) return;
      activeProduct = product;
      selectedSize = product.sizes[Math.floor(product.sizes.length / 2)];
      resetMaterialSelections(product);
      update();
    };
  });
}

function renderSizeOptions() {
  $('size-options').innerHTML = activeProduct.sizes.map((item) => `<button class="option ${item.id === selectedSize.id ? 'selected' : ''}" data-size="${item.id}"><b>${item.name}</b><small>${item.dimensions[0]} wide</small></button>`).join('');
  document.querySelectorAll('[data-size]').forEach((button) => button.onclick = () => { selectedSize = activeProduct.sizes.find((x) => x.id === button.dataset.size); update(); });
}

// One row per material slot the product declares. Applying a swatch edits that
// material only, via the model-viewer scene-graph API — other parts are untouched.
function renderMaterialOptions() {
  const slots = activeProduct.materialSlots || [];
  $('material-options').innerHTML = slots.map((slot) => {
    const current = materialSelections[slot.material.toLowerCase()];
    const swatches = slot.swatches && slot.swatches.length ? slot.swatches : GENERIC_PALETTE.map((hex, i) => ({ id: `g${i}`, name: hex, hex }));
    return `
      <div class="material-row">
        <p class="material-row-label">${slot.label}</p>
        <div class="swatches">
          ${swatches.map((sw) => `<button class="swatch ${sw.hex === current ? 'selected' : ''}" data-material="${slot.material}" data-hex="${sw.hex}" aria-label="${sw.name}" title="${sw.name}" style="background:${sw.hex}"></button>`).join('')}
        </div>
      </div>`;
  }).join('');
  document.querySelectorAll('[data-material]').forEach((button) => {
    button.onclick = () => {
      const materialName = button.dataset.material;
      const hex = button.dataset.hex;
      materialSelections[materialName.toLowerCase()] = hex;
      applyMaterialColour(materialName, hex);
      renderMaterialOptions();
    };
  });
}

// Sets one material's base colour on the currently loaded model. Matches by name
// case-insensitively; silently no-ops (with a console note) if that material
// isn't present on the loaded GLB — expected while DEMO_MODE points at a
// placeholder model whose materials aren't named Fabric/Legs yet.
function applyMaterialColour(materialName, hex) {
  const materials = model().model && model().model.materials;
  if (!materials) return;
  const target = materials.find((m) => (m.name || '').toLowerCase() === materialName.toLowerCase());
  if (!target) {
    console.info(`No material named "${materialName}" on the loaded GLB yet — skipping colour apply.`);
    return;
  }
  const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255);
  target.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
}

// Re-applies every saved selection — called after a new model finishes loading
// (new size = new GLB instance = materials reset to their authored defaults).
function reapplyAllMaterials() {
  Object.entries(materialSelections).forEach(([materialName, hex]) => applyMaterialColour(materialName, hex));
}

function update() {
  const [width, depth, height] = selectedSize.dimensions;
  $('width').textContent = width; $('depth').textContent = depth; $('height').textContent = height;
  $('price').textContent = money.format(selectedSize.price);
  $('product-name').textContent = activeProduct.name;
  $('product-eyebrow').textContent = activeProduct.eyebrow;
  $('product-intro').textContent = activeProduct.intro;

  model().setAttribute('src', DEMO_MODE ? DEMO_ASSET.glb : selectedSize.glb);
  model().setAttribute('ios-src', DEMO_MODE ? DEMO_ASSET.usdz : selectedSize.usdz);
  model().setAttribute('alt', DEMO_MODE ? 'Temporary AR test model' : `${selectedSize.name} ${activeProduct.name}`);
  $('viewer-note').innerHTML = DEMO_MODE
    ? '<span class="status-dot"></span>Demo AR asset — replace before launch'
    : '<span class="status-dot"></span>Shown at actual size in AR';

  renderCarousel();
  renderSizeOptions();
  renderMaterialOptions();
}

$('cart-button').onclick = () => alert(`Added: ${activeProduct.name} — ${selectedSize.name}.\nConnect this handler to your existing cart API.`);
if (!navigator.xr && !/iPhone|iPad|Android/i.test(navigator.userAgent)) $('fallback').hidden = false;
model().addEventListener('ar-status', (event) => {
  if (event.detail.status === 'failed') {
    $('fallback').hidden = false;
    $('fallback').textContent = 'AR could not start. Use HTTPS, test on a supported phone, and confirm the GLB/USDZ files load without a 404 error.';
  }
});
// Every time a model finishes loading (initial load, or a size swap), put the
// shopper's chosen colours back onto whatever materials this GLB actually has.
model().addEventListener('load', reapplyAllMaterials);

resetMaterialSelections(activeProduct);
update();
