"use client";

import { getStatsData, formatNumber, getTMDBImageUrl } from "@/lib/data";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/wrapped/ShareButtons";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { useSearchParams } from "next/navigation";

export default function WrappedPage() {
  const data = getStatsData();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const skipToEnd = searchParams.get("summary") === "true";
  const [currentSlide, setCurrentSlide] = useState(skipToEnd ? 17 : 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSlides = 18;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, nextSlide, prevSlide]);

  if (!data) return null;

  // Calculate insights for current year only
  const currentYear = new Date().getFullYear();

  // Use year-specific data from plays_current_year
  const currentYearTvData = data.tv.plays_current_year || data.tv.plays;
  const currentYearMovieData =
    data.movies.plays_current_year || data.movies.plays;

  const currentYearTvPlays = currentYearTvData.by_year[currentYear] || 0;
  const currentYearMoviePlays = currentYearMovieData.by_year[currentYear] || 0;
  const totalPlaysThisYear = currentYearTvPlays + currentYearMoviePlays;

  // Calculate hours for current year (estimate based on ratio)
  const totalAllTimePlays = data.all_time_stats.plays;
  const currentYearRatio = totalPlaysThisYear / (totalAllTimePlays || 1);
  const totalHoursThisYear = Math.round(
    data.all_time_stats.hours * currentYearRatio
  );

  // For simplicity, keep using all-time data for genres, actors, etc.
  // In a real scenario, you'd need year-filtered data from the backend
  const totalHours = data.all_time_stats.hours;
  const topGenres = Object.entries({
    ...data.tv.by_genre,
    ...data.movies.by_genre,
  }).reduce((acc, [genre, count]) => {
    acc[genre] = (acc[genre] || 0) + count;
    return acc;
  }, {} as Record<string, number>);
  const topGenre = Object.entries(topGenres).sort(([, a], [, b]) => b - a)[0];

  let translatedGenre = t("wrapped.defaultGenre");
  if (topGenre?.[0]) {
    const genreKey = topGenre[0];
    const translationKey = `genres.${genreKey}`;
    const translation = t(translationKey);
    // If translation returns the key itself, it means translation failed
    translatedGenre = translation === translationKey ? genreKey : translation;
  }

  const topMovie = Object.entries(
    data.movies.users_top_10_current_year || data.movies.users_top_10
  )[0];
  const topShow = Object.entries(
    data.tv.users_top_10_current_year || data.tv.users_top_10
  )[0];
  const topActor = data.actors[0];

  const mostActiveMonth = Object.entries(currentYearTvData.by_month).reduce(
    (max, [month, count]) => {
      const totalCount = count + (currentYearMovieData.by_month[month] || 0);
      return totalCount > (max.count || 0) ? { month, count: totalCount } : max;
    },
    { month: "", count: 0 }
  );

  let translatedMonth = mostActiveMonth.month;
  if (mostActiveMonth.month) {
    // The data has full month names (January, February...) but translation keys are short (Jan, Feb...)
    const monthKey = mostActiveMonth.month.substring(0, 3);
    const translationKey = `months.${monthKey}`;
    const translation = t(translationKey);
    translatedMonth =
      translation === translationKey ? mostActiveMonth.month : translation;
  }

  // Fun calculations
  const nightOwlHours = Object.entries(currentYearTvData.by_hour).reduce(
    (sum, [hour, count]) => {
      const h = parseInt(hour);
      return h >= 22 || h <= 4 ? sum + count : sum;
    },
    0
  );

  const earlyBirdHours = Object.entries(currentYearTvData.by_hour).reduce(
    (sum, [hour, count]) => {
      const h = parseInt(hour);
      return h >= 5 && h <= 8 ? sum + count : sum;
    },
    0
  );

  const peakHour = Object.entries(currentYearTvData.by_hour).reduce(
    (max, [hour, count]) =>
      count > max.count ? { hour: parseInt(hour), count } : max,
    { hour: 0, count: 0 }
  );

  const bingeDay = Object.entries(currentYearTvData.by_day_of_week).reduce(
    (max, [day, count]) => (count > max.count ? { day, count } : max),
    { day: "", count: 0 }
  );

  const totalCountries = new Set([
    ...Object.keys(data.tv.by_country || {}),
    ...Object.keys(data.movies.by_country || {}),
  ]).size;

  const yearSpan =
    Math.max(...Object.keys(data.tv.plays.by_year).map(Number)) -
    Math.min(...Object.keys(data.tv.plays.by_year).map(Number)) +
    1;

  const daysInCinema = Math.floor(totalHoursThisYear / 24);
  const weeksInCinema = Math.floor(daysInCinema / 7);

  const formatRuntime = (runtime: string) => {
    if (!runtime) return "";
    if (runtime.toLowerCase().includes("m")) return runtime;
    return `${runtime} min`;
  };

  const slides = [
    // Welcome Slide
    {
      id: 0,
      gradient: "from-purple-600 via-pink-600 to-red-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white px-4">
          <Sparkles className="w-16 h-16 md:w-24 md:h-24 mb-6 md:mb-8 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-4 animate-fade-in-up">
            {t("wrapped.title").split(" ")[0]}{" "}
            {t("wrapped.title").split(" ")[1]}
          </h1>
          <h2
            className="text-2xl sm:text-3xl md:text-6xl font-bold mb-6 md:mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("wrapped.title").split(" ").slice(2).join(" ")}
          </h2>
          <p
            className="text-lg sm:text-xl md:text-2xl opacity-90 mb-8 md:mb-12 animate-fade-in-up px-4"
            style={{ animationDelay: "0.4s" }}
          >
            {t("wrapped.lookBack").replace("{year}", currentYear.toString())}
          </p>
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              onClick={nextSlide}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-8 py-6"
            >
              {t("wrapped.letsGo")} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      ),
    },
    // Total Plays
    {
      id: 1,
      gradient: "from-blue-600 to-cyan-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white px-4">
          <p className="text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8 opacity-90 animate-fade-in-up">
            {t("wrapped.youWatched")}
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold mb-6 md:mb-8 animate-scale-in">
            {formatNumber(totalPlaysThisYear)}
          </h1>
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {t("wrapped.titlesThisYear")}
          </p>
          <p
            className="text-lg sm:text-xl md:text-2xl mt-6 md:mt-8 opacity-75 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            {(totalPlaysThisYear / 365).toFixed(1)} {t("wrapped.perDay")}!
          </p>
        </div>
      ),
    },
    // Total Hours
    {
      id: 2,
      gradient: "from-indigo-600 to-purple-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">{t("wrapped.youSpent")}</p>
          <h1 className="text-8xl md:text-9xl font-bold mb-8">
            {formatNumber(totalHoursThisYear)}
          </h1>
          <p className="text-4xl font-semibold mb-4">
            {t("wrapped.hoursWatching")}
          </p>
          <p className="text-2xl opacity-75">
            {t("wrapped.daysWorthOfContent").replace(
              "{days}",
              Math.floor(totalHoursThisYear / 24).toString()
            )}
          </p>
        </div>
      ),
    },
    // Top Genre
    {
      id: 3,
      gradient: "from-pink-600 to-rose-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.yourFavoriteGenre")}
          </p>
          <h1 className="text-7xl md:text-8xl font-bold mb-12">
            {translatedGenre}
          </h1>
          <p className="text-3xl opacity-75">
            {t("common.with")} {topGenre?.[1] || 0} {t("wrapped.titlesWatched")}
          </p>
        </div>
      ),
    },
    // Top Movie
    {
      id: 4,
      gradient: "from-orange-600 to-red-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white px-8">
          <p className="text-3xl mb-8 text-center opacity-90 animate-fade-in-up">
            {t("wrapped.yourMostWatchedMovie")}
          </p>
          {topMovie && (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-72 sm:w-56 sm:h-84 md:w-64 md:h-96 mb-6 md:mb-8 rounded-lg overflow-hidden shadow-2xl animate-scale-in">
                <Image
                  src={getTMDBImageUrl(topMovie[1].poster)}
                  alt={t("wrapped.topMovie")}
                  fill
                  className="object-cover"
                />
              </div>
              <p
                className="text-lg sm:text-xl md:text-2xl text-center opacity-75 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {t("wrapped.runtime")}: {formatRuntime(topMovie[1].runtime)}
              </p>
            </div>
          )}
        </div>
      ),
    },
    // Top Show
    {
      id: 5,
      gradient: "from-green-600 to-emerald-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white px-4">
          <p className="text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8 text-center opacity-90">
            {t("wrapped.yourMostWatchedShow")}
          </p>
          {topShow && (
            <div className="flex flex-col items-center w-full max-w-md">
              <div className="relative w-48 h-72 sm:w-56 sm:h-84 md:w-64 md:h-96 mb-6 md:mb-8 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getTMDBImageUrl(topShow[1].poster)}
                  alt={t("wrapped.topShow")}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-center opacity-75 mb-4 md:mb-8">
                {t("wrapped.runtime")}: {formatRuntime(topShow[1].runtime)}
              </p>
              <ShareButtons
                title={t("wrapped.topContent")}
                username={data.username}
                year={currentYear}
                stats={{
                  plays: totalPlaysThisYear,
                  hours: totalHoursThisYear,
                  topGenre: translatedGenre,
                  actorsCount: data.actors.length,
                  countriesCount: Object.keys(data.tv.by_country).length,
                  busiestMonth: translatedMonth,
                  topMovie: topMovie?.[0],
                  topMoviePoster: topMovie
                    ? getTMDBImageUrl(topMovie[1].poster)
                    : undefined,
                  topMovieRuntime: topMovie ? topMovie[1].runtime : undefined,
                  topShow: topShow?.[0],
                  topShowPoster: topShow
                    ? getTMDBImageUrl(topShow[1].poster)
                    : undefined,
                  topShowRuntime: topShow ? topShow[1].runtime : undefined,
                }}
                slideType="top-content"
              />
            </div>
          )}
        </div>
      ),
    },
    // Most Active Month
    {
      id: 6,
      gradient: "from-yellow-600 to-orange-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.yourBusiestMonth")}
          </p>
          <h1 className="text-7xl md:text-8xl font-bold mb-8">
            {translatedMonth}
          </h1>
          <p className="text-3xl opacity-75">
            {t("common.with")} {mostActiveMonth.count}{" "}
            {t("wrapped.titlesWatched")}
          </p>
        </div>
      ),
    },
    // Top Actor
    {
      id: 7,
      gradient: "from-purple-600 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p className="text-3xl mb-8 text-center opacity-90">
            {t("wrapped.youSawMostOf")}
          </p>
          {topActor && (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src={getTMDBImageUrl(topActor.image, "w500")}
                  alt={topActor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
                {topActor.name}
              </h1>
              <p className="text-2xl opacity-75">
                {t("wrapped.inTitles").replace(
                  "{count}",
                  (topActor.movies.length + topActor.shows.length).toString()
                )}
              </p>
            </div>
          )}
        </div>
      ),
    },
    // TV vs Movies
    {
      id: 8,
      gradient: "from-cyan-600 to-blue-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-12 opacity-90">
            {t("wrapped.theBreakdown")}
          </p>
          <div className="grid grid-cols-2 gap-16 mb-8">
            <div>
              <h2 className="text-6xl font-bold mb-4">
                {formatNumber(currentYearTvPlays)}
              </h2>
              <p className="text-3xl">{t("wrapped.tvEpisodes")}</p>
            </div>
            <div>
              <h2 className="text-6xl font-bold mb-4">
                {formatNumber(currentYearMoviePlays)}
              </h2>
              <p className="text-3xl">{t("wrapped.movies")}</p>
            </div>
          </div>
          <p className="text-2xl opacity-75 mt-8">
            {currentYearTvPlays > currentYearMoviePlays
              ? t("wrapped.youreATvPerson")
              : t("wrapped.youreAMoviePerson")}
          </p>
          <div className="mt-8">
            <ShareButtons
              title={t("wrapped.theBreakdown")}
              username={data.username}
              year={currentYear}
              stats={{
                plays: totalPlaysThisYear,
                hours: totalHoursThisYear,
                topGenre: translatedGenre,
                actorsCount: data.actors.length,
                countriesCount: Object.keys(data.tv.by_country).length,
                busiestMonth: translatedMonth,
                tvEpisodes: currentYearTvPlays,
                movies: currentYearMoviePlays,
              }}
              slideType="stats"
            />
          </div>
        </div>
      ),
    },
    // Night Owl vs Early Bird
    {
      id: 9,
      gradient: "from-indigo-900 via-purple-900 to-pink-900",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          {nightOwlHours > earlyBirdHours ? (
            <>
              <p className="text-4xl mb-8 opacity-90">🦉</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 animate-fade-in-up">
                {t("wrapped.nightOwlAlert")}
              </h1>
              <p className="text-3xl mb-4 opacity-90">
                {t("wrapped.watchedBetween").replace(
                  "{count}",
                  nightOwlHours.toString()
                )}
              </p>
              <p className="text-3xl opacity-75">
                {t("wrapped.between10pmAnd4am")}
              </p>
              <p className="text-xl mt-8 opacity-60">
                {t("wrapped.justOneMore")}
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-8 opacity-90">🌅</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 animate-fade-in-up">
                {t("wrapped.earlyBird")}
              </h1>
              <p className="text-3xl mb-4 opacity-90">
                {t("wrapped.watchedBetween").replace(
                  "{count}",
                  earlyBirdHours.toString()
                )}
              </p>
              <p className="text-3xl opacity-75">
                {t("wrapped.between5amAnd8am")}
              </p>
              <p className="text-xl mt-8 opacity-60">
                {t("wrapped.morningPerson")}
              </p>
            </>
          )}
        </div>
      ),
    },
    // Peak Hour
    {
      id: 10,
      gradient: "from-orange-600 via-red-600 to-pink-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.yourGoldenHour")}
          </p>
          <h1 className="text-8xl md:text-9xl font-bold mb-8 animate-scale-in">
            {peakHour.hour}:00
          </h1>
          <p className="text-3xl mb-4 opacity-90">
            {t("wrapped.withPlays").replace(
              "{count}",
              peakHour.count.toString()
            )}
          </p>
          <p className="text-2xl mt-8 opacity-60">
            {peakHour.hour >= 9 && peakHour.hour <= 11
              ? t("wrapped.primeProcrastination")
              : peakHour.hour >= 12 && peakHour.hour <= 14
              ? t("wrapped.lunchBreakBinger")
              : peakHour.hour >= 15 && peakHour.hour <= 17
              ? t("wrapped.afternoonEscape")
              : peakHour.hour >= 18 && peakHour.hour <= 21
              ? t("wrapped.primeTimeViewer")
              : peakHour.hour >= 22 || peakHour.hour <= 2
              ? t("wrapped.lateNightLegend")
              : t("wrapped.theDedicationIsReal")}
          </p>
        </div>
      ),
    },
    // Binge Day
    {
      id: 11,
      gradient: "from-green-600 via-teal-600 to-cyan-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.yourUltimateBingeDay")}
          </p>
          <h1 className="text-7xl md:text-8xl font-bold mb-8 animate-scale-in">
            {t(`daysLong.${bingeDay.day}`) || bingeDay.day}
          </h1>
          <p className="text-3xl mb-4 opacity-90">
            {bingeDay.count} {t("wrapped.episodesMovies")}
          </p>
          <p className="text-2xl mt-8 opacity-60">
            {bingeDay.day === "Mon" || bingeDay.day === "Tue"
              ? t("wrapped.beatingMondayBlues")
              : bingeDay.day === "Wed"
              ? t("wrapped.humpDay")
              : bingeDay.day === "Thu"
              ? t("wrapped.almostFriday")
              : bingeDay.day === "Fri"
              ? t("wrapped.tgif")
              : bingeDay.day === "Sat" || bingeDay.day === "Sun"
              ? t("wrapped.weekendWarrior")
              : t("wrapped.whatADay")}
          </p>
        </div>
      ),
    },
    // World Traveler (via content)
    {
      id: 12,
      gradient: "from-blue-600 via-cyan-500 to-teal-500",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-4xl mb-8 opacity-90">🌍</p>
          <p className="text-3xl mb-8 opacity-90">{t("wrapped.youTraveled")}</p>
          <h1 className="text-8xl md:text-9xl font-bold mb-8 animate-scale-in">
            {totalCountries}
          </h1>
          <p className="text-3xl mb-4 opacity-90">
            {totalCountries === 1
              ? t("wrapped.countryCount")
              : t("wrapped.countriesCount")}
          </p>
          <p className="text-2xl opacity-75">
            {t("wrapped.throughYourScreen")}
          </p>
          <p className="text-xl mt-8 opacity-60">
            {t("wrapped.passportNotRequired")}
          </p>
        </div>
      ),
    },
    // Time Span Journey
    {
      id: 13,
      gradient: "from-purple-600 via-pink-600 to-red-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.ifWatchingWasJob")}
          </p>
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold mb-2 animate-scale-in">
                {weeksInCinema}
              </h1>
              <p className="text-3xl opacity-90">{t("wrapped.weeksPTO")}</p>
            </div>
            <p className="text-2xl opacity-75 mt-4">
              {t("wrapped.straightDays").replace(
                "{days}",
                daysInCinema.toString()
              )}
            </p>
          </div>
          <p className="text-xl mt-8 opacity-60">
            {t("wrapped.bossNotApprove")}
          </p>
        </div>
      ),
    },
    // Loyalty Check
    {
      id: 14,
      gradient: "from-yellow-600 via-orange-600 to-red-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.beenOnJourney")}
          </p>
          <h1 className="text-8xl md:text-9xl font-bold mb-8 animate-scale-in">
            {yearSpan}
          </h1>
          <p className="text-3xl mb-4 opacity-90">
            {yearSpan === 1 ? t("wrapped.yearCount") : t("wrapped.yearsCount")}
          </p>
          <p className="text-2xl opacity-75">{data.first_play.date}</p>
          <p className="text-xl mt-8 opacity-60">
            {yearSpan >= 5
              ? t("wrapped.veteranStatus")
              : yearSpan >= 3
              ? t("wrapped.loyalViewer")
              : yearSpan >= 1
              ? t("wrapped.buildingWatchlist")
              : t("wrapped.justGettingStarted")}
          </p>
        </div>
      ),
    },
    // Binge Stats
    {
      id: 15,
      gradient: "from-red-600 to-pink-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <p className="text-3xl mb-8 opacity-90">
            {t("wrapped.ifPaidMinimumWage")}
          </p>
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            ${(totalHoursThisYear * 15).toLocaleString()}
          </h1>
          <p className="text-3xl opacity-75">{t("wrapped.forWatchingTime")}</p>
          <p className="text-xl mt-8 opacity-60">
            {t("wrapped.entertainmentPriceless")}
          </p>
        </div>
      ),
    },
    // First Play Memory
    {
      id: 16,
      gradient: "from-violet-600 to-purple-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p className="text-3xl mb-8 text-center opacity-90">
            {t("wrapped.rememberWhereStarted")}
          </p>
          <div className="flex flex-col items-center">
            {(data.first_play_current_year?.movie_logo ||
              data.first_play.movie_logo) && (
              <div className="relative w-80 h-48 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={
                    data.first_play_current_year?.movie_logo ||
                    data.first_play.movie_logo
                  }
                  alt={
                    data.first_play_current_year?.movie || data.first_play.movie
                  }
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              {data.first_play_current_year?.movie || data.first_play.movie}
            </h1>
            <p className="text-2xl opacity-75">
              {data.first_play_current_year?.date || data.first_play.date} at{" "}
              {data.first_play_current_year?.time || data.first_play.time}
            </p>
            <p className="text-xl mt-6 opacity-60">
              {t("wrapped.theBeginning")}
            </p>
          </div>
        </div>
      ),
    },
    // Final Summary
    {
      id: 17,
      gradient: "from-pink-600 via-purple-600 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white px-4 py-8 overflow-y-auto">
          <div className="wrapped-summary-container w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 rounded-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 md:mb-8 animate-fade-in-up">
              {t("wrapped.thatsAWrap")}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 text-left animate-scale-in">
              <div>
                <p className="text-3xl sm:text-4xl md:text-6xl font-bold">
                  {formatNumber(totalPlaysThisYear)}
                </p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.totalPlays")}
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-6xl font-bold">
                  {formatNumber(totalHoursThisYear)}
                </p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.hoursWatched")}
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-6xl font-bold wrap-break-word">
                  {translatedGenre}
                </p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.topGenre")}
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-6xl font-bold">
                  {data.actors.length}
                </p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.actorsSeen")}
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-6xl font-bold">
                  {Object.keys(data.tv.by_country).length}
                </p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.countriesLabel")}
                </p>
              </div>
              <div>
                <p className="text-6xl font-bold">{translatedMonth}</p>
                <p className="text-sm sm:text-base md:text-xl opacity-75">
                  {t("wrapped.busiestMonth")}
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-4 md:mb-6 px-2">
              {t("wrapped.summaryTitle")
                .replace("{username}", data.username)
                .replace("{year}", currentYear.toString())}
            </p>
          </div>

          <div className="mb-6 md:mb-8 mt-2 md:mt-4 animate-fade-in-up w-full max-w-md px-4">
            <ShareButtons
              title={t("wrapped.summaryTitle")
                .replace("{username}", data.username)
                .replace("{year}", currentYear.toString())}
              username={data.username}
              year={currentYear}
              stats={{
                plays: totalPlaysThisYear,
                hours: totalHoursThisYear,
                topGenre: translatedGenre,
                actorsCount: data.actors.length,
                countriesCount: Object.keys(data.tv.by_country).length,
                busiestMonth: translatedMonth,
                tvEpisodes: currentYearTvPlays,
                movies: currentYearMoviePlays,
                topMovie: topMovie?.[0],
                topShow: topShow?.[0],
              }}
              slideType="summary"
            />
          </div>

          <Link href="/">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-base sm:text-lg md:text-xl px-6 py-4 md:px-8 md:py-6 animate-pulse"
            >
              {t("wrapped.exploreMoreStats")}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Container */}
      <div
        className={`w-full h-full transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`w-full h-full bg-linear-to-br ${
            slides[currentSlide].gradient
          } p-4 sm:p-6 md:p-16 ${
            currentSlide === 17 ? "wrapped-slide-container" : ""
          }`}
          style={
            currentSlide === 17
              ? {
                  background:
                    "linear-gradient(to bottom right, rgb(219, 39, 119), rgb(147, 51, 234), rgb(79, 70, 229))",
                }
              : undefined
          }
        >
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-4 z-50 px-4 wrapped-nav-hidden">
        {currentSlide > 0 && (
          <Button
            onClick={prevSlide}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            <ArrowLeft className="mr-1 sm:mr-2 w-4 h-4" />
            {t("wrapped.previous")}
          </Button>
        )}
        {currentSlide < totalSlides - 1 && (
          <Button
            onClick={nextSlide}
            className="bg-white text-black hover:bg-gray-100 text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            {t("wrapped.next")} <ArrowRight className="ml-1 sm:ml-2 w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Slide Indicators - Hidden on mobile */}
      <div className="hidden md:flex absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 justify-center gap-1.5 z-50 wrapped-nav-hidden">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentSlide(index);
                setIsAnimating(false);
              }, 300);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile slide counter */}
      <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-50 wrapped-nav-hidden">
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Skip Button */}
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-50 flex gap-2 sm:gap-4 wrapped-nav-hidden">
        {currentSlide === 0 && (
          <Button
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentSlide(17);
                setIsAnimating(false);
              }, 300);
            }}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
          >
            {t("wrapped.skipToSummary")}
          </Button>
        )}
        <Link
          href="/"
          className="text-white/70 hover:text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
        >
          {t("wrapped.skipToDashboard")}
        </Link>
      </div>
    </div>
  );
}
