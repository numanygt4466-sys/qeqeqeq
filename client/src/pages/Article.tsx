import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Globe, ArrowLeft } from "lucide-react";

export default function Article() {
  const params = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/news", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/news/${params.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
          <div className="px-6 md:px-24 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Globe className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase">Raw Archives</span>
            </Link>
          </div>
        </header>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-black min-h-screen text-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
          <div className="px-6 md:px-24 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Globe className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase">Raw Archives</span>
            </Link>
          </div>
        </header>
        <div className="pt-16 flex flex-col items-center justify-center min-h-screen gap-6">
          <span className="text-[120px] font-black text-white/5 leading-none">404</span>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Article Not Found</h1>
          <p className="text-white/40 text-sm">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="mt-4 text-[9px] font-black tracking-[0.3em] uppercase text-white pb-1 border-b-2 border-white inline-block hover:text-white/80 transition-colors" data-testid="link-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
        <div className="px-6 md:px-24 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Globe className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            <span className="text-[11px] font-black tracking-[0.4em] uppercase">Raw Archives</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back
          </Link>
        </div>
      </header>

      {article.imageUrl && (
        <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover grayscale brightness-75"
            data-testid="img-article-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        </div>
      )}

      <article className={`max-w-3xl mx-auto px-6 md:px-8 ${article.imageUrl ? '-mt-32 relative z-10' : 'pt-32'} pb-24`}>
        <div className="mb-12">
          <span
            className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mb-6 block"
            data-testid="text-article-date"
          >
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'News'}
          </span>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] mb-8"
            data-testid="text-article-title"
          >
            {article.title}
          </h1>

          {article.author?.fullName && (
            <div className="flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase">
                  {article.author.fullName.charAt(0)}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wide">{article.author.fullName}</span>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] block">Author</span>
              </div>
            </div>
          )}
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none"
          data-testid="text-article-content"
        >
          {article.content?.split('\n').map((paragraph: string, index: number) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            return (
              <p
                key={index}
                className="text-white/70 text-base md:text-lg leading-relaxed mb-6 font-light"
              >
                {trimmed}
              </p>
            );
          })}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[9px] font-black tracking-[0.3em] uppercase text-white pb-1 border-b-2 border-white hover:text-white/80 hover:border-white/80 transition-colors"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
}
