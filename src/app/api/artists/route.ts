import { NextResponse } from 'next/server';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';

interface SpotifyTrack {
  id: string;
  name: string;
  popularity: number;
  duration_ms: number;
  album: {
    images: Array<{
      url: string;
    }>;
  };
}

interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const response = await fetch(SPOTIFY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('id');

  if (!artistId) {
    return NextResponse.json(
      { error: 'Artist ID is required' },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();

    // Fetch artist details
    const artistResponse = await fetch(
      `${SPOTIFY_API_URL}/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!artistResponse.ok) {
      const error = await artistResponse.json();
      throw new Error(error.error?.message || 'Failed to fetch artist data');
    }

    const artistData = await artistResponse.json();

    // Fetch artist's top tracks
    const tracksResponse = await fetch(
      `${SPOTIFY_API_URL}/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!tracksResponse.ok) {
      const error = await tracksResponse.json();
      throw new Error(error.error?.message || 'Failed to fetch top tracks');
    }

    const tracksData = await tracksResponse.json();
    const trackIds = tracksData.tracks
      .map((track: SpotifyTrack) => track.id)
      .join(',');

    // Fetch audio features for the tracks
    const audioFeaturesResponse = await fetch(
      `${SPOTIFY_API_URL}/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!audioFeaturesResponse.ok) {
      const error = await audioFeaturesResponse.json();
      throw new Error(error.error?.message || 'Failed to fetch audio features');
    }

    const audioFeaturesData = await audioFeaturesResponse.json();

    // Combine track data with audio features
    const tracksWithFeatures = tracksData.tracks.map((track: SpotifyTrack) => ({
      ...track,
      audio_features: audioFeaturesData.audio_features.find(
        (feature: SpotifyAudioFeatures) => feature.id === track.id
      ),
    }));

    return NextResponse.json({
      artist: artistData,
      topTracks: tracksWithFeatures,
    });
  } catch (error: any) {
    console.error('Error fetching artist data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
}
