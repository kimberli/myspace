# myspace
A fun little personal site, live at (https://curious.kim).

## Requirements
Node 18+ for the application.
Bash 4.4+ to process photos.

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
Photos are processed using [ExifTool](https://exiftool.org/) and [ImageMagick](https://imagemagick.org/script/download.php).
Install via `brew install exiftool` and `brew install imagemagick` on Mac.

To organize the photo library, add photos to `photos/` then run `bash script/organize_photos.sh`.
Only photos with the `.jpg` extension are supported.
Commit and push the changes to update them in the application.

To check whether all photos are properly organized, run `bash script/organize_photos.sh -c`.

## Deployment

Deploy this application using Vercel, and point that application to the primary domain.

Photos are hosted separately using GitHub Pages.
Set up the Pages repository to point at `https://static.<domain>`.
Then set the hostname under the `NEXT_PUBLIC_PHOTOS_HOSTNAME` environment variable.

## Analytics
The code includes logic to track user events in Google Analytics and Google Tag Manager.

First, set up Google Analytics.
Get the Measurement ID for the property and make sure it's set in `src/lib/analytics.ts`.

Then, set up Google Tag Manager. 
1. Get the workspace's Tag Manager ID and make sure it's set in `src/lib/analytics.ts`.
2. Set up User-Defined Data Layer Variables for the `AnalyticsVariable` values in `src/lib/analytics.ts`.
3. Set up Custom Event Triggers based on the `AnalyticsEvent` names in `src/lib/analytics.ts`, applying custom conditions if needed. 
4. Finally, set up Google Analytics GA4 Event Tags on the Triggers defined above. Include Event Parameters to send over variable values for tracking as well.
