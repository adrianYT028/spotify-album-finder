import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve the production build
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for Spotify search
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Spotify credentials not configured' });
  }

  try {
    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      return res.status(500).json({ error: 'Failed to obtain access token' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Search for artist
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!searchResponse.ok) {
      return res.status(searchResponse.status).json({ error: 'Spotify search failed' });
    }

    const searchData = await searchResponse.json();
    const artist = searchData.artists?.items?.[0];

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Get artist albums
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!albumsResponse.ok) {
      return res.status(albumsResponse.status).json({ error: 'Failed to fetch albums' });
    }

    const albumsData = await albumsResponse.json();

    res.json({
      artist: {
        name: artist.name,
        id: artist.id
      },
      albums: albumsData.items || []
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All other requests should return the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
