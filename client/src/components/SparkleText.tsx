import { useEffect, useState, useCallback } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotateY: number;
  rotateX: number;
}

function StarSVG({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      className="absolute pointer-events-none"
    >
      <path
        d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SparkleText({
  children,
  className = "",
  color = "white",
  sparkleCount = 6,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  sparkleCount?: number;
}) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateSparkle = useCallback((id: number): Sparkle => {
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 1.2 + 0.8,
      rotateY: Math.random() * 60 - 30,
      rotateX: Math.random() * 60 - 30,
    };
  }, []);

  useEffect(() => {
    const initial = Array.from({ length: sparkleCount }, (_, i) => generateSparkle(i));
    setSparkles(initial);

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => ({
          ...s,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: 0,
          duration: Math.random() * 1.2 + 0.8,
          rotateY: Math.random() * 60 - 30,
          rotateX: Math.random() * 60 - 30,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [sparkleCount, generateSparkle]);

  return (
    <span className={`relative inline-block ${className}`} style={{ color, perspective: "200px" }}>
      {sparkles.map((sparkle) => (
        <StarSVG
          key={sparkle.id}
          size={sparkle.size}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            color,
            animation: `sparkle-pop ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
            zIndex: 10,
            filter: `drop-shadow(0 0 1px ${color})`,
            transform: `rotateX(${sparkle.rotateX}deg) rotateY(${sparkle.rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        />
      ))}
      {children}
    </span>
  );
}
