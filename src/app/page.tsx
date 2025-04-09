'use client';

import { analyzeSongContent } from '@/ai/flows/analyze-song-content';
import { transcribeSong } from '@/ai/flows/transcribe-song';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function Home() {
  const [songLink, setSongLink] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [summary, setSummary] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [punchlines, setPunchlines] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [structure, setStructure] = useState('');
  const [culturalReferences, setCulturalReferences] = useState<string[]>([]);
  const [similarSongs, setSimilarSongs] = useState<string[]>([]); // State for similar songs
  const [loadingTranscription, setLoadingTranscription] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const { data: songPerformanceData, isLoading: isLoadingPerformance } =
    useQuery({
      queryKey: ['artistPerformance', selectedArtistId],
      queryFn: async () => {
        if (!selectedArtistId) return [];
        const response = await fetch(`/api/artists?id=${selectedArtistId}`);
        if (!response.ok) throw new Error('Failed to fetch performance data');
        const data = await response.json();
        return data.topTracks.map((track: any) => ({
          date: track.name,
          views: track.popularity * 1000,
          likes: track.popularity * 500,
          streams: track.popularity * 2000,
        }));
      },
      enabled: !!selectedArtistId,
    });

  const { data: artistComparisonData, isLoading: isLoadingComparison } =
    useQuery({
      queryKey: ['artistComparison', selectedArtistId],
      queryFn: async () => {
        if (!selectedArtistId) return [];
        const response = await fetch(`/api/artists?id=${selectedArtistId}`);
        if (!response.ok) throw new Error('Failed to fetch comparison data');
        const data = await response.json();
        return [
          {
            artist: data.artist.name,
            streams: data.artist.followers.total,
            monthlyListeners: data.artist.popularity * 10000,
          },
        ];
      },
      enabled: !!selectedArtistId,
    });

  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied to clipboard!`,
    });
  };

  const handleTranscribeAndAnalyze = async () => {
    setLoadingTranscription(true);
    setLoadingAnalysis(true);
    setLyrics('');
    setSummary('');
    setThemes([]);
    setPunchlines([]);
    setMood('');
    setStructure('');
    setCulturalReferences([]);
    setSimilarSongs([]); // Clear similar songs
    toast({
      title: 'Transcribing and analyzing...',
      description: 'This may take a few minutes.',
    });

    try {
      const transcriptionResult = await transcribeSong({ songLink });
      setLyrics(transcriptionResult.lyrics);

      const analysisResult = await analyzeSongContent({
        lyrics: transcriptionResult.lyrics,
      });
      setSummary(analysisResult.summary);
      setThemes(analysisResult.themes);
      setPunchlines(analysisResult.punchlines);
      setMood(analysisResult.mood);
      setStructure(analysisResult.structure);
      setCulturalReferences(analysisResult.culturalReferences);
      setSimilarSongs(analysisResult.similarSongs || []); // Set similar songs

      toast({
        title: 'Analysis complete!',
        description: 'Scroll down to see the results.',
      });
    } catch (error: any) {
      toast({
        title: 'Error during transcription or analysis',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingTranscription(false);
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">
        AI Afrobeats Music Summary + Insight Tool
      </h1>
      <p className="text-muted-foreground mb-4">
        Paste a song link and get a summary along with key insights.
      </p>

      <div className="flex flex-col space-y-4">
        {/* Song Input */}
        <div className="flex items-center space-x-2">
          <Input
            id="songLink"
            type="url"
            placeholder="https://audiomack.com/song"
            value={songLink}
            onChange={(e) => setSongLink(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleTranscribeAndAnalyze}
            disabled={loadingTranscription || loadingAnalysis}
          >
            {loadingTranscription || loadingAnalysis
              ? 'Generating Summary...'
              : 'Generate Summary'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analysis" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="comparison">Artist Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis" className="mt-4">
            {/* Results */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {summary}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {themes.map((theme, index) => (
                        <li key={index}>{theme}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Top Punchlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {punchlines.map((punchline, index) => (
                        <li key={index}>{punchline}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{mood}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{structure}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle>Cultural Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {culturalReferences.map((reference, index) => (
                        <li key={index}>{reference}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {/* Similar Songs Recommendation */}
                {similarSongs.length > 0 && (
                  <Card className="shadow-md rounded-lg">
                    <CardHeader>
                      <CardTitle>Similar Songs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 text-sm text-muted-foreground">
                        {similarSongs.map((song, index) => (
                          <li key={index}>{song}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="performance" className="mt-4">
            {/* Song Performance Chart */}
            <Card className="shadow-md rounded-lg">
              <CardHeader>
                <CardTitle>Song Performance</CardTitle>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Views, Likes, and Streams Over Time
                  </p>
                  {isLoadingPerformance ? (
                    <div className="h-80 flex items-center justify-center">
                      <p>Loading performance data...</p>
                    </div>
                  ) : songPerformanceData?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={songPerformanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#8884d8"
                          fill="#8884d8"
                          name="Views"
                        />
                        <Area
                          type="monotone"
                          dataKey="likes"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          name="Likes"
                        />
                        <Area
                          type="monotone"
                          dataKey="streams"
                          stroke="#ffc658"
                          fill="#ffc658"
                          name="Streams"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p>No performance data available</p>
                    </div>
                  )}
                </CardContent>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="comparison" className="mt-4">
            {/* Artist Comparison */}
            <Card className="shadow-md rounded-lg">
              <CardHeader>
                <CardTitle>Artist Comparison</CardTitle>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare artists based on streams and monthly listeners.
                  </p>
                  {isLoadingComparison ? (
                    <div className="h-80 flex items-center justify-center">
                      <p>Loading comparison data...</p>
                    </div>
                  ) : artistComparisonData?.length ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={artistComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="artist" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="streams"
                          fill="#8884d8"
                          name="Total Streams"
                        />
                        <Bar
                          dataKey="monthlyListeners"
                          fill="#82ca9d"
                          name="Monthly Listeners"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p>No comparison data available</p>
                    </div>
                  )}
                </CardContent>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  content: string;
  onCopy: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  content,
  onCopy,
}) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button variant="ghost" size="icon" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};
