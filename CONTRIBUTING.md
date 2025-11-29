# Contributing to Trakt Stats

Thank you for your interest in contributing! This document outlines how you can help improve this project.

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your browser/OS version

## 💡 Suggesting Features

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain why it would benefit users

## 🔧 Pull Requests

### For This Repository

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (use conventional commits)
6. Push to your fork
7. Open a Pull Request

### Conventional Commits

We use conventional commits for clear history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `i18n:` - Translation updates

Example: `feat: add year filtering to wrapped statistics`

## 🎯 Contributing to Upstream (trakt_vip_stats)

### Year Filtering Enhancement

This repository includes enhancements to the Python backend that could benefit the original [trakt_vip_stats](https://github.com/Ahmedazim7804/trakt_vip_stats) project.

#### What We Enhanced:

**Problem Solved:**

- The original script aggregates all-time data, causing Wrapped statistics to show cumulative values across all years
- Example: November showing 350 plays (all years) instead of 29 plays (current year only)

**Solution Implemented:**

- Added optional `year` parameter to key parsing functions
- Separate fields for current year data vs all-time data
- Accurate year-specific statistics for Wrapped feature

#### Files Modified:

1. **`trakt_vip_stats/parseData/parse_tv_data.py`**

   - Modified `plays_by_time(year=None)`
   - Modified `users_top_10_watched_shows(year=None)`

2. **`trakt_vip_stats/parseData/parse_movie_data.py`**

   - Modified `plays_by_time(year=None)`
   - Modified `users_top_10_watched_movies(year=None)`

3. **`trakt_vip_stats/parseData/parse_other_data.py`**

   - Modified `first_play(year=None)`

4. **`trakt_vip_stats/save.py`**
   - Added calls to generate year-specific data
   - New fields: `plays_current_year`, `users_top_10_current_year`, `first_play_current_year`

#### Creating an Upstream PR:

If you want to contribute these enhancements back to the original repository:

1. **Fork the original repository:**

   ```bash
   git clone https://github.com/Ahmedazim7804/trakt_vip_stats
   cd trakt_vip_stats
   git remote add upstream https://github.com/Ahmedazim7804/trakt_vip_stats
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/year-filtering
   ```

3. **Apply the changes** (see `YEAR_FILTER_MODIFICATIONS.md` in this repo for detailed changes)

4. **Test thoroughly:**

   ```bash
   python main.py run --save
   # Verify the JSON contains both all-time and year-specific data
   ```

5. **Write a clear PR description:**

   ````markdown
   ## Add Year Filtering for Wrapped Statistics

   ### Problem

   Current implementation aggregates all-time data, which causes issues when building year-specific features like "Wrapped" (Spotify-style year recap).

   Example issue:

   - November 2025: Shows 350 plays (cumulative across all years)
   - Expected: 29 plays (only November 2025)

   ### Solution

   Added optional `year` parameter to key parsing functions to filter data by specific year while maintaining backward compatibility.

   ### Changes

   - ✅ `plays_by_time(year=None)` - Filter plays by year
   - ✅ `users_top_10_watched_shows(year=None)` - Year-specific top shows
   - ✅ `users_top_10_watched_movies(year=None)` - Year-specific top movies
   - ✅ `first_play(year=None)` - First play of specific year
   - ✅ Updated `save.py` to generate both all-time and year-specific data

   ### Backward Compatibility

   All changes are backward compatible. If `year=None` (default), behavior is identical to current implementation.

   ### New JSON Fields

   ```json
   {
     "tv": {
       "plays": { ... },              // All-time (existing)
       "plays_current_year": { ... }, // Year-specific (new)
       "users_top_10": { ... },       // All-time (existing)
       "users_top_10_current_year": { ... } // Year-specific (new)
     },
     "movies": { ... },               // Same pattern
     "first_play_current_year": { ... } // Year-specific first play (new)
   }
   ```
   ````

   ### Use Case

   Enables accurate "Wrapped" features showing:

   - User's actual viewing behavior for a specific year
   - Year-over-year comparisons
   - Accurate monthly/weekly breakdowns per year

   ### Testing

   - [x] Generates valid JSON with both all-time and year-specific data
   - [x] All-time data unchanged (backward compatible)
   - [x] Year filtering correctly isolates plays by year
   - [x] Works with existing database schema

   ```

   ```

6. **Submit the PR** to the original repository

### Benefits of Upstreaming:

- ✅ More users benefit from year filtering
- ✅ Better maintenance (shared codebase)
- ✅ Community feedback and improvements
- ✅ Contribution to open source

### If PR Not Accepted:

No worries! This repository will continue to maintain the enhanced version. Users can:

- Use our fork for enhanced statistics
- Reference our implementation for their own projects
- Contribute improvements to our fork

## 📝 Code Style

- **Python**: Follow PEP 8
- **TypeScript/React**: Use Prettier (configured in project)
- **CSS**: Use Tailwind utilities when possible
- Write clear, descriptive variable names
- Add comments for complex logic

## 🧪 Testing

Before submitting:

- Test the Python script generates valid JSON
- Test the web app loads and displays data correctly
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test responsive design (mobile, tablet, desktop)
- Verify translations work (EN/FR)

## 📖 Documentation

When adding features:

- Update README.md if user-facing
- Add JSDoc comments for complex functions
- Update translation files (messages/en.json, messages/fr.json)
- Update type definitions if needed

## 🤝 Questions?

Feel free to:

- Open a discussion on GitHub
- Comment on existing issues
- Ask in your PR

Thank you for contributing! 🎉
