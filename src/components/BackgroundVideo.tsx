import React, { useEffect, useRef, useState } from 'react';

const PRIMARY_VIDEO =
  'https://res.cloudinary.com/dzucladtl/video/upload/v1786378151/kling_20260810_Image_to_Video__5582_0_vqe60m.mp4';
const FALLBACK_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-41539-large.mp4';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(PRIMARY_VIDEO);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setVideoReady(true))
        .catch((err) => {
          console.warn('Autoplay waiting for user interaction or fallback:', err?.message);
        });
    }
  }, [videoSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      pulseSpeed: number;
      color: string;
    }

    const starCount = Math.min(Math.floor((width * height) / 12000), 120);
    const stars: Star[] = [];
    const colors = ['#ffffff', '#e9d5ff', '#c084fc', '#a855f7', '#818cf8'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }

    let shootingStars: ShootingStar[] = [];

    const addShootingStar = () => {
      if (Math.random() < 0.015 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.5),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          opacity: 1,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        });
      }
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep space base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#07040d');
      bgGrad.addColorStop(0.4, '#0c071a');
      bgGrad.addColorStop(0.8, '#080512');
      bgGrad.addColorStop(1, '#030206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Nebula Clouds
      const nebula1 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.35,
        50,
        width * 0.75,
        height * 0.35,
        width * 0.45
      );
      nebula1.addColorStop(0, 'rgba(147, 51, 234, 0.18)');
      nebula1.addColorStop(0.5, 'rgba(109, 40, 217, 0.08)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.7,
        40,
        width * 0.2,
        height * 0.7,
        width * 0.4
      );
      nebula2.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      nebula2.addColorStop(0.6, 'rgba(147, 51, 234, 0.05)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw Twinkling Stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const currentOpacity =
          star.opacity * (0.6 + 0.4 * Math.sin(tick * star.pulseSpeed));

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentOpacity));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.color;
          ctx.fill();
        }
        ctx.restore();
      });

      // Update & Draw Shooting Stars
      addShootingStar();
      shootingStars = shootingStars.filter((s) => s.opacity > 0.02);

      shootingStars.forEach((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity *= 0.96;

        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      id="shadow-background-wrapper"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden -z-10 bg-[#07040d]"
    >
      {/* Background Video Player */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          onError={() => {
            if (videoSrc === PRIMARY_VIDEO) {
              setVideoSrc(FALLBACK_VIDEO);
            } else {
              setVideoFailed(true);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 scale-[1.02] ${
            videoReady ? 'opacity-70' : 'opacity-0'
          }`}
        />
      )}

      {/* Dynamic Starfield Canvas Layer */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block mix-blend-screen transition-opacity duration-700 ${
          videoReady ? 'opacity-40' : 'opacity-100'
        }`}
      />

      {/* Deep purple/black cosmic overlay for crisp WCAG contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07040d]/80 via-[#0c061a]/60 to-[#07040d]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/25 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

