# 🎬 Trakt Stats

An interactive web application to visualize and analyze your Trakt viewing statistics in an elegant and detailed way.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Features

### 📊 Main Dashboard

- Overview of all your viewing statistics
- Global stats: movies watched, TV shows followed, hours spent
- Top 10 favorite movies and shows
- Interactive charts by year, month, day, and hour
- Distribution by genre, country, and decade

### 🎥 Movies Page

- Detailed statistics on your watched movies
- Top 10 most-watched movies
- Analysis by genre, year, month, and country
- Distribution by decade and certifications
- Viewing trends over time

### 📺 TV Shows Page

- Complete statistics on your TV shows
- Top 10 favorite series
- Analysis by genre, network, and country
- Detailed temporal breakdown
- Binge-watching statistics

### 🎭 Actors & Directors

- Top actors with number of appearances
- Favorite directors
- Associated movies and shows
- Photos and detailed information

### 🎉 Annual Wrapped

- Animated recap of your year (Spotify Wrapped style)
- 17 interactive slides with smooth animations
- Fun stats: night owl vs early bird, favorite binge day
- Personalized insights on your viewing habits
- Social media sharing

### 🌓 Additional Features

- **Dark mode** with automatic system detection
- **Multilingual support** (French and English)
- **Responsive design** for mobile, tablet, and desktop
- **Smooth animations** with Framer Motion
- **File upload** with validation and progress bar
- **Glass morphism** for a modern interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cherifad/trakt_stats.git
cd trakt_stats
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### 📁 Get Your Trakt Data

This project includes an **enhanced version** of the Python script with **year-specific filtering** for accurate Wrapped statistics.

1. Navigate to the Python script directory:

   ```bash
   cd trakt_vip_stats
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your credentials:

   ```env
   username = "your_trakt_username"
   trakt_client_id = "your_trakt_client_id"
   trakt_client_secret = "your_trakt_client_secret"
   tmdb_api_key = "your_tmdb_api_key"
   ```

   Get your credentials:

   - [Trakt Client ID & Secret](https://trakt.tv/oauth/applications)
   - [TMDB API Key](https://www.themoviedb.org/settings/api)

4. Run the script:

   ```bash
   python main.py run --save
   ```

5. The `all-time-stats.json` file will be generated - upload it to the web app!

> 💡 **Note**: Trakt does not provide a built-in data export feature. You must use the Python script to generate your statistics file.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Language**: [TypeScript 5](https://www.typescriptlang.org)

## 📦 Project Structure

```
trakt_stats/
├── src/
│   ├── app/                    # Next.js Pages (App Router)
│   │   ├── page.tsx           # Main dashboard
│   │   ├── movies/            # Movies page
│   │   ├── tv/                # TV shows page
│   │   ├── actors/            # Actors page
│   │   ├── directors/         # Directors page
│   │   ├── wrapped/           # Annual recap
│   │   └── upload/            # Upload page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── stats/            # Statistics components
│   │   └── wrapped/          # Wrapped components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities and helpers
│   └── messages/             # Translation files
├── public/                    # Static assets
└── trakt_vip_stats/          # Python backend (optional)
```

## 🎨 Customization

### Add shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

### Modify the Theme

Colors and styles are configurable in `src/app/globals.css` using CSS variables.

## 🌍 Internationalization

The application supports French and English. Translations are located in:

- `messages/fr.json` - French translations
- `messages/en.json` - English translations

## 🌐 Language in the URL

This app supports switching languages without a full page reload. Use the `lang` query parameter to force French when needed:

- English (default): no `lang` parameter in the URL
- French: `?lang=fr`

Components and pages will update the URL and localStorage when you change language so your preference persists across navigation.

## 🔒 Data & Privacy

- All data is stored **locally** in your browser (localStorage)
- No data is sent to external servers
- Your statistics remain **100% private**
- You can delete your data anytime from the upload page

## 📝 Production Build

```bash
npm run build
npm start
```

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the image
docker build -t trakt-stats .

# Run the container
docker run -p 3000:3000 trakt-stats
```

### Using Docker Compose

```bash
# Start the application
docker compose up -d

# Stop the application
docker compose down
```

### Pull from GitHub Container Registry

```bash
# Pull the latest image
docker pull ghcr.io/cherifad/trakt_stats:latest

# Run it
docker run -p 3000:3000 ghcr.io/cherifad/trakt_stats:latest
```

## 🚀 CI/CD

The project includes a GitHub Actions workflow that automatically:

- ✅ Builds the Next.js application
- 🐳 Creates Docker images for `linux/amd64` and `linux/arm64`
- 📦 Pushes images to GitHub Container Registry
- 🏷️ Tags images with branch names, version tags, and commit SHAs

Images are available at: `ghcr.io/cherifad/trakt_stats`

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [trakt_vip_stats](https://github.com/Ahmedazim7804/trakt_vip_stats) by [@Ahmedazim7804](https://github.com/Ahmedazim7804) for the original Python backend (enhanced with year filtering in this fork)
- [Trakt.tv](https://trakt.tv) for the API and data
- [TMDB](https://www.themoviedb.org) for images and metadata

## 📄 License

See the [LICENSE](LICENSE) file for more details.

---

Made with ❤️ for movie and TV show enthusiasts

## 📎 Python Scripts

### Enhanced Year Filtering 🎯

This repository includes an **improved version** of the [trakt_vip_stats](https://github.com/Ahmedazim7804/trakt_vip_stats) Python script with additional features:

#### Key Improvements:

- ✅ **Year-specific filtering** for accurate Wrapped statistics
- ✅ Separate data for current year vs all-time stats
- ✅ Fixed cumulative vs year-specific play counts
- ✅ Accurate "first play of the year" tracking
- ✅ Top 10 movies/shows filtered by year

#### What's Different?

The original script aggregates **all-time data**, which causes issues in the Wrapped feature. For example:

- November would show 350 plays (cumulative across all years)
- Instead of 29 plays (actual plays in November 2025)

Our enhanced version adds optional `year` parameters to key functions:

- `plays_by_time(year=2025)` - Get plays only for 2025
- `users_top_10_watched_shows(year=2025)` - Top shows for 2025
- `first_play(year=2025)` - First play of the year

#### Structure:

- `trakt_vip_stats/main.py` — Entry point for data collection
- `trakt_vip_stats/get_data/` — Modules to fetch history, ratings, and lists from Trakt API
- `trakt_vip_stats/parseData/` — **Enhanced** parsing helpers with year filtering
- `trakt_vip_stats/save.py` — Generates `all-time-stats.json` with both all-time AND year-specific data

#### Usage:

```bash
cd trakt_vip_stats
python main.py run --save  # Generates enhanced all-time-stats.json
```

See [trakt_vip_stats/README.md](trakt_vip_stats/README.md) for detailed documentation.

> 💡 **Note**: You don't need Python to run the web app if you already have an `all-time-stats.json` file. However, for the best Wrapped experience with accurate year-specific statistics, we recommend using our enhanced Python script.
