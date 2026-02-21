import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        size: Math.random() * 40 + 20, // Larger for distortion feel
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        life: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        // Using a dark purple/black for a "void" distortion feel
        color: `hsla(263, 70%, 10%, ${Math.random() * 0.2 + 0.1})`, 
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      // Frequency of particles
      if (Math.random() > 0.5) {
        particles.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // Semi-transparent clear for ghosting effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add a subtle "lens" or "distortion" circle at mouse position
      if (mouse.current.active) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 150
        );
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.life -= 0.01;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // Drawing a "distortion" shard
        ctx.beginPath();
        const side = p.size * p.life;
        ctx.moveTo(-side/2, -side/2);
        ctx.lineTo(side/2, -side/4);
        ctx.lineTo(side/4, side/2);
        ctx.closePath();
        
        // Underground style: dark, blurred edges
        ctx.shadowBlur = 15 * p.life;
        ctx.shadowColor = 'rgba(138, 43, 226, 0.3)';
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/g, `${p.life * 0.2})`);
        
        // Multi-layered distortion feel
        ctx.globalCompositeOperation = 'screen';
        ctx.fill();
        
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    const animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999] opacity-80"
        style={{ filter: 'contrast(120%) brightness(80%) blur(0.5px)' }}
      />
      {/* CSS-based mouse distortion overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] mix-blend-overlay"
        style={{
          background: `radial-gradient(circle 100px at var(--mouse-x, 0) var(--mouse-y, 0), rgba(138, 43, 226, 0.1), transparent)`
        }}
      />
      <style>{`
        :root {
          --mouse-x: 0px;
          --mouse-y: 0px;
        }
      `}</style>
    </>
  );
}
