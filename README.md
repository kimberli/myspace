# myspace
A fun little personal site.

## Requirements
Node 18+ is required.

## Development
### Getting started
1. Install dependencies.
```bash
$ npm install
```
2. Set up Git hooks.
```bash
$ npm run prepare
```
3. Populate `.env.local` with the appropriate env variables.
4. Set up a local development database.
5. Start the development server.
6. Navigate to the application in your browser at (https://localhost:3000).

### Art
Art can be created and edited using a few different tools:

1. Use [Linearity Curve](https://www.linearity.io/curve/) to draw vector art.
2. Prompt a multimodal AI tool to create a "line drawing of X", asking it to ensure the drawing is minimalistic and the object is facing straight on.
3. Use [remove.bg](remove.bg) to clear the background of generated images, then something like [this vectorizer](https://www.vectorizer.io/) and [this SVG tool](https://jakearchibald.github.io/svgomg/) to convert and minify SVGs.

### Photos
Photos are processed using [ExifTool](https://exiftool.org/).
Install it using the instructions on the page, or via `brew install exiftool` on Mac.

To organize the photo library, add photos to `photos/` then run `script/organize_photos.sh`.
Commit and push the changes to update them in the application.
