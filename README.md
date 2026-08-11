# Furniture AR configurator prototype

Open `index.html` through a local web server (for example, `npx serve .`) or deploy this folder to HTTPS hosting. It currently opens an Astronaut model as an end-to-end AR test; this is intentional and visibly labelled as a demo asset.

## Add production assets

Place these exact pairs in `assets/`, exported from the same calibrated source model:

- `alder-compact.glb` and `alder-compact.usdz` — 180 × 92 × 76 cm
- `alder-standard.glb` and `alder-standard.usdz` — 220 × 92 × 76 cm
- `alder-grand.glb` and `alder-grand.usdz` — 260 × 92 × 76 cm

When the calibrated files are present, set `DEMO_MODE` to `false` in `app.js`. In the source 3D scene, use metres and keep geometry at exact real-world dimensions. Test every SKU against a tape-measure placement before launch.

## Integration points

- Replace the `alert()` in `app.js` with the web app's cart mutation.
- Replace prices and catalogue information with your product API response.
- For material-specific AR, export a GLB/USDZ pair per colour, or map the selected fabric to a material variant.
- Keep `ar-scale="fixed"`; this protects the actual-size promise.
