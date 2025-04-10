'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TrackData {
  name: string;
  popularity: number;
  duration_ms: number;
  album: {
    images: Array<{
      url: string;
    }>;
  };
}

interface ArtistData {
  artist: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
  topTracks: TrackData[];
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

export default function PerformancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artistId, setArtistId] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchArtists(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const { data: artistData, isLoading: isLoadingArtist } = useQuery<ArtistData>(
    {
      queryKey: ['artist', artistId],
      queryFn: () => fetchArtistData(artistId),
      enabled: !!artistId,
    }
  );

  const performanceData =
    selectedTrack !== null && artistData?.topTracks[selectedTrack]
      ? [
          {
            date: 'Week 1',
            views: Math.round(
              artistData.topTracks[selectedTrack].popularity * 100
            ),
            likes: Math.round(
              artistData.topTracks[selectedTrack].popularity * 50
            ),
            streams: Math.round(
              artistData.topTracks[selectedTrack].popularity * 200
            ),
          },
          {
            date: 'Week 2',
            views: Math.round(
              artistData.topTracks[selectedTrack].popularity * 200
            ),
            likes: Math.round(
              artistData.topTracks[selectedTrack].popularity * 100
            ),
            streams: Math.round(
              artistData.topTracks[selectedTrack].popularity * 400
            ),
          },
          {
            date: 'Week 3',
            views: Math.round(
              artistData.topTracks[selectedTrack].popularity * 300
            ),
            likes: Math.round(
              artistData.topTracks[selectedTrack].popularity * 150
            ),
            streams: Math.round(
              artistData.topTracks[selectedTrack].popularity * 600
            ),
          },
          {
            date: 'Week 4',
            views: Math.round(
              artistData.topTracks[selectedTrack].popularity * 400
            ),
            likes: Math.round(
              artistData.topTracks[selectedTrack].popularity * 200
            ),
            streams: Math.round(
              artistData.topTracks[selectedTrack].popularity * 800
            ),
          },
        ]
      : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Song Performance Analysis</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Artist and Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search Artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {isLoadingSearch && <p>Searching...</p>}
          {searchResults?.artists?.items && (
            <div className="space-y-2">
              {searchResults.artists.items.map((artist: any) => (
                <div
                  key={artist.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => {
                    setArtistId(artist.id);
                    setSearchQuery('');
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

          {artistData && (
            <div className="mt-4">
              <img
                src={artistData.artist.images[0]?.url}
                alt={artistData.artist.name}
                className="w-32 h-32 rounded-full"
              />
              <h2 className="text-xl font-semibold mt-2">
                {artistData.artist.name}
              </h2>
              <div className="mt-2">
                <h3 className="font-semibold">Top Tracks</h3>
                <div className="space-y-2 mt-2">
                  {artistData.topTracks.map((track, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded cursor-pointer ${
                        selectedTrack === index
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedTrack(index)}
                    >
                      {track.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTrack !== null && artistData && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#82ca9d"
                    name="Likes"
                  />
                  <Line
                    type="monotone"
                    dataKey="streams"
                    stroke="#ffc658"
                    name="Streams"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
