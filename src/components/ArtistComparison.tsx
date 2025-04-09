import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ArtistData {
  artist: {
    name: string;
    popularity: number;
    followers: {
      total: number;
    };
    images: Array<{
      url: string;
    }>;
    genres: string[];
  };
  topTracks: Array<{
    name: string;
    popularity: number;
    duration_ms: number;
    album: {
      images: Array<{
        url: string;
      }>;
    };
    audio_features?: {
      danceability: number;
      energy: number;
      speechiness: number;
      acousticness: number;
      instrumentalness: number;
      liveness: number;
      valence: number;
    };
  }>;
}

interface SearchResult {
  artists: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{
        url: string;
      }>;
    }>;
  };
}

const fetchArtistData = async (artistId: string) => {
  const response = await fetch(`/api/artists?id=${artistId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch artist data');
  }
  return response.json();
};

const searchArtists = async (query: string) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search artists');
  }
  return response.json();
};

export default function ArtistComparison() {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [artist1Id, setArtist1Id] = useState('');
  const [artist2Id, setArtist2Id] = useState('');
  const [selectedTrack1, setSelectedTrack1] = useState<number | null>(null);
  const [selectedTrack2, setSelectedTrack2] = useState<number | null>(null);

  const { data: searchResults1, isLoading: isLoadingSearch1 } =
    useQuery<SearchResult>({
      queryKey: ['search1', searchQuery1],
      queryFn: () => searchArtists(searchQuery1),
      enabled: searchQuery1.length > 2,
    });

  const { data: searchResults2, isLoading: isLoadingSearch2 } =
    useQuery<SearchResult>({
      queryKey: ['search2', searchQuery2],
      queryFn: () => searchArtists(searchQuery2),
      enabled: searchQuery2.length > 2,
    });

  const { data: artist1Data, isLoading: isLoading1 } = useQuery<ArtistData>({
    queryKey: ['artist1', artist1Id],
    queryFn: () => fetchArtistData(artist1Id),
    enabled: !!artist1Id,
  });

  const { data: artist2Data, isLoading: isLoading2 } = useQuery<ArtistData>({
    queryKey: ['artist2', artist2Id],
    queryFn: () => fetchArtistData(artist2Id),
    enabled: !!artist2Id,
  });

  const comparisonData = [
    {
      name: 'Popularity',
      artist1: artist1Data?.artist.popularity || 0,
      artist2: artist2Data?.artist.popularity || 0,
    },
    {
      name: 'Followers',
      artist1: artist1Data?.artist.followers.total || 0,
      artist2: artist2Data?.artist.followers.total || 0,
    },
  ];

  const getTrackMetrics = (track: ArtistData['topTracks'][0]) => {
    if (!track.audio_features) return [];
    return [
      {
        metric: 'Danceability',
        value: track.audio_features.danceability * 100,
      },
      { metric: 'Energy', value: track.audio_features.energy * 100 },
      { metric: 'Speechiness', value: track.audio_features.speechiness * 100 },
      {
        metric: 'Acousticness',
        value: track.audio_features.acousticness * 100,
      },
      {
        metric: 'Instrumentalness',
        value: track.audio_features.instrumentalness * 100,
      },
      { metric: 'Liveness', value: track.audio_features.liveness * 100 },
      { metric: 'Valence', value: track.audio_features.valence * 100 },
    ];
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Artist Comparison</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Artist 1"
                value={searchQuery1}
                onChange={(e) => setSearchQuery1(e.target.value)}
                className="w-full p-2 border rounded pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {isLoadingSearch1 && <div className="mt-2">Searching...</div>}
            {searchResults1?.artists.items && (
              <div className="mt-2 space-y-2">
                {searchResults1.artists.items.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => {
                      setArtist1Id(artist.id);
                      setSearchQuery1('');
                    }}
                  >
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{artist.name}</span>
                  </div>
                ))}
              </div>
            )}
            {artist1Data && (
              <div className="mt-4">
                <img
                  src={artist1Data.artist.images[0]?.url}
                  alt={artist1Data.artist.name}
                  className="w-32 h-32 rounded-full"
                />
                <h2 className="text-xl font-semibold mt-2">
                  {artist1Data.artist.name}
                </h2>
                <div className="mt-2">
                  <h3 className="font-semibold">Top Tracks</h3>
                  <div className="space-y-2 mt-2">
                    {artist1Data.topTracks.map((track, index) => (
                      <div
                        key={track.name}
                        className={`p-2 rounded cursor-pointer ${
                          selectedTrack1 === index
                            ? 'bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedTrack1(index)}
                      >
                        {track.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Artist 2"
                value={searchQuery2}
                onChange={(e) => setSearchQuery2(e.target.value)}
                className="w-full p-2 border rounded pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {isLoadingSearch2 && <div className="mt-2">Searching...</div>}
            {searchResults2?.artists.items && (
              <div className="mt-2 space-y-2">
                {searchResults2.artists.items.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => {
                      setArtist2Id(artist.id);
                      setSearchQuery2('');
                    }}
                  >
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{artist.name}</span>
                  </div>
                ))}
              </div>
            )}
            {artist2Data && (
              <div className="mt-4">
                <img
                  src={artist2Data.artist.images[0]?.url}
                  alt={artist2Data.artist.name}
                  className="w-32 h-32 rounded-full"
                />
                <h2 className="text-xl font-semibold mt-2">
                  {artist2Data.artist.name}
                </h2>
                <div className="mt-2">
                  <h3 className="font-semibold">Top Tracks</h3>
                  <div className="space-y-2 mt-2">
                    {artist2Data.topTracks.map((track, index) => (
                      <div
                        key={track.name}
                        className={`p-2 rounded cursor-pointer ${
                          selectedTrack2 === index
                            ? 'bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedTrack2(index)}
                      >
                        {track.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(artist1Data || artist2Data) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Performance Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="artist1"
                  fill="#8884d8"
                  name={artist1Data?.artist.name || 'Artist 1'}
                />
                <Bar
                  dataKey="artist2"
                  fill="#82ca9d"
                  name={artist2Data?.artist.name || 'Artist 2'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedTrack1 !== null &&
        artist1Data &&
        selectedTrack2 !== null &&
        artist2Data && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Track Comparison</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {artist1Data.topTracks[selectedTrack1].name}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={getTrackMetrics(
                        artist1Data.topTracks[selectedTrack1]
                      )}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis />
                      <Radar
                        name={artist1Data.topTracks[selectedTrack1].name}
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {artist2Data.topTracks[selectedTrack2].name}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={getTrackMetrics(
                        artist2Data.topTracks[selectedTrack2]
                      )}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis />
                      <Radar
                        name={artist2Data.topTracks[selectedTrack2].name}
                        dataKey="value"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

      {(isLoading1 || isLoading2) && (
        <div className="text-center mt-8">Loading artist data...</div>
      )}
    </div>
  );
}
