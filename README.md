# Wildlife Live News 🦁

Real-time wildlife and environmental news website specialized for global wildlife stories.

## Features

- **Real sources**: BBC Science & Environment, The Guardian Environment, ScienceDaily Animals, Phys.org Biology, Google News (multi-language)
- **10 languages**: Arabic, English, Spanish, French, Chinese, Hindi, Portuguese, Russian, German, Japanese
- **7 colored bars**: Top indicator bars with different colors that shuffle/change every time new news is fetched
- **Auto-refresh**: Polls every 2 minutes for new articles
- **Responsive**: Beautiful modern UI with Tailwind

## Tech

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- rss-parser for real RSS aggregation
- Server-side fetching (no CORS issues)

## Deploy

Deployed on Vercel.

## Database note

News is fetched live from real public RSS feeds on every request / refresh. For persistent storage / caching a Neon Postgres or Vercel KV can be added easily via environment variables.
