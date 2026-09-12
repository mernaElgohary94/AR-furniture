// MATERIALS is the live shared library. Every item in this array appears in the
// configurator when its family is allowed for the selected product part.
// Add real thumbnail/baseColor/normal/roughness URLs when production maps are ready.
export const MATERIALS = [
  { id: 'acrylic-fog', family: 'Acrylic', name: 'Fog', colours: ['#777b76', '#aab0ad'], pattern: 'weave' },
  { id: 'acrylic-sand', family: 'Acrylic', name: 'Sand', colours: ['#b5ae9f', '#d6d0c3'], pattern: 'weave' },
  { id: 'cashmere-cloud', family: 'Cashmere', name: 'Cloud', colours: ['#b8b6ae', '#e5e2d8'], pattern: 'herringbone' },
  { id: 'chenille-chalk', family: 'Chenille', name: 'Chalk', colours: ['#ddd9cc', '#f0ede4'], pattern: 'boucle' },
  { id: 'blend-ivory', family: 'Blend', name: 'Ivory', colours: ['#d5cfbc', '#f0ede0'], pattern: 'weave' },
  { id: 'blend-truffle', family: 'Blend', name: 'Truffle', colours: ['#716357', '#ae9b88'], pattern: 'weave' },
  { id: 'cotton-ink', family: 'Cotton', name: 'Ink', colours: ['#263039', '#5e6870'], pattern: 'weave' },
  { id: 'cotton-moss', family: 'Cotton', name: 'Moss', colours: ['#536957', '#96a28b'], pattern: 'herringbone' },
  { id: 'leather-tobacco', family: 'Leather', name: 'Tobacco', colours: ['#7b4a2d', '#b4754d'], pattern: 'leather' },
  { id: 'leather-black', family: 'Leather', name: 'Black', colours: ['#171817', '#494a46'], pattern: 'leather' },
  { id: 'wood-walnut', family: 'Wood', name: 'Walnut', colours: ['#4b3022', '#987052'], pattern: 'weave' },
  { id: 'wood-oak', family: 'Wood', name: 'Natural oak', colours: ['#ad7a45', '#e2bd82'], pattern: 'weave' },
  { id: 'metal-black', family: 'Metal', name: 'Black', colours: ['#1f201e', '#484a45'], pattern: 'metal' },
  { id: 'metal-bronze', family: 'Metal', name: 'Bronze', colours: ['#56463a', '#a27e58'], pattern: 'metal' }
];

// MATERIAL_TEMPLATE is only a copy-and-edit example. It does not appear in the
// UI until you copy it into MATERIALS above and give it a unique ID.
export const MATERIAL_TEMPLATE = {
  id: 'boucle-oat',
  family: 'Bouclé',
  name: 'Oat',
  thumbnail: '/assets/materials/boucle-oat/thumbnail.webp',
  baseColor: '/assets/materials/boucle-oat/base-color.webp',
  normal: '/assets/materials/boucle-oat/normal.webp',
  roughness: '/assets/materials/boucle-oat/roughness.webp'
};
