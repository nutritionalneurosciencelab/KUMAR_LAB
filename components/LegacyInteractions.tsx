'use client';

import { useEffect } from 'react';

export default function LegacyInteractions() {
  useEffect(() => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resize = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
        const NUM = 70;
        for (let i = 0; i < NUM; i++) {
          nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2.5 + 1
          });
        }

        let raf = 0;
        const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const dx = nodes[i].x - nodes[j].x;
              const dy = nodes[i].y - nodes[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(100,170,255,${0.5 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
              }
            }
          }

          for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(120,190,255,0.8)';
            ctx.fill();
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
            if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
          }

          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => {
          window.removeEventListener('resize', resize);
          cancelAnimationFrame(raf);
        };
      }
    }

    return;
  }, []);

  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));

    const mainNav = document.getElementById('main-nav');
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[id]'));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a'));

    const onScroll = () => {
      if (mainNav) {
        if (window.scrollY > 10) mainNav.classList.add('scrolled');
        else mainNav.classList.remove('scrolled');
      }

      const bt = document.getElementById('back-top');
      if (bt) {
        if (window.scrollY > 400) bt.classList.add('visible');
        else bt.classList.remove('visible');
      }

      let current = '';
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const animateCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.target ?? '0', 10);
      const duration = 1800;
      const start = performance.now();
      const update = (now: number) => {
        const elapsed = Math.min(now - start, duration);
        const progress = 1 - Math.pow(1 - elapsed / duration, 3);
        el.textContent = String(Math.round(progress * target));
        if (elapsed < duration) requestAnimationFrame(update);
        else el.textContent = String(target);
      };
      requestAnimationFrame(update);
    };

    const counters = Array.from(document.querySelectorAll<HTMLElement>('.count-animate'));
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target as HTMLElement);
            counterObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObs.observe(c));

    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const onToggle = () => navMobile?.classList.toggle('open');
    navToggle?.addEventListener('click', onToggle);
    const mobLinks = Array.from(document.querySelectorAll('.nav-mob-link'));
    const onMobClick = () => navMobile?.classList.remove('open');
    mobLinks.forEach((a) => a.addEventListener('click', onMobClick));

    // Lightbox wiring (kept for future news galleries)
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img') as HTMLImageElement | null;
    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');
    let lbImages: string[] = [];
    let lbIndex = 0;

    const openLightbox = (images: string[], startIdx: number) => {
      if (!lightbox || !lbImg) return;
      lbImages = images;
      lbIndex = startIdx;
      lbImg.src = images[startIdx] ?? '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    const onLbClose = () => closeLightbox();
    const onLbBg = (e: MouseEvent) => {
      if (e.target === lightbox) closeLightbox();
    };
    const onPrev = (e: MouseEvent) => {
      e.stopPropagation();
      if (!lbImg || lbImages.length === 0) return;
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      lbImg.src = lbImages[lbIndex] ?? '';
    };
    const onNext = (e: MouseEvent) => {
      e.stopPropagation();
      if (!lbImg || lbImages.length === 0) return;
      lbIndex = (lbIndex + 1) % lbImages.length;
      lbImg.src = lbImages[lbIndex] ?? '';
    };
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox?.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') (lbPrev as HTMLElement | null)?.click();
      if (e.key === 'ArrowRight') (lbNext as HTMLElement | null)?.click();
    };

    lbClose?.addEventListener('click', onLbClose);
    lightbox?.addEventListener('click', onLbBg);
    lbPrev?.addEventListener('click', onPrev);
    lbNext?.addEventListener('click', onNext);
    document.addEventListener('keydown', onKey);

    return () => {
      observer.disconnect();
      counterObs.disconnect();
      window.removeEventListener('scroll', onScroll);
      navToggle?.removeEventListener('click', onToggle);
      mobLinks.forEach((a) => a.removeEventListener('click', onMobClick));
      lbClose?.removeEventListener('click', onLbClose);
      lightbox?.removeEventListener('click', onLbBg);
      lbPrev?.removeEventListener('click', onPrev);
      lbNext?.removeEventListener('click', onNext);
      document.removeEventListener('keydown', onKey);

      // keep TS happy - referenced so it isn't tree-shaken accidentally later
      void openLightbox;
    };
  }, []);

  return null;
}

