'use client';

import { getStatsData, formatNumber, getChartData, getSortedByValue } from "@/lib/data";
import { StatCard } from "@/components/stats/StatCard";
import { MediaCard } from "@/components/stats/MediaCard";
import { BarChart } from "@/components/stats/BarChart";
import { PieChart } from "@/components/stats/PieChart";
import { ProgressBar } from "@/components/stats/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, Tv, TrendingUp, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function TVPage() {
    const data = getStatsData();
    const t = useTranslations();

    if (!data) return null;

    const tv = data.tv;

    const genreData = getSortedByValue(tv.by_genre, (val) => val, true);
    const yearData = getChartData(tv.plays.by_year);
    const monthData = getChartData(tv.plays.by_month);
    const dayData = getChartData(tv.plays.by_day_of_week);
    const hourData = Object.entries(tv.plays.by_hour).map(([hour, value]) => ({
        name: `${hour}:00`,
        value,
    }));

    const topCountries = getSortedByValue(tv.by_country, (val) => val, true).slice(0, 10);
    const ratingDistribution = Object.entries(tv.all_ratings)
        .filter(([, count]) => count > 0)
        .map(([rating, count]) => ({
            name: `${rating} ★`,
            value: count,
        }));

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient" />
                <div className="relative glass p-8">
                    <Link href="/" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t('tv.backToDashboard')}
                    </Link>
                    <h1 className="text-4xl font-bold flex items-center gap-3 text-white mt-2">
                        <Tv className="h-10 w-10" />
                        {t('tv.title')}
                    </h1>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                <motion.div variants={item}>
                    <StatCard
                        title={t('tv.totalEpisodes')}
                        value={formatNumber(tv.stats.plays.total)}
                        icon={Play}
                        description={`${tv.stats.plays.per_day.toFixed(1)} ${t('dashboard.perDay')}`}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title={t('tv.totalHours')}
                        value={formatNumber(tv.stats.hours.total)}
                        icon={Clock}
                        description={`${tv.stats.hours.per_month.toFixed(1)} ${t('dashboard.hoursPerMonth')}`}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title={t('tv.uniqueShows')}
                        value={Object.keys(tv.users_top_10).length}
                        icon={Tv}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title={t('tv.avgPerYear')}
                        value={formatNumber(Math.round(tv.stats.plays.per_year))}
                        icon={TrendingUp}
                        description={t('tv.episodesWatched')}
                    />
                </motion.div>
            </motion.div>

            {/* Top 10 Shows */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                    {t('tv.yourTop10')}
                </h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4"
                >
                    {Object.entries(tv.users_top_10).map(([id, show], index) => (
                        <motion.div key={id} variants={item}>
                            <MediaCard
                                poster={show.poster}
                                runtime={show.runtime}
                                subtitle={`#${index + 1}`}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Highest Rated */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
                    {t('tv.highestRated')}
                </h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4"
                >
                    {Object.entries(tv.highest_rated).map(([id, show]) => (
                        <motion.div key={id} variants={item}>
                            <MediaCard
                                poster={show.poster}
                                rating={show.rating}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
            >
                <motion.div variants={item}>
                    <BarChart data={yearData} title={t('tv.episodesByYear')} maxItems={20} />
                </motion.div>
                <motion.div variants={item}>
                    <BarChart data={monthData} title={t('tv.episodesByMonth')} maxItems={12} />
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
            >
                <motion.div variants={item}>
                    <BarChart data={dayData} title={t('tv.episodesByDay')} maxItems={7} />
                </motion.div>
                <motion.div variants={item}>
                    <BarChart
                        data={hourData.filter((h) => h.value > 0)}
                        title={t('tv.episodesByHour')}
                        maxItems={24}
                    />
                </motion.div>
            </motion.div>

            {/* Genre & Country Distribution */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
            >
                <motion.div variants={item}>
                    <PieChart
                        data={genreData.map((g) => ({ name: g.key, value: g.value }))}
                        title={t('tv.showsByGenre')}
                        maxItems={10}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <PieChart
                        data={topCountries.map((c) => ({ name: c.key, value: c.value }))}
                        title={t('tv.showsByCountry')}
                        maxItems={10}
                    />
                </motion.div>
            </motion.div>

            {/* Rating Distribution */}
            {ratingDistribution.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                {t('tv.ratingDistribution')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(tv.all_ratings).map(([rating, count]) => (
                                    <motion.div
                                        key={rating}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center p-6 glass rounded-xl hover-lift border border-white/10"
                                    >
                                        <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                            {count}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {rating} {t('tv.stars')}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* List Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle>{t('tv.watchlistProgress')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(tv.list_progress).map(([listName, progress]) => (
                            <ProgressBar
                                key={listName}
                                label={listName.toUpperCase()}
                                value={progress.watched}
                                max={progress.total}
                            />
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Release Years */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle>{t('tv.showsByReleaseYear')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {getSortedByValue(tv.by_released_year, (val) => val, true)
                                .filter((item) => item.value > 0)
                                .slice(0, 15)
                                .map((item, index) => (
                                    <motion.div
                                        key={item.key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.02 }}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-sm font-semibold w-16">{item.key}</span>
                                        <div className="flex items-center gap-4 flex-1 ml-4">
                                            <div className="flex-1 bg-secondary/30 rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(item.value / Math.max(...Object.values(tv.by_released_year))) * 100}%`
                                                    }}
                                                    transition={{ delay: 0.7 + index * 0.02, duration: 0.5 }}
                                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12 text-right font-medium">
                                                {item.value}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
