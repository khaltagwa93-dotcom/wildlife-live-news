"use client";

import { useState, useEffect, useCallback } from "react";

const LANGUAGES = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "pt", name: "Português", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
];

const BAR_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#a855f7", // purple
];

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  isoDate?: string;
}

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [barColors, setBarColors] = useState(BAR_COLORS);
  const [newCount, setNewCount] = useState(0);
  const [error, setError] = useState("");

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const shuffleBars = useCallback(() => {
    setBarColors((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }, []);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/news?lang=${lang}`);
      const data = await res.json();
      if (data.success) {
        setNews(data.items || []);
        setLastUpdate(data.updatedAt);
        setNewCount((c) => c + 1);
        shuffleBars();
      } else {
        setError(data.error || "Failed to load news");
      }
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [lang, shuffleBars]);

  useEffect(() => {
    fetchNews();
    // Real-time polling every 2 minutes for new wildlife news
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = lang;
  }, [lang, currentLang.dir]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* 7 Colored Bars - change on new news */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-3 shadow-lg">
        {barColors.map((color, i) => (
          <div
            key={i}
            className="bar flex-1 animate-bar-change"
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
            }}
            title={`Indicator bar ${i + 1}`}
          />
        ))}
      </div>

      <header className="pt-8 pb-6 px-4 bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 text-white shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                🦁 Wildlife Live News
              </h1>
              <p className="mt-1 text-emerald-100 text-sm md:text-base">
                أخبار الحياة البرية اللحظية حول العالم · Real-time wildlife news worldwide
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-sm text-emerald-200">Language / اللغة:</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white/20 backdrop-blur text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-gray-900">
                    {l.name}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchNews}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {loading ? "⏳ Loading..." : "🔄 Refresh"}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-emerald-200">
            <span>📡 Real sources: BBC Science & Environment · The Guardian · ScienceDaily · Phys.org · Google News</span>
            <span>🔄 Auto-refresh every 2 min</span>
            {lastUpdate && (
              <span>🕒 Last update: {new Date(lastUpdate).toLocaleString(lang)}</span>
            )}
            <span>🔔 New batches: {newCount}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {loading && news.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card block bg-white rounded-2xl overflow-hidden shadow-md border border-emerald-100 hover:border-emerald-300"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.source}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.pubDate
                        ? new Date(item.pubDate).toLocaleDateString(lang, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-3">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.contentSnippet}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && !error && (
          <div className="text-center py-20 text-gray-500">
            No wildlife news found for this language. Try another language or refresh.
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 bg-emerald-900 text-emerald-100 text-center text-sm">
        <p>
          🌍 Wildlife Live News · Powered by real RSS feeds · Built for conservation awareness
        </p>
        <p className="mt-2 text-emerald-300/80">
          Sources: BBC, The Guardian, ScienceDaily, Phys.org, Google News · No API keys required · Free & open
        </p>
        <p className="mt-1 text-xs text-emerald-400/60">
          The 7 colored bars at the top change colors automatically whenever new news arrives.
        </p>
      </footer>
    </div>
  );
}
