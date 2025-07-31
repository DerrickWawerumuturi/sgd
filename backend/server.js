import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import cors from 'cors'
import * as cheerio from 'cheerio'


const PORT = process.env.PORT || 4000;
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

let accessToken = null
let tokenExpiry = 0;
const GENIUS_TOKEN = process.env.GENIUS_TOKEN

// Spotify Token
const getToken = async () => {
    try {
        const res = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        accessToken = res.data.access_token;
        tokenExpiry = Date.now() + res.data.expires_in * 1000;
    } catch (error) {
        console.error('Failed to get token:', error.response?.data || error.message);
    }
};
getToken();

// Spotify search
app.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!accessToken || Date.now() > tokenExpiry) await getToken();

    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error searching for song:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to search for song' });
    }
});

// Genius search
async function searchGenius(artist, title) {
    const query = `${artist} ${title}`;
    const res = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${GENIUS_TOKEN}` }
    });

    const hits = res.data.response.hits;
    if (!hits.length) throw new Error('No lyrics found');
    return hits[0].result.url;
}

async function getLyricsFromGenius(url) {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)

    let lyrics = ''
    $('div[data-lyrics-container="true"]').each((i, el) => {
        lyrics += $(el).text() + '\n'
    })

    return lyrics.trim()
}

async function getLyricsFromLyricsOvh(artist, title) {
    try {
        const res = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        return res.data.lyrics || null
    } catch (error) {
        console.error('Error getting lyrics from LyricsOvh:', error.response?.data || error.message)
        return null
    }
}


app.get('/lyrics', async (req, res) => {
    const { artist, title } = req.query;

    try {

        // 1. Try Genius
        const url = await searchGenius(artist, title)
        const lyrics = await getLyricsFromGenius(url)
        if (lyrics) {
            res.json({ lyrics });
        }

        // 2. Try LyricsOvh
        const fallbackLyrics = await getLyricsFromLyricsOvh(artist, title)
        if (fallbackLyrics) {
            res.json({ lyrics: fallbackLyrics });
        }

        res.status(404).json({ lyrics: null, message: 'Lyrics not found' });
    } catch (error) {
        res.status(404).json({ lyrics: null, message: 'Lyrics not found' });
    }
});

// Grade endpoint
app.post("/grade", async (req, res) => {
    const { lyrics } = req.body;
    if (!lyrics) return res.status(400).json({ error: 'Lyrics are required' });

    try {
        const response = await axios.post(
            'https://derrickmuturi-sgd-bert.hf.space/predict',
            { text: lyrics }
        );
        res.json(response.data)
    } catch (error) {
        console.error('Error grading lyrics:', error.response?.data || error.message)
        res.status(500).json({ error: 'Failed to grade lyrics' })
    }
})

app.listen(PORT, () => console.log('Server is running on port 4000'))
