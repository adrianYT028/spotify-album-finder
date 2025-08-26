# Codedex — Spotify Albums Search (Vite + React)

Small React app that searches Spotify artists and lists their albums using the Spotify Web API (client credentials flow).

This repository uses Vite for development and build, React for UI, and a tiny Express server (`server.js`) to serve the production build — which makes it easy to deploy to Heroku.

## Features
- Search for an artist and list albums (album covers, release date, link to Spotify)
- Responsive UI using Bootstrap + custom styles
- Production-ready build served by Express (see `server.js` and `Procfile`)

## Environment
This app requires two environment variables for the Spotify API client credentials. Locally create a `.env` (Vite reads `VITE_` prefixed variables) or set them in your shell.

- VITE_CLIENT_ID
- VITE_CLIENT_SECRET

Example `.env` (do NOT commit this file):

```
VITE_CLIENT_ID=your_client_id_here
VITE_CLIENT_SECRET=your_client_secret_here
```

## Local development
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Build and preview
Build the production bundle and preview locally:

```bash
npm run build
npm run preview
```

The app's production files are written to `dist/`. In this repo we use `server.js` to serve `dist/` in production.

## Deploying to Heroku
This project is prepared for Heroku. Key files:

- `server.js` — minimal Express server that serves `dist/`
- `Procfile` — tells Heroku to run `node server.js`
- `package.json` — includes a `heroku-postbuild` script that runs `npm run build` on deploy

Typical steps to deploy (from a git repo root):

```bash
heroku login
heroku create your-app-name
heroku config:set VITE_CLIENT_ID=your_client_id VITE_CLIENT_SECRET=your_client_secret
git add .
git commit -m "ready for heroku"
git push heroku main
```

Heroku installs dependencies, runs `heroku-postbuild` (builds the app), then starts `node server.js`.

Detailed deployment notes are available in `HEROKU.md`.

## Troubleshooting
- If you see a blank page in production, make sure `VITE_CLIENT_ID` and `VITE_CLIENT_SECRET` are set as environment variables on the host (Heroku config vars or your server env).
- To view logs on Heroku: `heroku logs --tail`

## License
This project is provided as-is. Add your preferred license file if you plan to open-source it.
