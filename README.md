# Furniture AR catalogue configurator

One static web application serves the entire product catalogue. It does not need to be duplicated for every model.

## Product URLs

- Onda Chair: /products/onda-chair
- A configuration is carried in its URL, for example:
  /products/onda-chair?upholstery=leather-tobacco&wood=wood-walnut&metal=metal-black

Use that route as the destination of any product-card or product-page button in the main website. On desktop, the configurator generates a QR code containing the same URL; on mobile, it opens the same model directly.

## Project map

    assets/models/<product-slug>/<product>.glb    3D geometry, one GLB per physical model or size
    assets/materials/<material-id>/               texture files for shared material options
    catalogue/products.js                         product models, dimensions, parts and allowed materials
    catalogue/materials.js                        one reusable material library
    docs/ADD-A-PRODUCT.md                         product and material onboarding procedure

## Deploy

Set Vercel Root Directory to outputs/furniture-ar-demo  2. Do not set a build command or output directory. The Vercel route configuration allows direct visits to /products/<slug>.

## Important

Only create additional GLB files when furniture geometry or physical dimensions change. Material selections are applied dynamically from the shared material library.
