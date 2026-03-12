'use client';

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13,27,53,0.96)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <div
        className="container"
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>
          NeuroMeT
        </a>
        <div style={{ display: 'flex', gap: 14, fontSize: 13 }}>
          <a href="#about" style={{ color: 'rgba(255,255,255,0.75)' }}>
            About
          </a>
          <a href="#research" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Research
          </a>
          <a href="#team" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Team
          </a>
          <a href="#publications" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Publications
          </a>
          <a href="#news" style={{ color: 'rgba(255,255,255,0.75)' }}>
            News
          </a>
          <a href="#awards" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Awards
          </a>
          <a href="#contact" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

