import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Globe, ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1];

function RevealText({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%", rotateX: -30 }}
        animate={{ y: "0%", rotateX: 0 }}
        transition={{ duration: 0.9, delay, ease }}
        style={{ transformOrigin: "bottom" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.5, 0.3]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 50, damping: 20 });

  return (
    <div ref={ref} className="w-full h-[65vh] md:h-[80vh] relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0"
        style={{ y: smoothY, scale: smoothScale }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          data-testid="img-article-hero"
          style={{ filter: useTransform(brightness, (v) => `grayscale(80%) brightness(${v})`) }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

function FloatingLine({ delay = 0 }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.2, delay, ease }}
      style={{ transformOrigin: "left" }}
      className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent"
    />
  );
}

export default function Article() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/news", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/news/${params.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? window.scrollY / totalHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center" style={{ perspective: "1200px" }}>
        <motion.div
          initial={{ opacity: 0, rotateX: 20, z: -100 }}
          animate={{ opacity: 1, rotateX: 0, z: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Globe className="w-5 h-5 text-white/40" />
          </motion.div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Loading Article</span>
        </motion.div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-black min-h-screen text-white" style={{ perspective: "1200px" }}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="px-6 md:px-24 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Globe className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase">Raw Archives</span>
            </Link>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, rotateX: 10, y: 60 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="pt-16 flex flex-col items-center justify-center min-h-screen gap-6"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.03 }}
            transition={{ duration: 1.2, ease }}
            className="text-[200px] font-black leading-none select-none"
          >
            404
          </motion.span>
          <h1 className="text-2xl font-black tracking-tighter uppercase -mt-24">Article Not Found</h1>
          <p className="text-white/40 text-sm">The article you're looking for doesn't exist or has been removed.</p>
          <motion.a
            href="/"
            onClick={handleBack}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-8 py-3 border border-white/20 text-[9px] font-black tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-colors duration-300"
            data-testid="link-back-home"
          >
            Back to Home
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-black min-h-screen text-white relative">
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-white/60 z-[60]"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.03]"
      >
        <div className="px-6 md:px-24 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
              <Globe className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </motion.div>
            <span className="text-[11px] font-black tracking-[0.4em] uppercase">Raw Archives</span>
          </Link>
          <motion.a
            href="/"
            onClick={handleBack}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </motion.a>
        </div>
      </motion.header>

      {article.imageUrl ? (
        <ParallaxImage src={article.imageUrl} alt={article.title} />
      ) : (
        <div className="h-32" />
      )}

      <article
        className={`max-w-3xl mx-auto px-6 md:px-8 ${article.imageUrl ? '-mt-40 relative z-10' : 'pt-32'} pb-32`}
        style={{ perspective: "1200px" }}
      >
        <motion.div
          initial={{ opacity: 0, rotateX: 8, y: 60 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          style={{ transformOrigin: "bottom center" }}
          className="mb-16 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white pointer-events-none blur-3xl"
          />

          <RevealText delay={0.5}>
            <span
              className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mb-8 block"
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
          </RevealText>

          <RevealText delay={0.6} className="pb-2">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]"
              data-testid="text-article-title"
            >
              {article.title}
            </h1>
          </RevealText>

          {article.author?.fullName && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              className="mt-10"
            >
              <FloatingLine delay={0.8} />
              <div className="flex items-center gap-4 pt-6">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center ring-1 ring-white/10"
                >
                  <span className="text-[11px] font-black uppercase">
                    {article.author.fullName.charAt(0)}
                  </span>
                </motion.div>
                <div>
                  <span className="text-[12px] font-bold tracking-wide">{article.author.fullName}</span>
                  <span className="text-[9px] text-white/25 font-bold uppercase tracking-[0.3em] block mt-0.5">Author</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div data-testid="text-article-content" className="relative">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.8, ease }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block -ml-8"
          />

          {article.content?.split('\n').map((paragraph: string, index: number) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            return (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 1 + index * 0.1, ease }}
                className="text-white/65 text-base md:text-lg leading-[1.9] mb-8 font-light"
              >
                {trimmed}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease }}
          className="mt-24 relative"
        >
          <FloatingLine delay={1.4} />
          <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <motion.a
              href="/"
              onClick={handleBack}
              whileHover={{ x: -6 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-4 group"
              data-testid="link-back-home"
            >
              <motion.div
                className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500"
                whileHover={{ rotate: -10 }}
              >
                <ArrowLeft className="w-4 h-4 text-white/60 group-hover:text-black transition-colors duration-500" />
              </motion.div>
              <div>
                <span className="text-[9px] font-black tracking-[0.3em] uppercase block">Back to Home</span>
                <span className="text-[8px] text-white/25 tracking-[0.2em] uppercase">Raw Archives Records</span>
              </div>
            </motion.a>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-[8px] text-white/15 font-bold tracking-[0.5em] uppercase"
            >
              End of Article
            </motion.div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
