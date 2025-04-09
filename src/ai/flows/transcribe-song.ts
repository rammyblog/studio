'use server';
/**
 * @fileOverview A song transcription AI agent.
 *
 * - transcribeSong - A function that handles the song transcription process from a link.
 * - TranscribeSongInput - The input type for the transcribeSong function.
 * - TranscribeSongOutput - The return type for the transcribeSong function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getYoutubeVideoMetadata} from '@/services/youtube';
import {getAudiomackTrackMetadata} from '@/services/audiomack';

const TranscribeSongInputSchema = z.object({
  songLink: z.string().describe('The URL of the song (YouTube or Audiomack).'),
});
export type TranscribeSongInput = z.infer<typeof TranscribeSongInputSchema>;

const TranscribeSongOutputSchema = z.object({
  lyrics: z.string().describe('The transcribed lyrics of the song.'),
});
export type TranscribeSongOutput = z.infer<typeof TranscribeSongOutputSchema>;

export async function transcribeSong(input: TranscribeSongInput): Promise<TranscribeSongOutput> {
  return transcribeSongFlow(input);
}

const transcribeSongPrompt = ai.definePrompt({
  name: 'transcribeSongPrompt',
  input: {
    schema: z.object({
      songLink: z.string().describe('The URL of the song (YouTube or Audiomack).'),
      title: z.string().describe('The title of the song.'),
      description: z.string().describe('The description of the song.'),
    }),
  },
  output: {
    schema: z.object({
      lyrics: z.string().describe('The transcribed lyrics of the song.'),
    }),
  },
  prompt: `You are an AI that transcribes song lyrics from the given song information.

  Song Title: {{{title}}}
  Song Description: {{{description}}}

  Please provide the transcribed lyrics:
  `,
});

const transcribeSongFlow = ai.defineFlow<
  typeof TranscribeSongInputSchema,
  typeof TranscribeSongOutputSchema
>({
  name: 'transcribeSongFlow',
  inputSchema: TranscribeSongInputSchema,
  outputSchema: TranscribeSongOutputSchema,
},
async input => {
  let title: string;
  let description: string;

  if (input.songLink.includes('youtube.com')) {
    const videoMetadata = await getYoutubeVideoMetadata(input.songLink);
    title = videoMetadata.title;
    description = videoMetadata.description;
  console.log(videoMetadata)

  } else if (input.songLink.includes('audiomack.com')) {
    const trackMetadata = await getAudiomackTrackMetadata(input.songLink);
    title = trackMetadata.title;
    description = `Artist: ${trackMetadata.artist}`;
  } else {
    throw new Error('Unsupported link type. Only YouTube and Audiomack links are supported.');
  }


  const {output} = await transcribeSongPrompt({
    songLink: input.songLink,
    title: title,
    description: description,
  });
  return output!;
});
