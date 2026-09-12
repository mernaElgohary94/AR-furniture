# Add a catalogue product

1. Create assets/models/<product-slug>/.
2. Add the real GLB as assets/models/<product-slug>/<product-slug>.glb.
3. Inspect the exported material names and make every configurable region a separately named material.
4. Copy PRODUCT_TEMPLATE from catalogue/products.js into PRODUCTS.
5. Set slug, dimensions, GLB path, part IDs, allowed material families, and exact targets material names.
6. Test the public route: /products/<product-slug>.

Example URL:

https://your-domain.com/products/onda-chair?upholstery=leather-tobacco&wood=wood-walnut&metal=metal-black

Use that URL for the product-page launch button and QR handoff. The same app serves every product.

# Add a material

1. Create assets/materials/<material-id>/.
2. Add thumbnail.webp, base-color.webp, normal.webp, and roughness.webp.
3. Copy MATERIAL_TEMPLATE into catalogue/materials.js and set the URLs.
4. Add its family to the relevant product part's families array.

Use texture maps with compatible UV scale and test the material under normal room lighting before publishing.
