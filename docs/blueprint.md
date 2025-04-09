# **App Name**: AfroScribe

## Core Features:

- Song Input: Accepts a song link (YouTube or Audiomack) or file upload for analysis.
- Lyric Transcription: Transcribes the song's lyrics using the Whisper API to generate an accurate text transcript.
- Content Analysis: Analyzes lyrics using GPT-4 tool to extract summary, themes, punchlines, mood, structure, and cultural references.
- Insight Display: Presents the AI-generated insights in a structured, user-friendly format.
- Content Export: Adds "copy to clipboard" functionality for easy content sharing.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a professional feel.
- Secondary color: Light Gray (#F5F5F5) for clean backgrounds.
- Accent color: Vibrant Teal (#00BCD4) for highlighting key elements and actions.
- Use a card-based layout (similar to shadcn/ui) for presenting song insights.
- Use simple, consistent icons to represent song aspects like theme, mood, and structure.
- Subtle fade-in animations for displaying insights.

## Original User Request:
Fire — let’s break down the **AI Afrobeats Music Summary + Insight Tool**. This idea is underrated, but **super powerful** for fans, music blogs, lyric pages, A&R teams, and playlist curators.

---

## **What It Does (At a Glance)**

A user drops a **song link** (YouTube, Audiomack, or file), and the AI:
- Transcribes the lyrics using **Whisper**
- Analyzes the theme, vibe, and mood
- Pulls out:
  - Song summary
  - Top punchlines
  - Song structure (verse, chorus, etc.)
  - Cultural references
  - "What the song really means"
- Bonus: Suggests similar tracks or artists

---

## **Sample Output (e.g. “Burna Boy - Last Last”)**
**Summary**:  
“Last Last” reflects heartbreak wrapped in a highlife bounce. It samples Toni Braxton’s “He Wasn’t Man Enough” and flips it into a breakup anthem.

**Theme**:  
- Emotional pain  
- Self-medication (igbo and shayo)  
- Fame and relationships

**Top Punchlines**:  
- “I need igbo and shayo”  
- “You go chop breakfast”

**Mood**: Reflective, raw, self-aware.

**Structure**:  
- Hook: “I need igbo and shayo…”  
- Verse 1: The story of heartbreak  
- Verse 2: Fame, pride, regret

**Cultural Impact**:  
- The phrase “breakfast” became slang for heartbreak.
- The song went viral worldwide, becoming a global Afro heartbreak anthem.

---

## **Tech Stack Overview**

| Layer      | Tool |
|------------|------|
| Transcription | **Whisper API** or `faster-whisper` |
| Summarization | **OpenAI GPT-4** (with structured prompt) |
| Frontend | **Next.js 14** + **Tailwind** + **shadcn/ui** |
| File Handling | Supabase Storage / Cloudinary (optional) |
| Deployment | Vercel |
| Bonus (Similar Songs) | Sentence embeddings + Supabase vector store |

---

## **How It Works (Flow)**

1. **User uploads or pastes a link**
   - Upload an MP3 or paste a YouTube/Audiomack link

2. **Transcribe with Whisper**
   - Get the lyrics

3. **Send to GPT-4**
   - Use structured prompt:
     ```
     Summarize this song. Include:
     - Summary
     - Theme
     - Top punchlines
     - Mood
     - Cultural significance
     ```

4. **Display result**
   - Clean UI
   - “Copy to clipboard” / “Export to blog” button
   - Share as post or tweet

---

## **Who Will Love This**
- **Afrobeats fans** who want to *feel* the lyrics
- **Content creators** (music pages, TikTok reviewers)
- **Playlisters** who want insights into themes
- **Bloggers** & **music newsletters**
- **Music journalists**

---

## **Monetization Ideas**
- Add a Pro plan: download as PDF, export as blog post
- Integrate with Spotify/Audiomack + charge artists for writeups
- Allow brands to sponsor “top insights of the week”

---

## Want to Build It Now?

I can scaffold this in **Next.js** with:
- Upload/URL input
- Whisper + GPT-4 hooks
- Insight card UI (shadcn-based)
- Option to save/share

Let me know if you want:
- Audio upload first or YouTube link support?
- Figma-style mock or GitHub-ready project?

We can make this a tool that even culture blogs like PulseNG would want to embed.
  