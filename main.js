// ── DARK MODE TOGGLE ──
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  if (themeToggle) {
    if (themeLabel) themeLabel.textContent = currentTheme === 'dark' ? 'Light' : 'Dark';
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      if (themeLabel) themeLabel.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
    });
  }
});

function updateGrid(grid, html, callback) {
  grid.classList.add('fade-out');
  setTimeout(() => {
    grid.innerHTML = html;
    grid.classList.remove('fade-out');
    if (callback) callback();
  }, 400);
}

// ── HERO CANVAS: Animated neural network ──
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = [];
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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(100,170,255,${0.5 * (1 - dist/130)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,190,255,0.8)';
      ctx.fill();
      // update
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// ── NAV ACTIVE + SCROLL SHADOW ──
const mainNav = document.getElementById('main-nav');
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // shadow
  if (window.scrollY > 10) mainNav.classList.add('scrolled');
  else mainNav.classList.remove('scrolled');

  // back to top
  const bt = document.getElementById('back-top');
  if (window.scrollY > 400) bt.classList.add('visible');
  else bt.classList.remove('visible');

  // active nav
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// ── HERO COUNTER ANIMATION ──
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = 1 - Math.pow(1 - elapsed / duration, 3);
    el.textContent = Math.round(progress * target);
    if (elapsed < duration) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// Trigger counters when hero is visible
const counters = document.querySelectorAll('.count-animate');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ── RESEARCH FILTER TABS ──
const rtabs = document.querySelectorAll('.rtab');
const rcards = document.querySelectorAll('.rc');
rtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    rtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    rcards.forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });
  });
});

// ── PUBLICATION YEAR FILTER ──
const pubFilters = document.querySelectorAll('.pub-filter');
const pubs = document.querySelectorAll('.pub');
pubFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    pubFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const year = btn.dataset.year;
    pubs.forEach(pub => {
      if (year === 'all' || pub.dataset.year === year) {
        pub.style.display = '';
      } else {
        pub.style.display = 'none';
      }
    });
  });
});

// ── TAG CLICK → filter pubs ──
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const keyword = tag.textContent.trim().toLowerCase();
    pubs.forEach(pub => {
      const tags = pub.querySelectorAll('.tag');
      const match = Array.from(tags).some(t => t.textContent.toLowerCase().includes(keyword));
      pub.style.display = match ? '' : 'none';
    });
    pubFilters.forEach(b => b.classList.remove('active'));
    // scroll to pubs
    document.getElementById('publications').scrollIntoView({ behavior: 'smooth' });
  });
});

// ── MOBILE NAV (created dynamically — never in static HTML) ──
const navToggle = document.getElementById('nav-toggle');
let navMobile = null; // created on first toggle click

function createMobileNav() {
  if (navMobile) return navMobile;
  const div = document.createElement('div');
  div.className = 'nav-mobile';
  div.id = 'nav-mobile';
  div.innerHTML = `
      <div class="nav-mobile-header">
      <span class="nav-logo-dot" style="width:7px;height:7px;background:#f87171;"></span>
      <div>
        <div class="nav-mobile-brand" style="color:#fff;">NeuroMeT Lab</div>
        <div class="nav-mobile-sub" style="color:rgba(255,255,255,0.4);">Neuroscience &amp; Immuno-Metabolism Lab · BRIC-NABI</div>
      </div>
    </div>
    <a href="#about"        class="nav-mob-link">🔬 About</a>
    <a href="#research"     class="nav-mob-link">🧠 Research</a>
    <a href="#team"         class="nav-mob-link">👥 Team</a>
    <a href="#publications" class="nav-mob-link">📄 Publications</a>
    <a href="#news"         class="nav-mob-link">📰 News</a>
    <a href="#awards"       class="nav-mob-link">🏆 Awards &amp; Funding</a>
    <a href="#contact"      class="nav-mob-link">📍 Contact</a>`;
  document.body.insertBefore(div, document.querySelector('.hero'));
  // Attach close listeners to links
  div.querySelectorAll('.nav-mob-link').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
  navMobile = div;
  return div;
}

function openMobileNav() {
  const nav = createMobileNav();
  // Force reflow then add open class for transition
  nav.style.display = 'block';
  nav.offsetHeight; // trigger reflow
  nav.classList.add('open');
  navToggle.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  if (!navMobile) return;
  navMobile.classList.remove('open');
  navToggle.classList.remove('open');
  document.body.style.overflow = '';
  // After transition, hide completely
  setTimeout(() => { if (navMobile && !navMobile.classList.contains('open')) navMobile.style.display = 'none'; }, 300);
}

navToggle.addEventListener('click', () => {
  if (navMobile && navMobile.classList.contains('open')) closeMobileNav();
  else openMobileNav();
});

// Close when tapping outside
document.addEventListener('click', (e) => {
  if (navMobile && navMobile.classList.contains('open') &&
      !navMobile.contains(e.target) &&
      !navToggle.contains(e.target)) {
    closeMobileNav();
  }
});

// Highlight active section in mobile nav on scroll
function updateMobActive() {
  if (!navMobile) return;
  const sects = ['about','research','team','publications','news','awards','contact'];
  let current = '';
  sects.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  navMobile.querySelectorAll('.nav-mob-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateMobActive, { passive: true });

// ── GALLERY SLIDESHOW ──
document.querySelectorAll('.news-card-gallery').forEach(gallery => {
  const imgs = gallery.querySelectorAll('img');
  const dots = gallery.querySelectorAll('.gallery-dot');
  const counter = gallery.querySelector('.gallery-count');
  const imageList = JSON.parse(gallery.dataset.images || '[]');
  let current = 0;
  let autoTimer = null;

  function goTo(idx) {
    imgs[current].classList.remove('active');
    imgs[current].classList.add('hidden');
    dots[current].classList.remove('active');
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('active');
    imgs[current].classList.remove('hidden');
    dots[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${imgs.length}`;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoTimer);
      goTo(parseInt(dot.dataset.idx));
    });
  });

  // Auto-advance
  autoTimer = setInterval(() => goTo(current + 1), 3500);

  // Click to open lightbox
  gallery.addEventListener('click', () => {
    openLightbox(imageList, current);
  });
});

// ── LIGHTBOX ──
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
let lbImages = [];
let lbIndex = 0;

function openLightbox(images, startIdx) {
  lbImages = images;
  lbIndex = startIdx;
  lbImg.src = images[startIdx];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
lbPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  lbImg.src = lbImages[lbIndex];
});
lbNext.addEventListener('click', (e) => {
  e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbImages.length;
  lbImg.src = lbImages[lbIndex];
});

const SUPA_URL  = 'https://ivastnwynlrprsrjxtob.supabase.co';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YXN0bnd5bmxycHJzcmp4dG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjc2MTQsImV4cCI6MjA4ODk0MzYxNH0.ZXDS62ZhwZoPCEzVZi-QISxPpq74Zcr0IvfP-5OjDFw';

async function sbFetch(table, order) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const url = `${SUPA_URL}/rest/v1/${table}?select=*&order=${order}`;
    const res = await fetch(url, {
      headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY },
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn('Supabase fetch failed for', table, e.message);
    return [];
  }
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

// ── TEAM ──────────────────────────────────────────
const FALLBACK_TEAM = [
  { name:'Babita Bhatt',       role:'Research Scholar', fellowship:'WISE PhD',      linkedin_url:'', photo_url:'team_babita.jpeg' },
  { name:'Chitralekha Gusain', role:'Research Scholar', fellowship:'NABI Core SRF', linkedin_url:'', photo_url:'team_chitra.jpeg' },
  { name:'Arunima Das',        role:'Research Scholar', fellowship:'UGC JRF',       linkedin_url:'', photo_url:'team_arunima.jpeg' },
  { name:'Gauri Chaudhari',    role:'Research Scholar', fellowship:'UGC JRF',       linkedin_url:'', photo_url:'team_gauri.jpeg' },
  { name:'Sumit Sutariya',     role:'Research Scholar', fellowship:'DBT JRF',       linkedin_url:'', photo_url:'team_sumit.jpeg' },
  { name:'Vaishnavi Chaubey',  role:'Research Scholar', fellowship:'PRS 1',         linkedin_url:'', photo_url:'team_vaishnavi.jpeg' },
];

async function loadTeam() {
  const grid = document.getElementById('member-grid');
  if (grid) {
    grid.innerHTML = Array(6).fill(`
      <div class="mc reveal" style="background:#fff; border:1px solid var(--border);">
        <div class="mc-photo skeleton-box" style="height:250px;"></div>
        <div class="mc-info" style="width:100%;">
          <div class="skeleton-box" style="height:18px; width:70%; margin-bottom:8px;"></div>
          <div class="skeleton-box" style="height:14px; width:50%; margin-bottom:8px;"></div>
          <div class="skeleton-box" style="height:10px; width:40%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Fetch from Supabase first, use fallback if empty or failed
  let members = await sbFetch('team', 'sort_order.asc');
  if (!members || members.length === 0) {
    members = FALLBACK_TEAM;
  }
  if (!grid) return;

  const delays = ['','reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4',''];
  const newHTML = members.map((m, i) => {
    const ini = initials(m.name);
    const photo = m.photo_url
      ? `<img src="${m.photo_url}" alt="${m.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="init" style="display:none">${ini}</div>`
      : `<div class="init">${ini}</div>`;
    return `
      <div class="mc reveal ${delays[i % delays.length]}">
        <div class="mc-photo">${photo}</div>
        <div class="mc-info">
          <div class="mc-name">${m.name}</div>
          <div class="mc-role">${m.role}</div>
          ${m.fellowship ? `<div class="mc-fellowship">${m.fellowship}</div>` : ''}
          ${m.linkedin_url ? `<div class="mc-links" style="margin-top:10px;"><a class="mc-link" href="${m.linkedin_url}" target="_blank">🔗 LinkedIn</a></div>` : ''}
        </div>
      </div>`;
  }).join('') + `
      <a class="mc reveal" href="https://forms.gle/q8cQMdwXtGKwGqa49" target="_blank"
         style="border-style:dashed;background:transparent;text-decoration:none;cursor:pointer;">
        <div class="mc-photo" style="background:linear-gradient(135deg,#eef2f7,#e0e8f4);">
          <div class="init" style="color:#94a3b8;font-size:2.8rem;">+</div>
        </div>
        <div class="mc-info">
          <div class="mc-name" style="color:var(--accent);">Join the Group</div>
          <div class="mc-role" style="color:var(--muted);">Open Positions</div>
          <div class="mc-fellowship">PhD · Postdoc · Intern · JRF</div>
          <div style="margin-top:10px;font-size:0.7rem;color:var(--accent);font-weight:600;">Apply Here →</div>
        </div>
      </a>`;

  updateGrid(grid, newHTML, () => {
    document.querySelectorAll('#member-grid .reveal').forEach(el => observer && observer.observe(el));
  });
}

// ── NEWS ──────────────────────────────────────────
async function loadNews() {
  const grid  = document.getElementById('news-grid');
  if (grid) {
    grid.innerHTML = Array(4).fill(`
      <div class="news-card reveal">
        <div class="skeleton-box" style="height:200px; border-bottom:1px solid var(--border); border-radius:0;"></div>
        <div class="news-card-body" style="width:100%;">
          <div class="skeleton-box" style="height:14px; width:30%; margin-bottom:12px;"></div>
          <div class="skeleton-box" style="height:24px; width:80%; margin-bottom:16px;"></div>
          <div class="skeleton-box" style="height:14px; width:100%; margin-bottom:8px;"></div>
          <div class="skeleton-box" style="height:14px; width:90%;"></div>
        </div>
      </div>
    `).join('');
  }

  const items = await sbFetch('news', 'sort_order.desc');
  if (!grid) return;
  if (!items || !items.length) {
    updateGrid(grid, `<div class="section-body" style="width:100%;"><p style="padding:40px; background:var(--navy2); border-radius:8px; text-align:center;">We're having trouble loading the latest news. Please <a href="javascript:location.reload()" style="color:var(--accent);">refresh the page</a>.</p></div>`);
    return;
  }

  const newHTML = items.map(item => {
    const imgs  = item.images || [];
    const thumb = imgs[0] || '';
    const dots  = imgs.map((_, di) =>
      `<button class="gallery-dot${di===0?' active':''}" data-idx="${di}"></button>`
    ).join('');
    return `
      <div class="news-card reveal">
        <div class="news-card-gallery">
          <img src="${thumb}" alt="${item.title}" class="active" onerror="this.parentElement.style.background='#1a2a44'"/>
          ${imgs.slice(1).map(u => `<img src="${u}" alt="" class="hidden"/>`).join('')}
          ${imgs.length > 1 ? `<span class="gallery-count">1 / ${imgs.length}</span>` : ''}
          <div class="gallery-dots">${dots}</div>
        </div>
        <div class="news-card-body">
          <div class="news-meta">
            <span class="news-date">${item.date_range}${item.location ? ' · ' + item.location : ''}</span>
            <span class="news-badge ${item.badge ? item.badge.toLowerCase() : 'event'}">${item.badge || 'Event'}</span>
          </div>
          <div class="news-title">${item.title}</div>
          <div class="news-body">
            ${item.description}
            ${item.acknowledgements ? `<div class="news-thanks" style="margin-top:12px;"><strong>Acknowledgements:</strong> ${item.acknowledgements}</div>` : ''}
            ${item.people ? `<div class="news-people" style="margin-top:12px;">${item.people.split(',').map(p=>`<span class="news-person">${p.trim()}</span>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  updateGrid(grid, newHTML, () => {
    // Init gallery dots for newly added cards
    grid.querySelectorAll('.news-card').forEach(card => {
      const imgs  = card.querySelectorAll('.news-card-gallery img');
      const dots  = card.querySelectorAll('.gallery-dot');
      const count = card.querySelector('.gallery-count');
      if (imgs.length < 2) return;
      let cur = 0;
      let timer = null;
      function go(n) {
        imgs[cur].className = 'hidden';
        cur = (n + imgs.length) % imgs.length;
        imgs[cur].className = 'active';
        dots.forEach((d,i) => d.classList.toggle('active', i===cur));
        if (count) count.textContent = `${cur+1} / ${imgs.length}`;
      }
      dots.forEach((d,i) => d.addEventListener('click', () => {
        clearInterval(timer);
        go(i);
        timer = setInterval(() => go(cur+1), 3500);
      }));
      timer = setInterval(() => go(cur+1), 3500);
    });

    document.querySelectorAll('#news-grid .reveal').forEach(el => observer && observer.observe(el));
  });
}

// ── AWARDS ────────────────────────────────────────
async function loadAwards() {
  const grid  = document.getElementById('awards-grid');
  if (grid) {
    grid.innerHTML = Array(2).fill(`
      <div style="margin-bottom:32px; width:100%;">
        <div class="skeleton-box" style="height:14px; width:20%; margin-bottom:14px;"></div>
        ${Array(2).fill(`<div class="aw" style="border-left-color:#e2e8f0; width:100%;"><div class="skeleton-box" style="height:16px; width:70%; margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px; width:40%;"></div></div>`).join('')}
      </div>
    `).join('');
  }

  const items = await sbFetch('awards', 'sort_order.desc');
  if (!grid) return;

  if (!items || !items.length) {
    updateGrid(grid, '<div class="section-body" style="width:100%;"><p style="padding:40px; background:var(--navy2); border-radius:8px; text-align:center;">We cannot fetch awards currently. Please <a href="javascript:location.reload()" style="color:var(--accent);">refresh</a>.</p></div>');
    return;
  }

  const icons = { award: '🏆', grant: '💰', fellowship: '🎓' };
  const colors = { award: '#d4921a', grant: '#0d9488', fellowship: '#1a6fd4' };

  const grouped = { award: [], grant: [], fellowship: [] };
  items.forEach(item => { if (grouped[item.type]) grouped[item.type].push(item); });

  const labels = { award: 'Awards', grant: 'Grants & Funding', fellowship: 'Fellowships' };

  const newHTML = Object.entries(grouped).map(([type, group]) => {
    if (!group.length) return '';
    const limit = 4;
    const isExpandable = type === 'grant' || type === 'fellowship';
    const limitExceeded = isExpandable && group.length > limit;

    const itemsHTML = group.map((item, idx) => {
      const isHidden = limitExceeded && idx >= limit;
      return `
          <div class="aw reveal ${isHidden ? 'hidden-aw ' + type + '-extra' : ''}" style="border-left-color:${colors[type]};${isHidden ? ' display:none;' : ''}">
            <div class="aw-title">${item.title}</div>
            <div class="aw-org">${item.org}${item.year ? ' · ' + item.year : ''}${item.recipient ? ' · ' + item.recipient : ''}</div>
            ${item.amount ? `<div style="font-size:0.78rem;color:${colors[type]};font-weight:600;margin-top:4px;">${item.amount}</div>` : ''}
          </div>`;
    }).join('');

    const moreBtn = limitExceeded 
      ? `<div class="aw reveal" onclick="const p=this.parentElement; const els=p.querySelectorAll('.${type}-extra'); els.forEach(e => {e.style.display='block'; setTimeout(() => e.classList.add('visible'), 50);}); this.style.display='none';" style="cursor:pointer; display:flex; align-items:center; justify-content:center; padding:16px; border-left:4px solid transparent; background:var(--light); transition:all 0.2s; box-shadow:none; margin-top:-6px;" onmouseover="this.style.background='rgba(5,92,157,0.05)'; this.style.borderColor='rgba(26,111,212,0.3)';" onmouseout="this.style.background='var(--light)'; this.style.borderColor='var(--border)';">
           <span style="font-size:0.75rem; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.06em;">+ View ${group.length - limit} More</span>
         </div>`
      : '';

    return `
      <div style="margin-bottom:32px;">
        <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:14px;">
          ${icons[type]} ${labels[type]}
        </div>
        ${itemsHTML}
        ${moreBtn}
      </div>`;
  }).join('');

  updateGrid(grid, newHTML, () => {
    document.querySelectorAll('#awards-grid .reveal').forEach(el => observer && observer.observe(el));
  });
}

// ── CORE RESEARCH AXIS SLIDESHOW ────────────────────────────────────────────
(function initCoreAxisSlider() {
  const DESKTOP = 901;

  function isDesktop() { return window.innerWidth >= DESKTOP; }

  const track   = document.getElementById('ca-slide-track');
  const prevBtn = document.getElementById('ca-prev');
  const nextBtn = document.getElementById('ca-next');
  const dotsEl  = document.getElementById('ca-dots');
  const counter = document.getElementById('ca-counter');

  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.schematic-panel'));
  const total  = slides.length;
  let current  = 0;

  // Build dots
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'rs-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    return d;
  });

  function goTo(n) {
    if (!isDesktop()) return;
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (!isDesktop()) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Auto-play (pauses on hover)
  let timer = setInterval(() => { if (isDesktop()) goTo(current + 1); }, 5000);
  const wrapper = track.closest('.research-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(() => { if (isDesktop()) goTo(current + 1); }, 5000);
    });
  }

  // Reset on resize
  window.addEventListener('resize', () => {
    if (!isDesktop()) {
      track.style.transform = '';
    } else {
      goTo(current);
    }
  });

  goTo(0);
})();

// ── VACANCY POPUP ────────────────────────────────────────
async function loadVacancy() {
  // Skip if already dismissed this session
  if (sessionStorage.getItem('vp_dismissed')) return;

  try {
    const rows = await sbFetch('vacancies', 'created_at.asc');
    if (!rows || !rows.length) return;
    const v = rows[0];
    if (!v.is_active) return;

    // Populate popup content
    const titleEl  = document.getElementById('vp-title');
    const descEl   = document.getElementById('vp-desc');
    const applyEl  = document.getElementById('vp-apply');
    const overlay  = document.getElementById('vacancy-overlay');
    const closeBtn = document.getElementById('vp-close');
    const dismiss  = document.getElementById('vp-dismiss');

    if (titleEl) titleEl.textContent = v.title || 'Position Available';
    if (descEl)  descEl.textContent  = v.description || '';
    if (applyEl) applyEl.href        = v.apply_url || 'https://www.nabi.res.in/career.php';

    function closePopup() {
      sessionStorage.setItem('vp_dismissed', '1');
      if (overlay) {
        overlay.classList.remove('vp-visible');
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (dismiss)  dismiss.addEventListener('click', closePopup);
    // Close on backdrop click
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closePopup();
      });
    }
    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePopup();
    });

    // Show popup after 5-second delay (non-blocking)
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => overlay.classList.add('vp-visible'));
        });
      }
    }, 5000);

  } catch (err) {
    // Silently fail — vacancy popup is non-critical
  }
}

// ── ALUMNI ────────────────────────────────────────
async function loadAlumni() {
  const grid = document.getElementById('alumni-grid');
  if (grid) {
    grid.innerHTML = Array(4).fill(`
      <div class="alum reveal">
        <div class="alum-avatar skeleton-box" style="min-width:60px;"></div>
        <div class="alum-info" style="width:100%;">
          <div class="skeleton-box" style="height:18px; width:60%; margin-bottom:6px;"></div>
          <div class="skeleton-box" style="height:14px; width:40%; margin-bottom:6px;"></div>
          <div class="skeleton-box" style="height:12px; width:50%;"></div>
        </div>
      </div>
    `).join('');
  }

  let items = await sbFetch('alumni', 'sort_order.asc');
  if (!grid) return;

  if (!items || items.length === 0) {
    updateGrid(grid, '<div class="section-body" style="width:100%;"><p style="padding:40px; background:var(--navy2); border-radius:8px; text-align:center;">No alumni record available or connection failed. Please <a href="javascript:location.reload()" style="color:var(--accent);">refresh</a>.</p></div>');
    return;
  }

  const delays = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'];
  const newHTML = items.map((m, i) => {
    const cleanName = m.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
    const ini = initials(cleanName);
    const photoHTML = m.photo_url 
      ? `<img src="${m.photo_url}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>`
      : '';
    return `
      <div class="alum reveal ${delays[i % delays.length]}">
        <div class="alum-avatar" style="overflow:hidden;">${photoHTML}<span style="${m.photo_url ? 'display:none;' : ''}">${ini}</span></div>
        <div class="alum-info">
          <div class="alum-name">${m.name}</div>
          <div class="alum-was">${m.role_was}</div>
          ${m.role_now || m.current_institute ? `<div class="alum-now">📌 ${m.role_now}${m.current_institute ? `<br><span style="font-size:0.8rem; font-weight:400; color:var(--muted);">${m.current_institute}</span>` : ''}</div>` : ''}
          ${m.link_url ? `<a class="alum-link" href="${m.link_url}" target="_blank">🔗 LinkedIn</a>` : ''}
        </div>
      </div>`;
  }).join('');

  updateGrid(grid, newHTML, () => {
    document.querySelectorAll('#alumni-grid .reveal').forEach(el => observer && observer.observe(el));
  });
}

// Run all on load — fully non-blocking, page renders immediately
// Show fallback team immediately, then replace with live data
document.addEventListener('DOMContentLoaded', () => {
  // Render all sections immediately - no delays
  loadTeam();
  loadAlumni();
  loadNews().catch(() => {});
  loadAwards().catch(() => {});

  // Load vacancy popup (non-blocking, after 5s)
  loadVacancy().catch(() => {});
});