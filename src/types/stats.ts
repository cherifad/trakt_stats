export interface AllTimeStats {
    plays: number;
    hours: number;
    collected: number;
    ratings: number;
    lists: number;
    comments: number;
}

export interface FirstPlay {
    movie: string;
    date: string;
    time: string;
    movie_logo: string;
}

export interface MostWatchedItem {
    title: string;
    play_count: string;
    watched: boolean;
}

export interface Trakt {
    most_watched_movies: Record<string, MostWatchedItem>;
    most_watched_shows: Record<string, MostWatchedItem>;
}

export interface Stats {
    hours: {
        total: number;
        per_year: number;
        per_month: number;
        per_day: number;
    };
    plays: {
        total: number;
        per_year: number;
        per_month: number;
        per_day: number;
    };
}

export interface Plays {
    by_year: Record<string, number>;
    by_month: Record<string, number>;
    by_day_of_week: Record<string, number>;
    by_hour: Record<string, number>;
}

export interface TopMediaItem {
    runtime: string;
    poster: string;
}

export interface ListProgress {
    total: number;
    watched: number;
}

export interface RatedItem {
    rating: number;
    poster: string;
}

export interface TVStats {
    stats: Stats;
    plays: Plays;
    users_top_10: Record<string, TopMediaItem>;
    by_genre: Record<string, number>;
    by_released_year: Record<string, number>;
    by_country: Record<string, number>;
    list_progress: Record<string, ListProgress>;
    highest_rated: Record<string, RatedItem>;
    all_ratings: Record<string, number>;
}

export interface MovieStats {
    stats: Stats;
    plays: Plays;
    users_top_10: Record<string, TopMediaItem>;
    by_genre: Record<string, number>;
    by_released_year: Record<string, number>;
    by_country: Record<string, number>;
    list_progress: Record<string, ListProgress>;
    highest_rated: Record<string, RatedItem>;
    all_ratings: Record<string, number>;
}

export interface Actor {
    name: string;
    movies: string[];
    shows: string[];
    episode: number;
    image: string;
}

export interface Director {
    name: string;
    movies: string[];
    shows: string[];
    episode: number;
    image: string;
}

export interface TraktStatsData {
    all_time_stats: AllTimeStats;
    first_play: FirstPlay;
    pfp: string;
    username: string;
    trakt: Trakt;
    tv: TVStats;
    movies: MovieStats;
    actors: Actor[];
    directors: Director[];
}
