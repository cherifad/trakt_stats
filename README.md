# 🎬 Trakt Stats

Visualize and analyze your Trakt viewing statistics with an elegant, interactive web application.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Features

- 📊 **Dashboard** - Overview of all viewing statistics with interactive charts
- 🎥 **Movies & TV** - Detailed analysis by genre, year, country, and ratings
- 🎭 **Actors & Directors** - Top people with appearances and filmography
- 🎉 **Annual Wrapped** - Spotify-style animated recap with shareable insights
- 🌓 **Dark mode** - Automatic theme detection
- 🧪 **Demo Mode** - Try the app with sample data before uploading your own
- 🌍 **Multilingual** - French and English support
- 📱 **PWA** - Install as a mobile/desktop app, works offline
- 🎨 **Modern UI** - Glass morphism, smooth animations, responsive design

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/cherifad/trakt_stats.git
cd trakt_stats
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 📁 Get Your Trakt Data

Use the included Python script to generate your stats file:

```bash
cd trakt_vip_stats
pip install -r requirements.txt

# Create .env with your credentials
# username, trakt_client_id, trakt_client_secret, tmdb_api_key

python main.py run --save
```

Upload the generated `all-time-stats.json` to the web app.

**Get API credentials:**

- [Trakt](https://trakt.tv/oauth/applications) - Client ID & Secret
- [TMDB](https://www.themoviedb.org/settings/api) - API Key

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org) - React framework with App Router
- [Tailwind CSS 4](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [TypeScript](https://www.typescriptlang.org) - Type safety

## 🔒 Privacy

- All data stored locally in your browser
- No external servers or tracking
- 100% private - delete anytime from the upload page

## 📝 Production

```bash
npm run build
npm start
```

## 🐳 Docker

```bash
# Build and run
docker build -t trakt-stats .
docker run -p 3000:3000 trakt-stats

# Or use Docker Compose
docker compose up -d

# Or pull from registry
docker pull ghcr.io/cherifad/trakt_stats:latest
```

## 🤝 Contributing

Contributions welcome! Fork, create a feature branch, commit, and open a PR.

## 🙏 Credits

- [trakt_vip_stats](https://github.com/Ahmedazim7804/trakt_vip_stats) - Enhanced Python backend with year filtering
- [Trakt.tv](https://trakt.tv) - API and data
- [TMDB](https://www.themoviedb.org) - Images and metadata

## 📄 License

See [LICENSE](LICENSE) for details.

---

Made with ❤️ for movie and TV show enthusiasts
