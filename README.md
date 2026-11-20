# Voice Reverser — Netlify Deployment

This folder is ready to deploy to **Netlify** with short shareable links (`?id=xxxxxx`) powered by Netlify Functions and Netlify Blobs.

## Quick Deploy Steps
1. Push this folder to a GitHub/GitLab repository (or use the Netlify CLI: `npm install && npx netlify-cli deploy --prod`).
2. Connect the repository in your Netlify dashboard — Netlify will automatically detect `netlify.toml`, install `@netlify/blobs`, and deploy `public/index.html` + `netlify/functions/voice.mjs`.
3. Open your live site:
   - **User 1** records Voice 1 and gets a short link like `https://your-site.netlify.app/?id=a7k9m2`.
   - **User 2** opens that link to see a dedicated User 2 interface where Voice 1 plays **only in reverse**, while Voice 2 lets them record and play forward or reversed.
