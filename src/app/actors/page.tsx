'use client';

import { getStatsData, formatNumber } from "@/lib/data";
import { PersonCard } from "@/components/stats/PersonCard";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Film, Tv } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function ActorsPage() {
    const data = getStatsData();
    const t = useTranslations();

    if (!data) return null;

    const actors = data.actors;

    // Sort actors by total appearances (movies + shows + episodes)
    const sortedActors = [...actors].sort((a, b) => {
        const aTotal = a.movies.length + a.shows.length + a.episode;
        const bTotal = b.movies.length + b.shows.length + b.episode;
        return bTotal - aTotal;
    });

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/" className="text-sm text-blue-500 hover:underline mb-2 block">
                        ← {t('actors.backToDashboard')}
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        {t('actors.title')}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t('actors.description')}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('actors.totalActors')}</p>
                                <p className="text-3xl font-bold">{formatNumber(actors.length)}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('actors.mostMovies')}</p>
                                <p className="text-3xl font-bold">
                                    {Math.max(...actors.map((a) => a.movies.length))}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {actors.find((a) => a.movies.length === Math.max(...actors.map((a) => a.movies.length)))?.name}
                                </p>
                            </div>
                            <Film className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('actors.mostEpisodes')}</p>
                                <p className="text-3xl font-bold">
                                    {Math.max(...actors.map((a) => a.episode))}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {actors.find((a) => a.episode === Math.max(...actors.map((a) => a.episode)))?.name}
                                </p>
                            </div>
                            <Tv className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actors List */}
            <div>
                <h2 className="text-2xl font-bold mb-4">All Actors ({actors.length})</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sortedActors.map((actor) => {
                        const totalAppearances = actor.movies.length + actor.shows.length + actor.episode;
                        const subtitle = [
                            actor.movies.length > 0 && `${actor.movies.length} movie${actor.movies.length !== 1 ? 's' : ''}`,
                            actor.shows.length > 0 && `${actor.shows.length} show${actor.shows.length !== 1 ? 's' : ''}`,
                            actor.episode > 0 && `${actor.episode} episode${actor.episode !== 1 ? 's' : ''}`,
                        ]
                            .filter(Boolean)
                            .join(' • ');

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
                <h2 className="text-2xl font-bold mb-4">Top Actors by Movies</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...actors]
                        .sort((a, b) => b.movies.length - a.movies.length)
                        .slice(0, 12)
                        .map((actor) => (
                            <PersonCard
                                key={actor.name}
                                name={actor.name}
                                image={actor.image}
                                subtitle={`${actor.movies.length} movies`}
                                items={actor.movies}
                                maxItems={5}
                            />
                        ))}
                </div>
            </div>

            {/* Top by TV Episodes */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Top Actors by TV Episodes</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...actors]
                        .filter((a) => a.episode > 0)
                        .sort((a, b) => b.episode - a.episode)
                        .slice(0, 12)
                        .map((actor) => (
                            <PersonCard
                                key={actor.name}
                                name={actor.name}
                                image={actor.image}
                                subtitle={`${actor.episode} episodes across ${actor.shows.length} show${actor.shows.length !== 1 ? 's' : ''}`}
                                items={actor.shows}
                                maxItems={5}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
