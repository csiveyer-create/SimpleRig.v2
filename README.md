# SimpleRig Pro — GitHub Pages build

This is a fresh standalone browser application focused on professional 2D stunt-rig planning.

## Implemented

- 2D technical workspace with uploaded photo/plan background
- Transparent technical assets, including the supplied telehandler artwork
- Move, resize, rotate, flip and four-corner perspective distortion
- Selectable/deletable objects, rig lines and measurements
- Intelligent connection points on equipment and performers
- Rig lines that snap to objects and follow when attached objects move
- Custom PNG, JPG and SVG import
- Live Wikimedia Commons image search with source/licence information
- Google Images source-search shortcut
- Project save, rename, import, export, duplicate and delete
- Save canvas drawings into the project
- Drag saved drawings onto project calendar dates
- Move drawings between calendar dates
- Downloadable `.ics` calendar and printable calendar
- Manual mechanical advantage/disadvantage calculator
- Harness reference using the supplied Vertical Effects Ltd diagram
- Project-specific harness notes

## GitHub Pages

Upload the contents of this ZIP to the repository root. The root must show:

- `index.html`
- `styles.css`
- `app.js`
- `assets/`

Then open **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**.

## Important browser limitation

Some remote image sites block canvas use. Wikimedia results may display but prevent PNG/drawing export. When that happens, download the authorised image and import it as a local asset.

## Safety

The calculator and plans are aids only and do not replace manufacturer instructions, competent-person assessment, engineering review or approved rigging procedures.
