# Srashti & Priyank — wedding invitation

A dependency-free, responsive static wedding invitation. Open `index.html` locally or publish this folder with GitHub Pages.

## Personalise the invitation

Edit [`data.js`](data.js) to set confirmed details:

- `bride`, `groom`, date and ceremony time
- `location`, plus the wedding venue and hotel cards in `places`
- the celebration schedule in `events`
- guest records in `guests`, using `{ name, room, hotel, note }`

Google Maps cards accept a place name or a complete directions/search URL. The Maps link is hidden until a location is provided. Guest names should match the invitation; matching is case and whitespace insensitive. Guest and room data in a static site is visible to anyone who can inspect its source or browser files, so only use the lookup for details the couple is comfortable sharing publicly. If room assignments must remain private, the lookup needs a server-backed service with access control.

## Publish with GitHub Pages

This folder is ready to deploy as a static site. From the repository, open **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)` for the `wedding-invitation` repository folder, or use a Pages workflow to deploy only `wedding-invitation/`. If this folder stays in the existing firmware repo, the usual Pages source publishes the repository root; a workflow is required to publish only this subfolder. The expected URL is `https://shank0gits.github.io/xiaozhi-esp32-main/wedding-invitation/` once Pages is enabled for the repository.
