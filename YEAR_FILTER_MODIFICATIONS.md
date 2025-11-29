# Year Filtering Modifications - Summary

## Problem

The wrapped feature was displaying incorrect statistics because the data in `all-time-stats.json` was cumulative across all years (2019-2025), not filtered by the current year (2025).

Example issue:

- November showing 342 plays (cumulative 2019-2025)
- But total 2025 plays: only 183

## Solution

Modified the Python data generation script (`trakt_vip_stats`) to generate year-specific statistics.

## Files Modified

### 1. `/workspaces/trakt_stats/trakt_vip_stats/save.py`

**Changes:**

- Added `from datetime import datetime` import
- Added `tv['plays_current_year'] = parse_tv_data.plays_by_time(year=datetime.now().year)`
- Added `movies['plays_current_year'] = parse_movie_data.plays_by_time(year=datetime.now().year)`

**Result:** The generated JSON will now include:

- `tv.plays` - all-time cumulative data (existing)
- `tv.plays_current_year` - filtered 2025 data only (new)
- `movies.plays` - all-time cumulative data (existing)
- `movies.plays_current_year` - filtered 2025 data only (new)

### 2. `/workspaces/trakt_stats/trakt_vip_stats/parseData/parse_tv_data.py`

**Changes:**

- Modified `plays_by_time()` function signature: `def plays_by_time(year=None):`
- Added year filtering logic:
  ```python
  # If year parameter is provided, filter by that year
  if year is not None and time.year != year:
      continue
  ```
- Renamed variable `year` to `year_value` to avoid conflict with parameter
- Added safety check: `if by_year:` before accessing min/max to prevent errors on empty data
- Changed loop variable from `year` to `year_range` to avoid shadowing

### 3. `/workspaces/trakt_stats/trakt_vip_stats/parseData/parse_movie_data.py`

**Changes:**

- Same modifications as `parse_tv_data.py` but for movies
- Function now filters `Movie.watched_at` timestamps by year when parameter is provided

## Verification

✅ All files have been checked for syntax errors - no issues found

## Next Steps

### 1. Configure Trakt API Credentials

Before regenerating data, you need to populate the `.env` file in `/workspaces/trakt_stats/trakt_vip_stats/`:

```env
username = "your_trakt_username"
trakt_client_id = "your_client_id"
trakt_client_secret = "your_client_secret"
tmdb_api_key = "your_tmdb_key"
```

Get credentials from:

- Trakt Client ID/Secret: https://trakt.tv/oauth/applications
- TMDB API Key: https://www.themoviedb.org/settings/api

### 2. Regenerate Data

Once credentials are configured, run:

```bash
cd /workspaces/trakt_stats/trakt_vip_stats
python main.py save
```

This will regenerate `all-time-stats.json` with the new year-filtered fields.

### 3. Update Frontend

After regenerating the JSON, update `/workspaces/trakt_stats/src/app/wrapped/page.tsx` to use the new data structure:

**Current code (estimating):**

```typescript
const currentYearTvPlays = data.tv.plays.by_year[currentYear] || 0;
const currentYearMoviePlays = data.movies.plays.by_year[currentYear] || 0;
const totalPlaysThisYear = currentYearTvPlays + currentYearMoviePlays;

// Then estimates other data using ratios
```

**New code (using accurate year data):**

```typescript
// Use the new plays_current_year fields
const tvPlaysThisYear = data.tv.plays_current_year || data.tv.plays;
const moviesPlaysThisYear = data.movies.plays_current_year || data.movies.plays;

// Now all the by_month, by_hour, by_day_of_week will be accurate for 2025
const monthData = tvPlaysThisYear.by_month;
const hourData = tvPlaysThisYear.by_hour;
const dayOfWeekData = tvPlaysThisYear.by_day_of_week;
```

### 4. Test

After updating the frontend:

1. Verify November 2025 shows correct number of plays (not 342)
2. Verify all slides show accurate 2025 data
3. Test the share functionality with correct stats

## Data Structure Example

After regeneration, `all-time-stats.json` will have:

```json
{
  "tv": {
    "plays": {
      "by_year": { "2019": 205, "2020": 352, ..., "2025": 183 },
      "by_month": { "Jan": 235, ..., "Nov": 342 },  // cumulative all years
      "by_hour": { ... },
      "by_day_of_week": { ... }
    },
    "plays_current_year": {
      "by_year": { "2025": 183 },
      "by_month": { "Jan": 12, ..., "Nov": 8 },  // 2025 only
      "by_hour": { ... },  // 2025 only
      "by_day_of_week": { ... }  // 2025 only
    }
  },
  "movies": {
    // Same structure as tv
  }
}
```

## Benefits

✅ Accurate wrapped statistics for current year
✅ Maintains backward compatibility (existing `plays` field unchanged)
✅ No hardcoded year values
✅ Automatically uses current year via `datetime.now().year`
