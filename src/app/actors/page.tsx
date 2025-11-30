"use client";

import { getStatsData, formatNumber } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { PersonCard } from "@/components/stats/PersonCard";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Film, Tv } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function ActorsPage() {
  const data = getStatsData();
  const t = useTranslations();
  const { formatCount } = useI18n();

  if (!data) return null;

  const actors = data.actors;

  // Sort actors by total appearances (movies + shows + episodes)
  const sortedActors = [...actors].sort((a, b) => {
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
            ← {t("actors.backToDashboard")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("actors.title")}
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            {t("actors.description")}
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
                  {t("actors.totalActors")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {formatNumber(actors.length)}
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("actors.mostMovies")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {Math.max(...actors.map((a) => a.movies.length))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    actors.find(
                      (a) =>
                        a.movies.length ===
                        Math.max(...actors.map((a) => a.movies.length))
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
                  {t("actors.mostEpisodes")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {Math.max(...actors.map((a) => a.episode))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    actors.find(
                      (a) =>
                        a.episode === Math.max(...actors.map((a) => a.episode))
                    )?.name
                  }
                </p>
              </div>
              <Tv className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actors List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("actors.allActors", { count: actors.length })}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedActors.map((actor) => {
            const totalAppearances =
              actor.movies.length + actor.shows.length + actor.episode;
            const subtitle = [
              actor.movies.length > 0 &&
                formatCount(
                  actor.movies.length,
                  "counts.movieSingular",
                  "counts.moviePlural"
                ),
              actor.shows.length > 0 &&
                formatCount(
                  actor.shows.length,
                  "counts.showSingular",
                  "counts.showPlural"
                ),
              actor.episode > 0 &&
                formatCount(
                  actor.episode,
                  "counts.episodeSingular",
                  "counts.episodePlural"
                ),
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <PersonCard
                key={actor.name}
                name={actor.name}
                image={actor.image}
                subtitle={subtitle}
                items={[...actor.movies, ...actor.shows]}
                maxItems={5}
              />
            );
          })}
        </div>
      </div>

      {/* Top by Movies */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("actors.topByMovies")}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...actors]
            .sort((a, b) => b.movies.length - a.movies.length)
            .slice(0, 12)
            .map((actor) => (
              <PersonCard
                key={actor.name}
                name={actor.name}
                image={actor.image}
                subtitle={formatCount(
                  actor.movies.length,
                  "counts.movieSingular",
                  "counts.moviePlural"
                )}
                items={actor.movies}
                maxItems={5}
              />
            ))}
        </div>
      </div>

      {/* Top by TV Episodes */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("actors.topByEpisodes")}
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...actors]
            .filter((a) => a.episode > 0)
            .sort((a, b) => b.episode - a.episode)
            .slice(0, 12)
            .map((actor) => (
              <PersonCard
                key={actor.name}
                name={actor.name}
                image={actor.image}
                subtitle={`${formatCount(
                  actor.episode,
                  "counts.episodeSingular",
                  "counts.episodePlural"
                )} across ${formatCount(
                  actor.shows.length,
                  "counts.showSingular",
                  "counts.showPlural"
                )}`}
                items={actor.shows}
                maxItems={5}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
