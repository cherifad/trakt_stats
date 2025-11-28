import { TraktStatsData } from '@/types/stats';

export function getStatsData(): TraktStatsData | null {
    // Vérifier si on est côté client et si des données sont dans le localStorage
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('trakt_stats_data');
        if (storedData) {
            try {
                return JSON.parse(storedData) as TraktStatsData;
            } catch (error) {
                console.error('Erreur lors du parsing des données:', error);
                return null;
            }
        }
    }
    // Pas de données uploadées
    return null;
}

export function hasUploadedData(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('trakt_stats_data') !== null;
}

export function formatRuntime(runtime: string): string {
    return runtime;
}

export function formatNumber(num: number): string {
    return num.toLocaleString();
}

export function formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
}

export function getTMDBImageUrl(path: string, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTopItems<T>(items: Record<string, T>, limit: number = 10): Array<{ id: string; data: T }> {
    return Object.entries(items)
        .slice(0, limit)
        .map(([id, data]) => ({ id, data }));
}

export function getSortedByValue<T>(
    items: Record<string, T>,
    getValue: (item: T) => number,
    descending: boolean = true
): Array<{ key: string; value: T }> {
    return Object.entries(items)
        .sort(([, a], [, b]) => {
            const aVal = getValue(a);
            const bVal = getValue(b);
            return descending ? bVal - aVal : aVal - bVal;
        })
        .map(([key, value]) => ({ key, value }));
}

export function getChartData(data: Record<string, number>): Array<{ name: string; value: number }> {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
}

export function calculateTotal(data: Record<string, number>): number {
    return Object.values(data).reduce((sum, val) => sum + val, 0);
}

export function getYearRange(years: Record<string, number>): { min: number; max: number } {
    const yearNumbers = Object.keys(years)
        .map(Number)
        .filter((year) => !isNaN(year) && years[year] > 0);

    if (yearNumbers.length === 0) return { min: 0, max: 0 };

    return {
        min: Math.min(...yearNumbers),
        max: Math.max(...yearNumbers),
    };
}
