// One entry per product. Add a new product here; do not duplicate the app.
// Its public configurator URL becomes /products/<slug>.
export const PRODUCTS = {
  'onda-chair': {
    slug: 'onda-chair',
    code: '01C221',
    type: 'Armchair',
    name: 'Onda Chair',
    description: 'Configure each visible component, then see the exact selection in your space.',
    dimensions: { width: '84 cm', depth: '68 cm', height: '76 cm' },
    model: '/assets/models/onda-chair/onda-chair.glb',
    parts: [
      { id: 'upholstery', label: 'Upholstery', targets: ['fabric Mystere Mango Velvet', 'fabric Mystere Peacock Velvet'], families: ['Acrylic', 'Cashmere', 'Chenille', 'Blend', 'Cotton', 'Leather'], defaultMaterial: 'acrylic-fog' },
      { id: 'wood', label: 'Wood frame', targets: ['wood Brown', 'wood Black'], families: ['Wood'], defaultMaterial: 'wood-walnut' },
      { id: 'metal', label: 'Metal details', targets: ['metal'], families: ['Metal'], defaultMaterial: 'metal-black' }
    ]
  }
};

// Copy this object into PRODUCTS to add a catalogue item, then replace model,
// dimensions, part names, and target GLB material names with real values.
export const PRODUCT_TEMPLATE = {
  slug: 'new-product-slug',
  code: 'PRODUCT-CODE',
  type: 'Chair / Sofa / Rug',
  name: 'New Product',
  description: 'Product description.',
  dimensions: { width: '—', depth: '—', height: '—' },
  model: '/assets/models/new-product-slug/new-product.glb',
  parts: [
    { id: 'upholstery', label: 'Upholstery', targets: ['Exact GLB material name'], families: ['Bouclé', 'Cotton', 'Leather'], defaultMaterial: 'boucle-oat' }
  ]
};
