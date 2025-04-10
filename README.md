# Music Analytics Dashboard

A modern web application for analyzing and comparing music data, built with Next.js and the Spotify API.

## Features

- **Song Analysis**: Get detailed insights about any song, including themes, mood, and cultural references
- **Performance Tracking**: View performance metrics for songs over time
- **Artist Comparison**: Compare artists based on various metrics
- **Modern UI**: Clean, responsive design with interactive charts

## Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account
- Spotify API Credentials

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd music-analytics
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

4. Add your Spotify API credentials to the `.env` file:

   ```bash
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create a new application
4. Copy the Client ID and Client Secret
5. Add these to your `.env` file

## Features in Detail

### Song Analysis

- Paste a song link to get:
  - Song summary
  - Key themes
  - Top punchlines
  - Mood analysis
  - Song structure
  - Cultural references
  - Similar song recommendations

### Performance Tracking

- View performance metrics over time:
  - Views
  - Likes
  - Streams
- Compare performance across different time periods
- Track growth trends

### Artist Comparison

- Compare multiple artists
- View metrics like:
  - Total streams
  - Monthly listeners
  - Popularity
  - Track performance

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: Spotify Web API
- **State Management**: React Query

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
