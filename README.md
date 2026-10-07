# The Wonders Palace

A premium, responsive architecture portfolio and client-inquiry website for **The Wonders Palace**.

## Stack
- HTML5
- CSS3
- Vanilla JavaScript ES modules
- Three.js via CDN for GLB/GLTF architectural models
- No build step required

## Run locally
Because the site uses ES modules, serve it from a local web server rather than opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## GitHub Pages
1. Create a GitHub repository, e.g. `thewonderspalace`.
2. Upload all files/folders in this repository.
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main`, `/root`, and save.
5. Connect your custom domain `www.thewonderspalace.com` when ready.

## Adding an Archicad project
Archicad itself is not a browser-native format. Export your model as **GLB/GLTF** and place the file in:

`assets/models/`

Then add a project object to `js/projects.js`:

```js
{
  id: 'my-project',
  title: 'My Project',
  category: 'residential',
  location: 'Kigali, Rwanda',
  year: '2026',
  status: 'Concept',
  area: '250 m²',
  cover: 'assets/images/my-project-cover.jpg',
  description: 'Project description.',
  images: [
    'assets/images/my-project-01.jpg',
    'assets/images/my-project-02.jpg'
  ],
  model: 'assets/models/my-project.glb'
}
```

Supported categories currently used by the filters:
`residential`, `commercial`, `hospitality`, `concept`, `infrastructure`.

## Image assets
The demo projects use remote Unsplash images so the repository works immediately. For your production site, replace those URLs with your own optimized WebP/JPG files under `assets/images/`.

## Contact
The contact form is intentionally backend-free. It prepares an email to:
**thewonderspalace@gmail.com**

For automatic form submissions without opening the user's mail app, connect Formspree, Resend, Netlify Forms, or your own API endpoint.

## Social
- Instagram: https://instagram.com/thewonderspalace
- Facebook: https://facebook.com/thewonderspalace

## Production recommendations
- Add your real logo/favicon.
- Compress images to WebP/AVIF.
- Add `og:image`, canonical URL, sitemap.xml and robots.txt.
- Add Google Search Console / analytics only after choosing your privacy approach.
- Put large GLB models behind lazy loading and compress them with Draco/Meshopt when appropriate.
- For an admin upload system, add a backend/storage layer rather than uploading files directly into the static GitHub repository.

## Advanced 3D Architectural Configurator

The project viewer now supports:

- Day / Night lighting
- Exterior / Interior visibility modes
- Floor isolation
- Original / GLTF material switching
- Roof visibility
- Section-cut mode with live slider
- Individual component visibility
- Orbit, pan and zoom controls
- Responsive desktop/mobile controls

### Recommended Archicad / GLB naming convention

When exporting the model to GLB/GLTF, use descriptive object names. The viewer detects names automatically:

```text
Floor_01
Floor_02
Floor_03
Roof_Main
Exterior_Walls
Exterior_Windows
Interior_Walls
Interior_Kitchen
Interior_Furniture
Stair_Main
Landscape_Garden
```

Names containing `floor_01` / `level_01` are treated as floors. Names containing `roof`, `parapet` or `canopy` are treated as roof elements. Names containing `interior`, `inside`, `furniture`, `fixture`, `kitchen`, `bath`, `bed`, `wardrobe` or `ceiling` are treated as interior elements. Names containing `exterior`, `facade`, `window`, `door`, `wall`, `slab`, `column`, `stair` or `landscape` are treated as exterior elements.

### Materials

GLTF material names are detected and exposed in the Materials control. Selecting a material applies that material across the model as a presentation mode; `Original` restores the exported materials.

### Section cut

The section slider uses a Three.js clipping plane to create a live horizontal architectural cut. This is a presentation feature rather than a BIM section-box replacement.

### Archicad workflow

```text
Archicad
  -> clean / name model elements
  -> export GLB / GLTF
  -> put model in assets/models/
  -> set the project's `model` path in js/projects.js
  -> open the project page
```
