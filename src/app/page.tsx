'use client';

import { getStatsData, formatNumber, getTMDBImageUrl } from "@/lib/data";
import { StatCard } from "@/components/stats/StatCard";
import { MediaCard } from "@/components/stats/MediaCard";
import { ProgressBar } from "@/components/stats/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, Star, List, Film, Tv, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const data = getStatsData();
  const t = useTranslations();

  // Si pas de données, ne rien afficher (RequireUpload va rediriger)
  if (!data) {
    return null;
  }

  const traktMovies = Object.entries(data.trakt.most_watched_movies).slice(0, 5);
  const traktShows = Object.entries(data.trakt.most_watched_shows).slice(0, 5);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Hero Header with Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 animate-gradient" />
        <div className="relative glass p-8 md:p-12 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={data.pfp}
                alt={data.username}
                width={96}
                height={96}
                className="rounded-full ring-4 ring-white/20 shadow-2xl"
              />
            </motion.div>
            <div className="text-white drop-shadow-lg">
              <h1 className="text-4xl font-bold mb-2 text-shadow">{data.username}</h1>
              <p className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('dashboard.title')}
              </p>
            </div>
          </div>
          <Link href="/wrapped">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/30 backdrop-blur-md hover:bg-white/40 px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 shadow-lg border border-white/30"
            >
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse drop-shadow-md" />
              <span className="font-bold text-white text-lg drop-shadow-md">{t('dashboard.wrappedCta')}</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* All Time Stats - Bento Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          {t('dashboard.allTimeStats')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { title: t('dashboard.totalPlays'), value: data.all_time_stats.plays, icon: Play, gradient: "from-blue-500 to-cyan-500" },
            { title: t('dashboard.hoursWatched'), value: data.all_time_stats.hours, icon: Clock, gradient: "from-purple-500 to-pink-500" },
            { title: t('dashboard.collected'), value: data.all_time_stats.collected, icon: Film, gradient: "from-orange-500 to-red-500" },
            { title: t('dashboard.ratings'), value: data.all_time_stats.ratings, icon: Star, gradient: "from-yellow-500 to-orange-500" },
            { title: t('dashboard.lists'), value: data.all_time_stats.lists, icon: List, gradient: "from-green-500 to-emerald-500" },
            { title: t('dashboard.comments'), value: data.all_time_stats.comments, icon: List, gradient: "from-indigo-500 to-purple-500" },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={item}>
              <StatCard
                title={stat.title}
                value={formatNumber(stat.value)}
                icon={stat.icon}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* First Play - Featured Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass hover-lift overflow-hidden border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl">{t('dashboard.firstPlay')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6 relative">
            {data.first_play.movie_logo && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <Image
                  src={data.first_play.movie_logo}
                  alt={data.first_play.movie}
                  width={200}
                  height={120}
                  className="rounded-lg object-contain shadow-lg"
                />
              </motion.div>
            )}
            <div>
              <h3 className="text-3xl font-bold mb-2">{data.first_play.movie}</h3>
              <p className="text-muted-foreground text-lg">
                {data.first_play.date} at {data.first_play.time}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TV vs Movies Overview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div variants={item}>
          <Link href="/tv" className="block">
            <Card className="glass overflow-hidden border-white/10 group hover-lift cursor-pointer relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 group-hover:from-blue-500/10 group-hover:to-blue-500/20 transition-all pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between relative">
                <CardTitle className="text-2xl">📺 {t('dashboard.tvShows')}</CardTitle>
                <Tv className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('dashboard.totalHours')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      {formatNumber(data.tv.stats.hours.total)}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('dashboard.episodes')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {formatNumber(data.tv.stats.plays.total)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">{t('dashboard.topGenres')}</p>
                  {Object.entries(data.tv.by_genre)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([genre, count]) => (
                      <ProgressBar
                        key={genre}
                        label={genre}
                        value={count}
                        max={Object.values(data.tv.by_genre)[0]}
                        showPercentage={false}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/movies" className="block">
            <Card className="glass overflow-hidden border-white/10 group hover-lift cursor-pointer relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 group-hover:from-purple-500/10 group-hover:to-purple-500/20 transition-all pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between relative">
                <CardTitle className="text-2xl">🎬 {t('dashboard.movies')}</CardTitle>
                <Film className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('dashboard.totalHours')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {formatNumber(data.movies.stats.hours.total)}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('dashboard.movies')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {formatNumber(data.movies.stats.plays.total)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">{t('dashboard.topGenres')}</p>
                  {Object.entries(data.movies.by_genre)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([genre, count]) => (
                      <ProgressBar
                        key={genre}
                        label={genre}
                        value={count}
                        max={Object.values(data.movies.by_genre)[0]}
                        showPercentage={false}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Trakt Most Watched */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div variants={item}>
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">{t('dashboard.traktMostWatchedMovies')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {traktMovies.map(([rank, movie]) => (
                  <motion.div
                    key={rank}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary w-8">
                        {rank}
                      </span>
                      <div>
                        <p className="font-semibold">{movie.title}</p>
                        <p className="text-sm text-muted-foreground">{movie.play_count}</p>
                      </div>
                    </div>
                    {movie.watched && (
                      <span className="text-green-500 text-sm font-semibold">✓ {t('dashboard.watched')}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">{t('dashboard.traktMostWatchedShows')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {traktShows.map(([rank, show]) => (
                  <motion.div
                    key={rank}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary w-8">
                        {rank}
                      </span>
                      <div>
                        <p className="font-semibold">{show.title}</p>
                        <p className="text-sm text-muted-foreground">{show.play_count}</p>
                      </div>
                    </div>
                    {show.watched && (
                      <span className="text-green-500 text-sm font-semibold">✓ {t('dashboard.watched')}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Your Top Content Preview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('dashboard.yourTopTvShows')}</h2>
            <Link href="/tv" className="text-primary hover:underline font-medium flex items-center gap-1 group text-sm whitespace-nowrap">
              {t('dashboard.viewAll')}
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.tv.users_top_10)
              .slice(0, 5)
              .map(([id, show]) => (
                <motion.div
                  key={id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MediaCard
                    poster={show.poster}
                    runtime={show.runtime}
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('dashboard.yourTopMovies')}</h2>
            <Link href="/movies" className="text-primary hover:underline font-medium flex items-center gap-1 group text-sm whitespace-nowrap">
              {t('dashboard.viewAll')}
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.movies.users_top_10)
              .slice(0, 5)
              .map(([id, movie]) => (
                <motion.div
                  key={id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MediaCard
                    poster={movie.poster}
                    runtime={movie.runtime}
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
