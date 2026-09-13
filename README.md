# gh-slim

A userscript that adds custom filters to the GitHub Feed, letting you hide unwanted card types like PR contributions, starred repos, trending repos, and recommendations.

## Features

- Add a **Custom filters** section to the native GitHub Feed `Filter` menu
- Toggle visibility of:
  - **PR contributions** — hide `contributed to` cards
  - **Starred repos** — hide `starred N repositories` cards
  - **Trending repos** — hide `Trending repositories` cards
  - **Recommended repos** — hide `Recommended for you` cards
- Filters apply immediately when toggled
- Settings are persisted via Tampermonkey storage
- Works with GitHub's dynamic Feed loading and Turbo navigation

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
   - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   - [Violentmonkey](https://violentmonkey.github.io/)

2. Open the raw script URL:

   ```
   https://github.com/Phil-Fan/gh-slim/raw/main/github-feed-filter.user.js
   ```

3. Your userscript manager should prompt you to install it.

## Usage

1. Go to [https://github.com/feed](https://github.com/feed).
2. Click the **Filter** button next to the Feed heading.
3. In the **Custom filters** section, uncheck the card types you want to hide.

## Files

| File | Description |
|------|-------------|
| `github-feed-filter.user.js` | The userscript |

## License

MIT
