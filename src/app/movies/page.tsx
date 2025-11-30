"use client";

import {
  getStatsData,
  formatNumber,
  getChartData,
  getSortedByValue,
} from "@/lib/data";
import { StatCard } from "@/components/stats/StatCard";
import { MediaCard } from "@/components/stats/MediaCard";
import { BarChart } from "@/components/stats/BarChart";
import { PieChart } from "@/components/stats/PieChart";
import { ProgressBar } from "@/components/stats/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, Film, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function MoviesPage() {
  const data = getStatsData();
  const t = useTranslations();

  if (!data) return null;

  const movies = data.movies;

  const genreData = getSortedByValue(movies.by_genre, (val) => val, true);
  const yearData = getChartData(movies.plays.by_year);
  const monthData = getChartData(movies.plays.by_month);
  const dayData = getChartData(movies.plays.by_day_of_week);
  const hourData = Object.entries(movies.plays.by_hour).map(
    ([hour, value]) => ({
      name: `${hour}:00`,
      value,
    })
  );

  const topCountries = getSortedByValue(
    movies.by_country,
    (val) => val,
    true
  ).slice(0, 10);
  const ratingDistribution = Object.entries(movies.all_ratings)
    .filter(([, count]) => count > 0)
    .map(([rating, count]) => ({
      name: `${rating} ★`,
      value: count,
    }));

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <Link
            href="/"
            className="text-xs sm:text-sm text-blue-500 hover:underline mb-1 sm:mb-2 block"
          >
            ← {t("movies.backToDashboard")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Film className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("movies.title")}
          </h1>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("movies.totalMovies")}
          value={formatNumber(movies.stats.plays.total)}
          icon={Play}
          description={`${movies.stats.plays.per_day.toFixed(1)} ${t(
            "dashboard.perDay"
          )}`}
        />
        <StatCard
          title={t("movies.totalHours")}
          value={formatNumber(movies.stats.hours.total)}
          icon={Clock}
          description={`${movies.stats.hours.per_month.toFixed(1)} ${t(
            "dashboard.hoursPerMonth"
          )}`}
        />
        <StatCard
          title={t("movies.uniqueMovies")}
          value={Object.keys(movies.users_top_10).length}
          icon={Film}
        />
        <StatCard
          title={t("movies.avgPerYear")}
          value={formatNumber(Math.round(movies.stats.plays.per_year))}
          icon={TrendingUp}
          description={t("movies.moviesWatched")}
        />
      </div>

      {/* Top 10 Movies */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t("movies.yourTop10")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-4">
          {Object.entries(movies.users_top_10).map(([id, movie], index) => (
            <MediaCard
              key={id}
              poster={movie.poster}
              runtime={movie.runtime}
              subtitle={`#${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Highest Rated */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t("movies.highestRated")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-4">
          {Object.entries(movies.highest_rated).map(([id, movie]) => (
            <MediaCard key={id} poster={movie.poster} rating={movie.rating} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <BarChart
          data={yearData}
          title={t("movies.moviesByYear")}
          maxItems={20}
        />
        <BarChart
          data={monthData}
          title={t("movies.moviesByMonth")}
          maxItems={12}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <BarChart data={dayData} title={t("movies.moviesByDay")} maxItems={7} />
        <BarChart
          data={hourData.filter((h) => h.value > 0)}
          title={t("movies.moviesByHour")}
          maxItems={24}
        />
      </div>

      {/* Genre & Country Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <PieChart
          data={genreData.map((g) => ({ name: g.key, value: g.value }))}
          title={t("movies.moviesByGenre")}
          maxItems={10}
        />
        <PieChart
          data={topCountries.map((c) => ({ name: c.key, value: c.value }))}
          title={t("movies.moviesByCountry")}
          maxItems={10}
        />
      </div>

      {/* Rating Distribution */}
      {ratingDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("movies.ratingDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(movies.all_ratings).map(([rating, count]) => (
                <div key={rating} className="text-center p-3 sm:p-4 border rounded">
                  <p className="text-2xl sm:text-3xl font-bold">{count}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {rating} {t("movies.stars")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t("movies.watchlistProgress")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(movies.list_progress).map(([listName, progress]) => (
            <ProgressBar
              key={listName}
              label={listName.toUpperCase()}
              value={progress.watched}
              max={progress.total}
            />
          ))}
        </CardContent>
      </Card>

      {/* Release Years */}
      <Card>
        <CardHeader>
          <CardTitle>{t("movies.moviesByReleaseYear")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getSortedByValue(movies.by_released_year, (val) => val, true)
              .filter((item) => item.value > 0)
              .slice(0, 20)
              .map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{item.key}</span>
                  <div className="flex items-center gap-4 flex-1 ml-4">
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...Object.values(movies.by_released_year)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
