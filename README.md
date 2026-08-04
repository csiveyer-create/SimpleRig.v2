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


## This version

- Uses only the user-supplied official asset images.
- Adds collapsible asset folders for Pulleys, Rigging Hardware, Truss / Scaffold, Machines and Performers.
- Makes the complete left tool panel vertically scrollable.
- Shows every available connection point while drawing a rig line.
- Mirrors connection points when objects are flipped.
- Adds analysed machine connection points.
- Gives rigging hardware two end points and pulleys one shared attachment point that can accept multiple lines.


## Minor update

- Assets load at half their previous height while retaining width.
- Pulleys now have top and lower connection points.
- Carabiners and bow shackles snap onto object connection points and follow the attached object.
- Harness reference image is loaded into an interactive harness editor.
- Harness editor can add bow shackles and loop-ended leaders with movable size/diameter text.
- Layer names match the asset categories.
- Calendar cards have a visible delete button.
- Save hierarchy is Project → Sequence → Rig / Move.
- Sequence colour coding appears in saved rigs and calendar entries.
- The harness reference and notes are stored with the current Rig / Move and included with calendar entries.


## Object labels and notes

- A checkbox shows or hides labels beneath all placed objects.
- **Add Note** creates a fully editable text box in the 2D workspace.
- Notes can be moved, resized, rotated, duplicated and deleted like other objects.
- Double-click a note to edit its text.
- Font size, text colour, background colour and background visibility are available in the inspector.


## Rig analysis

Mark an object as a load, enter its mass, connect the system with rig lines, set pulley roles where needed, and select **Analyse Rig**. The build displays estimated ideal/effective mechanical advantage, pull force, rope tension and component loads. This is a planning estimator for simple block-and-tackle systems and must be independently verified.


## Additional line tension

The analysis toolbar now includes **Additional line tension (kgf)**.

The calculation is:

`Total line tension = estimated pull from the load + additional line tension`

The total is applied to all connected rope sections and is used when calculating pulley, shackle, hardware, machine and anchor loads. Mechanical advantage and the original load mass remain unchanged.


## Haul end

Use **Mark Haul End**, then click either endpoint of a rig line.

When the selected line belongs to the analysed rig, SimpleRig displays:

- a purple haul-end marker;
- the total line tension at that endpoint;
- **Lifter pull at haul end** in kgf.

The lifter-pull value includes the calculated pull from the load plus any additional line tension entered in the toolbar.
