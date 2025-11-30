"use client";

import { getStatsData, formatNumber } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { PersonCard } from "@/components/stats/PersonCard";
import { Card, CardContent } from "@/components/ui/card";
import { Clapperboard, Film, Tv } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function DirectorsPage() {
  const data = getStatsData();
  const t = useTranslations();
  const { formatCount } = useI18n();

  if (!data) return null;

  const directors = data.directors;

  // Sort directors by total appearances (movies + shows + episodes)
  const sortedDirectors = [...directors].sort((a, b) => {
    const aTotal = a.movies.length + a.shows.length + a.episode;
    const bTotal = b.movies.length + b.shows.length + b.episode;
    return bTotal - aTotal;
  });

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <Link
            href="/"
            className="text-xs sm:text-sm text-blue-500 hover:underline mb-1 sm:mb-2 block"
          >
            ← {t("directors.backToDashboard")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Clapperboard className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("directors.title")}
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            {t("directors.description")}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("directors.totalDirectors")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatNumber(directors.length)}
                </p>
              </div>
              <Clapperboard className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("directors.mostMovies")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {Math.max(...directors.map((d) => d.movies.length))}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                  {
                    directors.find(
                      (d) =>
                        d.movies.length ===
                        Math.max(...directors.map((d) => d.movies.length))
                    )?.name
                  }
                </p>
              </div>
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("directors.mostEpisodes")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {Math.max(...directors.map((d) => d.episode))}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                  {
                    directors.find(
                      (d) =>
                        d.episode ===
                        Math.max(...directors.map((d) => d.episode))
                    )?.name
                  }
                </p>
              </div>
              <Tv className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directors List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("directors.allDirectors", { count: directors.length })}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedDirectors.map((director) => {
            const totalAppearances =
              director.movies.length + director.shows.length + director.episode;
            const subtitle = [
              director.movies.length > 0 &&
                formatCount(
                  director.movies.length,
                  "counts.movieSingular",
                  "counts.moviePlural"
                ),
              director.shows.length > 0 &&
                formatCount(
                  director.shows.length,
                  "counts.showSingular",
                  "counts.showPlural"
                ),
              director.episode > 0 &&
                formatCount(
                  director.episode,
                  "counts.episodeSingular",
                  "counts.episodePlural"
                ),
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <PersonCard
                key={director.name}
                name={director.name}
                image={director.image}
                subtitle={subtitle}
                items={[...director.movies, ...director.shows]}
                maxItems={5}
              />
            );
          })}
        </div>
      </div>

      {/* Top by Movies */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("directors.topByMovies")}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...directors]
            .sort((a, b) => b.movies.length - a.movies.length)
            .slice(0, 12)
            .map((director) => (
              <PersonCard
                key={director.name}
                name={director.name}
                image={director.image}
                subtitle={formatCount(
                  director.movies.length,
                  "counts.movieSingular",
                  "counts.moviePlural"
                )}
                items={director.movies}
                maxItems={5}
              />
            ))}
        </div>
      </div>

      {/* Top by TV Episodes */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("directors.topByEpisodes")}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...directors]
            .filter((d) => d.episode > 0)
            .sort((a, b) => b.episode - a.episode)
            .slice(0, 12)
            .map((director) => (
              <PersonCard
                key={director.name}
                name={director.name}
                image={director.image}
                subtitle={`${formatCount(
                  director.episode,
                  "counts.episodeSingular",
                  "counts.episodePlural"
                )} across ${formatCount(
                  director.shows.length,
                  "counts.showSingular",
                  "counts.showPlural"
                )}`}
                items={director.shows}
                maxItems={5}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
