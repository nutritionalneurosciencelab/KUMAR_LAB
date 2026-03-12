import LegacyInteractions from '@/components/LegacyInteractions';
import SupabaseHydrator from '@/components/SupabaseHydrator';

const legacyHtml = String.raw`
<!-- ── NAV ── -->
<nav id="main-nav">
  <a class="nav-logo" href="#home">
    <span class="nav-logo-dot"></span>
    <span class="nav-logo-text">
      <span class="nav-logo-main">NeuroMeT</span>
      <span class="nav-logo-sub">Neuroscience &amp; Immuno-Metabolism Lab</span>
    </span>
  </a>
  <ul class="nav-links" id="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#research">Research</a></li>
    <li><a href="#team">Team</a></li>
    <li><a href="#publications">Publications</a></li>
    <li><a href="#news">News</a></li>
    <li><a href="#awards">Awards &amp; Funding</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <div class="nav-toggle" id="nav-toggle" aria-label="Open menu">
    <span></span><span></span><span></span>
  </div>
</nav>

<!-- Mobile nav -->
<div class="nav-mobile" id="nav-mobile">
  <a href="#about" class="nav-mob-link">About</a>
  <a href="#research" class="nav-mob-link">Research</a>
  <a href="#team" class="nav-mob-link">Team</a>
  <a href="#publications" class="nav-mob-link">Publications</a>
  <a href="#news" class="nav-mob-link">News</a>
  <a href="#awards" class="nav-mob-link">Awards &amp; Funding</a>
  <a href="#contact" class="nav-mob-link">Contact</a>
</div>

<!-- ── HERO ── -->
<div class="hero" id="home">
  <div class="hero-gradient"></div>
  <div class="hero-grid"></div>
  <canvas id="hero-canvas"></canvas>

  <div class="hero-content">
    <div class="hero-tag">BRIC-NABI · Mohali, India</div>
    <h1><em>NeuroMeT</em> Lab</h1>
    <p class="hero-sub" style="font-size:1.15rem; color:rgba(255,255,255,0.85); font-weight:400; margin-bottom:8px;">Neuroscience &amp; Immuno-Metabolism Laboratory</p>
    <p class="hero-sub">
      Investigating how nutrition and metabolism reprogram neuroimmune circuits —
      to understand, prevent, and treat neurological and metabolic disorders.
    </p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="num"><span class="count-animate" data-target="5">0</span>+</div>
        <div class="label">Research Scholars</div>
      </div>
      <div class="hero-stat">
        <div class="num"><span class="count-animate" data-target="20">0</span>+</div>
        <div class="label">Publications</div>
      </div>
      <div class="hero-stat">
        <div class="num"><span class="count-animate" data-target="3">0</span></div>
        <div class="label">Research Areas</div>
      </div>
      <div class="hero-stat">
        <div class="num"><span class="count-animate" data-target="7">0</span>+</div>
        <div class="label">Awards &amp; Funding</div>
      </div>
    </div>
  </div>

  <div class="research-visual">
    <div class="micro-ring"></div>
    <div class="micro-ring"></div>
    <div class="micro-frame">
      <img src="lab_glia_zstack.gif" alt="Confocal z-stack: hippocampal glial cells — NeuroMeT Lab" onerror="this.src='lab_glia_max.png'"/>
      <div class="micro-scan"></div>
    </div>
    <div class="micro-node"></div>
    <div class="micro-node"></div>
    <div class="micro-node"></div>
    <div class="micro-label">Hippocampal Glia · Confocal Z-Stack</div>
  </div>

  <a class="hero-scroll" href="#about">
    Explore
    <div class="hero-scroll-line"></div>
  </a>
</div>

<div class="page">
  <div class="section" id="about">
    <div class="section-eyebrow reveal">Principal Investigator</div>
    <div class="section-heading reveal">Dr. Mohit Kumar</div>
    <p class="section-body reveal">This section will be migrated to structured data next.</p>
  </div>

  <div class="section" id="research">
    <div class="section-eyebrow reveal">Research</div>
    <div class="section-heading reveal">Ongoing Projects</div>
    <div class="section-body reveal">
      <p>Our lab pursues three interconnected research areas that together address how nutrition and metabolism shape neuroimmune health and disease.</p>
    </div>
  </div>

  <div class="section" id="team">
    <div class="section-eyebrow reveal">Team</div>
    <div class="section-heading reveal">Our People</div>
    <div class="section-body reveal">
      <div id="team-content"></div>
    </div>
  </div>

  <div class="section" id="publications">
    <div class="section-eyebrow reveal">Publications</div>
    <div class="section-heading reveal">Publications</div>
    <div class="section-body reveal">
      <div id="pubs-content"></div>
    </div>
  </div>

  <div class="section" id="news">
    <div class="section-eyebrow reveal">Lab News</div>
    <div class="section-heading reveal">News &amp; Updates</div>
    <div class="section-body reveal">
      <div id="news-content"></div>
    </div>
  </div>

  <div class="section" id="awards">
    <div class="section-eyebrow reveal">Recognition</div>
    <div class="section-heading reveal">Awards &amp; Funding</div>
    <div class="section-body reveal"><p>Details to be updated shortly.</p></div>
  </div>

  <div class="section" id="contact">
    <div class="section-eyebrow reveal">Contact</div>
    <div class="section-heading reveal">Reach Us</div>
    <div class="contact-grid">
      <div class="reveal">
        <div class="contact-item">
          <div class="c-ic">📍</div>
          <div>
            <h4>Lab Address</h4>
            <p>BRIC-National Agri-Food and Biomanufacturing Institute (NABI)<br/>
            Sector 81, S.A.S. Nagar (Mohali)<br/>Punjab — 140306, India</p>
          </div>
        </div>
      </div>
      <div class="reveal reveal-delay-1">
        <div class="map-wrap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.8!2d76.7271!3d30.6958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feeec4b80003d%3A0xb0ef5dc4b88c6de8!2sNational%20Agri-Food%20and%20Biomanufacturing%20Institute!5e0!3m2!1sen!2sin!4v1680000000000"
            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="lightbox" id="lightbox">
  <button class="lightbox-close" id="lb-close">✕</button>
  <button class="lightbox-prev" id="lb-prev">‹</button>
  <img src="" alt="" id="lb-img"/>
  <button class="lightbox-next" id="lb-next">›</button>
</div>

<a class="back-top" href="#home" id="back-top">↑</a>
`;

export default function HomePage() {
  return (
    <main suppressHydrationWarning>
      <LegacyInteractions />
      <SupabaseHydrator />
      <div dangerouslySetInnerHTML={{ __html: legacyHtml }} />
    </main>
  );
}

