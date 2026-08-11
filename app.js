// Replace each asset pair below with the production GLB/USDZ exported from the same source scene.
// Source measurements must be in metres: 1 unit in the model = 1 metre in the room.
const CATALOGUE = {
  sizes: [
    { id: 'compact', name: 'Compact', dimensions: ['180 cm', '92 cm', '76 cm'], price: 1890, glb: './assets/alder-compact.glb', usdz: './assets/alder-compact.usdz' },
    { id: 'standard', name: 'Standard', dimensions: ['220 cm', '92 cm', '76 cm'], price: 2290, glb: './assets/alder-standard.glb', usdz: './assets/alder-standard.usdz' },
    { id: 'grand', name: 'Grand', dimensions: ['260 cm', '92 cm', '76 cm'], price: 2790, glb: './assets/alder-grand.glb', usdz: './assets/alder-grand.usdz' }
  ],
  colours: [
    { id: 'oat', name: 'Oat Bouclé', hex: '#cfc4ad' },
    { id: 'moss', name: 'Moss Linen', hex: '#596e59' },
    { id: 'clay', name: 'Clay Weave', hex: '#a86d57' },
    { id: 'ink', name: 'Ink Wool', hex: '#26313b' }
  ]
};

// This makes AR testable immediately. Set to false only after the calibrated files
// named in README.md have been added to /assets and deployed over HTTPS.
const DEMO_MODE = true;
const DEMO_ASSET = {
  glb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
};

let selectedSize = CATALOGUE.sizes[1];
let selectedColour = CATALOGUE.colours[0];
const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

function renderOptions() {
  $('size-options').innerHTML = CATALOGUE.sizes.map((item) => `<button class="option ${item.id === selectedSize.id ? 'selected' : ''}" data-size="${item.id}"><b>${item.name}</b><small>${item.dimensions[0]} wide</small></button>`).join('');
  $('colour-options').innerHTML = CATALOGUE.colours.map((item) => `<button class="swatch ${item.id === selectedColour.id ? 'selected' : ''}" data-colour="${item.id}" aria-label="${item.name}" title="${item.name}" style="background:${item.hex}"></button>`).join('');
  document.querySelectorAll('[data-size]').forEach((button) => button.onclick = () => { selectedSize = CATALOGUE.sizes.find((x) => x.id === button.dataset.size); update(); });
  document.querySelectorAll('[data-colour]').forEach((button) => button.onclick = () => { selectedColour = CATALOGUE.colours.find((x) => x.id === button.dataset.colour); update(); });
}

function update() {
  const [width, depth, height] = selectedSize.dimensions;
  $('width').textContent = width; $('depth').textContent = depth; $('height').textContent = height;
  $('price').textContent = money.format(selectedSize.price);
  $('colour-name').textContent = selectedColour.name;
  const model = $('product-model');
  // Size selects an independently measured asset. Colour is passed as a selected SKU value;
  // production teams can swap material variants here or use model-viewer material APIs.
  model.setAttribute('src', DEMO_MODE ? DEMO_ASSET.glb : selectedSize.glb);
  model.setAttribute('ios-src', DEMO_MODE ? DEMO_ASSET.usdz : selectedSize.usdz);
  model.setAttribute('alt', DEMO_MODE ? 'Temporary AR test model' : `${selectedSize.name} Alder sofa in ${selectedColour.name}`);
  $('viewer-note').innerHTML = DEMO_MODE
    ? '<span class="status-dot"></span>Demo AR asset — replace before launch'
    : '<span class="status-dot"></span>Shown at actual size in AR';
  renderOptions();
}

$('cart-button').onclick = () => alert(`Added: Alder Sofa — ${selectedSize.name}, ${selectedColour.name}.\nConnect this handler to your existing cart API.`);
const model = $('product-model');
if (!navigator.xr && !/iPhone|iPad|Android/i.test(navigator.userAgent)) $('fallback').hidden = false;
model.addEventListener('ar-status', (event) => {
  if (event.detail.status === 'failed') {
    $('fallback').hidden = false;
    $('fallback').textContent = 'AR could not start. Use HTTPS, test on a supported phone, and confirm the GLB/USDZ files load without a 404 error.';
  }
});
update();
