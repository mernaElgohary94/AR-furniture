# Furniture AR configurator prototype

Open `index.html` through a local web server (for example, `npx serve .`) or deploy this folder to HTTPS hosting.

## Add production assets

Place these exact pairs in `assets/`, exported from the same calibrated source model:

- `alder-compact.glb` and `alder-compact.usdz` — 180 × 92 × 76 cm
- `alder-standard.glb` and `alder-standard.usdz` — 220 × 92 × 76 cm
- `alder-grand.glb` and `alder-grand.usdz` — 260 × 92 × 76 cm

The demo intentionally has no substitute AR model: the AR button will activate only after valid assets are supplied. In the source 3D scene, use metres and keep geometry at exact real-world dimensions. Test every SKU against a tape-measure placement before launch.

## Integration points

- Replace the `alert()` in `app.js` with the web app's cart mutation.
- Replace prices and catalogue information with your product API response.
- For material-specific AR, export a GLB/USDZ pair per colour, or map the selected fabric to a material variant.
- Keep `ar-scale="fixed"`; this protects the actual-size promise.
