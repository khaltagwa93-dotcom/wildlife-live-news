import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "WildlifeLiveNews/1.0",
  },
});

// Real RSS sources specialized for wildlife / environment / animals
const FEEDS: Record<string, string[]> = {
  en: [
    "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    "https://www.theguardian.com/environment/rss",
    "https://www.sciencedaily.com/rss/plants_animals/animals.xml",
    "https://phys.org/rss-feed/biology-news/",
  ],
  ar: [
    "https://news.google.com/rss/search?q=%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%A9+%D8%A7%D9%84%D8%A8%D8%B1%D9%8A%D8%A9+OR+wildlife&hl=ar&gl=SA&ceid=SA:ar",
  ],
  es: [
    "https://news.google.com/rss/search?q=vida+silvestre+OR+wildlife&hl=es&gl=ES&ceid=ES:es",
  ],
  fr: [
    "https://news.google.com/rss/search?q=vie+sauvage+OR+wildlife&hl=fr&gl=FR&ceid=FR:fr",
  ],
  zh: [
    "https://news.google.com/rss/search?q=%E9%87%8E%E7%94%9F%E5%8A%A8%E7%89%A9+OR+wildlife&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  ],
  hi: [
    "https://news.google.com/rss/search?q=%E0%A4%B5%E0%A4%A8%E0%A5%8D%E0%A4%AF%E0%A4%9C%E0%A5%80%E0%A4%B5+OR+wildlife&hl=hi&gl=IN&ceid=IN:hi",
  ],
  pt: [
    "https://news.google.com/rss/search?q=vida+selvagem+OR+wildlife&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  ],
  ru: [
    "https://news.google.com/rss/search?q=%D0%B4%D0%B8%D0%BA%D0%B0%D1%8F+%D0%BF%D1%80%D0%B8%D1%80%D0%BE%D0%B4%D0%B0+OR+wildlife&hl=ru&gl=RU&ceid=RU:ru",
  ],
  de: [
    "https://news.google.com/rss/search?q=Wildtiere+OR+wildlife&hl=de&gl=DE&ceid=DE:de",
  ],
  ja: [
    "https://news.google.com/rss/search?q=%E9%87%8E%E7%94%9F%E5%8B%95%E7%89%A9+OR+wildlife&hl=ja&gl=JP&ceid=JP:ja",
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const feeds = FEEDS[lang] || FEEDS.en;

  try {
    const allItems: any[] = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = (feed.items || []).slice(0, 8).map((item) => ({
          title: item.title || "No title",
          link: item.link || "#",
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet || item.content || item.summary || "",
          source: feed.title || "Wildlife Source",
          isoDate: item.isoDate || item.pubDate,
        }));
        allItems.push(...items);
      } catch (err) {
        console.error(`Failed feed ${feedUrl}:`, err);
      }
    }

    // Sort by date desc
    allItems.sort((a, b) => {
      const da = new Date(a.isoDate || a.pubDate).getTime();
      const db = new Date(b.isoDate || b.pubDate).getTime();
      return db - da;
    });

    // Deduplicate by title similarity
    const unique: any[] = [];
    const seen = new Set<string>();
    for (const item of allItems) {
      const key = item.title.toLowerCase().slice(0, 40);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      lang,
      count: unique.length,
      updatedAt: new Date().toISOString(),
      items: unique.slice(0, 30),
      sources: feeds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
