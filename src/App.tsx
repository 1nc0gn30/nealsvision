import React, { useState } from 'react';
import { 
  Camera, 
  Printer, 
  MapPin, 
  Heart, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Zap,
  ShieldCheck,
  Compass,
  Star,
  Clock,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Shot {
  id: string;
  url: string;
  caption: string;
  location: string;
  date: string;
  likes: number;
  tags: string[];
  rotation: string;
}

const INITIAL_SHOTS: Shot[] = [
  {
    id: '4',
    url: '/headshot.jpg',
    caption: 'Neal at the Oceanfront Boardwalk (Neptune Statue)',
    location: '31st St Neptune Statue',
    date: 'Today, Live',
    likes: 89,
    tags: ['Neal', 'Neptune', 'Oceanfront'],
    rotation: '1deg'
  },
  {
    id: '1',
    url: '/shots/polaroid1.jpg',
    caption: 'Golden Hour Laughs at the Boardwalk',
    location: 'Oceanfront Main Pier',
    date: 'Today, 6:45 PM',
    likes: 42,
    tags: ['Couples', 'Sunset', 'Oceanfront'],
    rotation: '-2deg'
  },
  {
    id: '2',
    url: '/shots/polaroid2.jpg',
    caption: 'Family Magic on the Sand',
    location: '24th Street Beach',
    date: 'Yesterday, 3:15 PM',
    likes: 58,
    tags: ['Family', 'Candid', 'Beach'],
    rotation: '1.5deg'
  },
  {
    id: '3',
    url: '/shots/polaroid3.jpg',
    caption: 'On-Location Natural Headshot',
    location: 'Oceanfront Park',
    date: 'Aug 9, 2026',
    likes: 31,
    tags: ['Headshots', 'On-Demand', 'Portrait'],
    rotation: '-1deg'
  }
];

export default function App() {
  const [shots, setShots] = useState<Shot[]>(INITIAL_SHOTS);
  const [activeTab, setActiveTab] = useState<'gallery' | 'how-it-works' | 'book' | 'tip'>('gallery');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Booking state
  const [bookingType, setBookingType] = useState<'oceanfront' | 'on-demand'>('oceanfront');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    date: '',
    notes: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [userLogoUrl] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const isLiked = prev[id];
      const newLikedState = !isLiked;
      
      setShots(shotsList => 
        shotsList.map(shot => 
          shot.id === id 
            ? { ...shot, likes: shot.likes + (newLikedState ? 1 : -1) } 
            : shot
        )
      );

      if (newLikedState) {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.8 }
        });
      }

      return { ...prev, [id]: newLikedState };
    });
  };

  const [sessionType, setSessionType] = useState('Walk-up Instant Polaroid');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('form-name', 'booking');
    formData.append('name', bookingForm.name);
    formData.append('phone', bookingForm.phone);
    formData.append('location', bookingForm.location);
    formData.append('sessionType', sessionType);
    formData.append('bookingType', bookingType);
    formData.append('notes', bookingForm.notes);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
      .then(() => {
        setBookingSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      })
      .catch((error) => {
        console.error('Netlify Form submission error:', error);
        setBookingSubmitted(true);
      });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--border-light)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    background: '#FAFAF8',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* ═══ PARALLAX WATERMARKS ═══ */}
      <div className="watermark-container" aria-hidden="true">
        <img 
          src="/polaroid_camera_watermark_1786544164142.jpg" 
          alt="" 
          className="parallax-watermark watermark-camera"
          style={{ transform: `translateY(${scrollY * 0.12}px) rotate(-6deg)` }}
        />
        <img 
          src="/neals_signature_seal_1786544187519.jpg" 
          alt="" 
          className="parallax-watermark watermark-seal"
          style={{ transform: `translateY(${scrollY * -0.08}px) rotate(4deg)` }}
        />
        <img 
          src="/beach_sun_watermark_1786544175453.jpg" 
          alt="" 
          className="parallax-watermark watermark-beach"
          style={{ transform: `translateY(${scrollY * 0.15}px) rotate(2deg)` }}
        />
        <img 
          src="/headshot.jpg" 
          alt="" 
          className="parallax-watermark watermark-headshot"
          style={{ transform: `translateY(${scrollY * -0.1}px) rotate(-3deg)` }}
        />
      </div>
      
      {/* ═══ TOP LIVE ALERT BANNER ═══ */}
      <div role="banner" aria-label="Live location alert" style={{ background: '#2C2623', color: '#FAF7F2', padding: '10px 16px', fontSize: '0.875rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span aria-label="Live status indicator" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', boxShadow: '0 0 8px #4ADE80', animation: 'pulseLive 2s ease-in-out infinite' }}></span>
          <strong>🎉 Neal is at the Virginia Beach Oceanfront right now!</strong>
          <span style={{ opacity: 0.8 }}>Near 24th St Boardwalk • Instant polaroid prints in seconds • Walk-ups welcome!</span>
          <button 
            onClick={() => setActiveTab('book')}
            aria-label="Find Neal on the boardwalk today"
            style={{ 
              background: 'var(--accent-warm)', 
              border: 'none', 
              color: '#fff', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              marginLeft: '6px',
              letterSpacing: '0.01em'
            }}
          >
            📍 Find Me Today
          </button>
        </div>
      </div>

      {/* ═══ STICKY HEADER / NAV ═══ */}
      <header style={{ borderBottom: '1px solid var(--border-light)', background: 'rgba(250, 247, 242, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Logo + Brand — clicking returns to gallery */}
          <button
            onClick={() => setActiveTab('gallery')}
            aria-label="1nc0gn30 Vision home — Virginia Beach instant polaroid photographer"
            style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '12px', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-soft-bg)')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            <img 
              src={userLogoUrl || "/text-logo.jpg"} 
              alt="1nc0gn30 Vision 1NC0GN30.SI — Virginia Beach Instant Polaroid Photographer Logo"
              width={220}
              height={54}
              style={{ 
                height: '54px', 
                width: 'auto', 
                maxWidth: '220px',
                borderRadius: '10px', 
                objectFit: 'contain',
                boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
              }} 
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                1nc0gn30 Vision
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em', marginTop: '2px' }}>
                Virginia Beach • Instant Polaroids • Walk-up Welcome
              </div>
            </div>
          </button>

          {/* Navigation */}
          <nav aria-label="Main navigation" style={{ display: 'flex', gap: '6px', background: 'var(--accent-soft-bg)', padding: '5px', borderRadius: '24px', border: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
            {([
              { id: 'gallery', label: '📸 Gallery' },
              { id: 'how-it-works', label: '✨ How It Works' },
              { id: 'book', label: '📍 Find Me' },
              { id: 'tip', label: '💛 Tip Neal' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                style={{
                  padding: '7px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: activeTab === tab.id 
                    ? (tab.id === 'tip' ? 'var(--accent-warm)' : '#FFFFFF') 
                    : 'transparent',
                  color: activeTab === tab.id 
                    ? (tab.id === 'tip' ? '#FFF' : 'var(--text-main)') 
                    : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id && tab.id !== 'tip' ? '0 2px 8px rgba(0,0,0,0.06)' : 
                             activeTab === tab.id && tab.id === 'tip' ? '0 4px 14px rgba(226,125,96,0.35)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main id="main-content" style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '36px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* ─── HERO SECTION ─── */}
        <section aria-labelledby="hero-heading" style={{ marginBottom: '48px' }}>
          <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-light)', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center' }}>
              
              {/* Left: Pitch */}
              <div>
                {/* Logo badge reuse in hero */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <img 
                    src={userLogoUrl || "/text-logo.jpg"} 
                    alt="1nc0gn30 Vision 1NC0GN30.SI"
                    style={{ height: '38px', width: 'auto', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-soft-bg)', border: '1px solid var(--border-light)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--accent-warm)', fontWeight: 600 }}>
                    <Sparkles size={13} />
                    <span>1NC0GN30.SI • Virginia Beach, VA</span>
                  </div>
                </div>

                <h1 id="hero-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', color: 'var(--text-main)', lineHeight: 1.15, marginBottom: '14px' }}>
                  Instant Polaroid Photos<br />on the Virginia Beach Boardwalk.
                </h1>

                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '10px' }}>
                  I walk the <strong>Virginia Beach Oceanfront Boardwalk</strong> with my <strong>Google Pixel Pro</strong> and a portable <strong>Fujifilm Instax printer</strong>. Spot me, say hi, and I'll take your picture and hand you a <strong>real physical polaroid print in under 60 seconds</strong>.
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Candid beach shots, couples, families, headshots, vacation memories — all printed on the spot. <strong>Pay what you love.</strong> Leave a tip if the moment meant something, or just enjoy the print.
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {[
                    { icon: <Clock size={16} />, label: 'Under 60 sec', sub: 'photo to print' },
                    { icon: <Users size={16} />, label: '200+ shots', sub: 'this season' },
                    { icon: <Star size={16} />, label: 'Pay what you love', sub: 'walk-up welcome' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent-soft-bg)', color: 'var(--accent-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.1 }}>{s.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setActiveTab('book')} 
                    aria-label="Find Neal on the Virginia Beach boardwalk today"
                    style={{
                      background: 'var(--text-main)',
                      color: '#FFF',
                      padding: '13px 26px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(44,38,35,0.18)'
                    }}
                  >
                    <Camera size={18} />
                    📍 Find Me / Book Me Today
                  </button>

                  <button 
                    onClick={() => setActiveTab('tip')} 
                    aria-label="Leave a tip via Stripe"
                    style={{
                      background: '#FFF',
                      color: 'var(--accent-warm)',
                      padding: '13px 26px',
                      borderRadius: '24px',
                      border: '2px solid var(--accent-warm)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Heart size={18} />
                    💛 Leave a Tip
                  </button>
                </div>
              </div>

              {/* Right: Polaroid headshot */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ transform: 'rotate(-2deg)', maxWidth: '300px', width: '100%' }}>
                  <div className="polaroid-frame">
                    <div className="polaroid-image-wrapper">
                      <img 
                        src="/headshot.jpg" 
                        alt="Neal — Virginia Beach boardwalk photographer with Google Pixel Pro, near 31st Street Neptune Statue" 
                        width={300} height={300}
                        fetchPriority="high"
                      />
                    </div>
                    <div className="polaroid-caption">
                      Neal @ Neptune Statue, VB 🌊
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                      Pixel Pro • Instax Print • Walk-up Welcome
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── LOGO TRUST BAR ─── */}
        <section aria-label="About 1nc0gn30 Vision brand" style={{ marginBottom: '48px' }}>
          <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '20px 28px', backdropFilter: 'blur(6px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              {/* Logo featured prominently */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src={userLogoUrl || "/text-logo.jpg"} 
                  alt="1nc0gn30 Vision 1NC0GN30.SI official logo"
                  style={{ height: '46px', width: 'auto', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>1nc0gn30 Vision · 1NC0GN30.SI</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Virginia Beach's On-Demand Polaroid Photographer</div>
                </div>
              </div>

              {/* Trust pills */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  '📱 Google Pixel Pro',
                  '🖨️ Fujifilm Instax',
                  '🌊 VB Oceanfront',
                  '💛 Pay What You Love',
                ].map((pill, i) => (
                  <span key={i} style={{ fontSize: '0.8rem', padding: '6px 14px', background: 'var(--accent-soft-bg)', border: '1px solid var(--border-light)', borderRadius: '16px', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TAB 1: POLAROID GALLERY ─── */}
        {activeTab === 'gallery' && (
          <section aria-labelledby="gallery-heading">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 id="gallery-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Recent Polaroid Shots — Virginia Beach
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Real candid moments captured live at the <strong>Virginia Beach Oceanfront Boardwalk</strong> & beyond. Printed on-the-spot.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', padding: '6px 13px', background: '#FFF', border: '1px solid var(--border-light)', borderRadius: '16px', color: 'var(--text-muted)' }}>📸 Pixel Pro Camera</span>
                <span style={{ fontSize: '0.82rem', padding: '6px 13px', background: '#FFF', border: '1px solid var(--border-light)', borderRadius: '16px', color: 'var(--text-muted)' }}>🖨️ Instax Print</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '32px', padding: '12px 0' }}>
              {shots.map((shot) => (
                <article key={shot.id} style={{ transform: `rotate(${shot.rotation})` }} aria-label={`Polaroid shot: ${shot.caption}`}>
                  <div className="polaroid-frame">
                    <div className="polaroid-image-wrapper">
                      <img src={shot.url} alt={`Virginia Beach polaroid photo: ${shot.caption}`} loading="lazy" />
                    </div>
                    <div className="polaroid-caption">
                      {shot.caption}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--accent-warm)" />
                        <span>{shot.location}</span>
                      </div>
                      <button 
                        onClick={() => handleLike(shot.id)} 
                        aria-label={`Like this shot — ${shot.likes} likes`}
                        style={{
                          background: likedIds[shot.id] ? '#FEE2E2' : 'transparent',
                          border: 'none',
                          color: likedIds[shot.id] ? '#EF4444' : 'var(--text-muted)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                          fontSize: '0.78rem'
                        }}
                      >
                        <Heart size={13} fill={likedIds[shot.id] ? '#EF4444' : 'none'} />
                        <span>{shot.likes}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA below gallery */}
            <div style={{ marginTop: '48px', padding: '28px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', backdropFilter: 'blur(6px)' }}>
              <img src={userLogoUrl || "/text-logo.jpg"} alt="1nc0gn30 Vision logo" style={{ height: '44px', width: 'auto', borderRadius: '8px', objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '4px' }}>Want YOUR polaroid in Neal's gallery?</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Spot Neal on the Virginia Beach Boardwalk, get your shot printed in seconds, and opt-in to be featured right here!</p>
              </div>
              <button 
                onClick={() => setActiveTab('book')}
                style={{ background: 'var(--accent-warm)', color: '#FFF', padding: '11px 22px', borderRadius: '20px', border: 'none', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                📍 Find Neal Today
              </button>
            </div>

            {/* ─── TIPS INFO + FAQ SNIPPET (AEO content) ─── */}
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

              <div style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid var(--border-light)', borderRadius: '18px', padding: '24px', backdropFilter: 'blur(6px)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 600 }}>
                  💛 Pay What You Love
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Walk-up polaroids stay easy and personal. <strong>No appointment, no price list</strong> — just a candid moment and a print in your hands. <strong>Tips via Stripe are always your choice</strong> and help cover Instax film, paper, and gear so Neal can keep showing up on the boardwalk.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid var(--border-light)', borderRadius: '18px', padding: '24px', backdropFilter: 'blur(6px)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 600 }}>
                  🌊 Where Exactly on the Boardwalk?
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Neal roams the <strong>Virginia Beach Oceanfront Boardwalk</strong> between <strong>17th and 40th Street</strong>, with hotspots near the <strong>Neptune Statue (31st St)</strong>, the main Pier, and the 24th Street Park. Use the "Find Me" tab to ping his exact location and he'll walk right to you.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid var(--border-light)', borderRadius: '18px', padding: '24px', backdropFilter: 'blur(6px)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 600 }}>
                  ⚡ How Fast Is "Instant"?
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Neal shoots on a <strong>Google Pixel Pro</strong> (industry-best computational photography), wirelessly transmits to a <strong>Fujifilm Instax mobile printer</strong>, and you're holding a <strong>physical polaroid print in under 60 seconds</strong>. No app to download, no waiting for a USB — just instant magic.
                </p>
              </div>

            </div>

            <section aria-labelledby="faq-heading" style={{ marginTop: '40px', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '28px 28px 18px', backdropFilter: 'blur(6px)' }}>
              <h2 id="faq-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Virginia Beach Polaroid FAQs
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Quick answers for guests looking for instant polaroid prints on the Virginia Beach Oceanfront Boardwalk.
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  {
                    q: 'Where can I find Neal on the Virginia Beach Boardwalk?',
                    a: 'Neal roams the Virginia Beach Oceanfront Boardwalk between 17th and 40th Street, most often near 24th Street, the Neptune Statue at 31st Street, and the main pier. Use the Find Me form to tell him where you are and he will walk over.',
                  },
                  {
                    q: 'How much do instant polaroid prints cost on the Virginia Beach boardwalk?',
                    a: 'Walk-up polaroids are pay-what-you-love. Most guests leave $5 to $20 through Stripe after they have their print. Leave what feels right for the moment.',
                  },
                  {
                    q: 'How fast can I get an instant polaroid printed at Virginia Beach?',
                    a: 'The whole process takes under 60 seconds. Neal photographs you on a Google Pixel Pro, sends the photo wirelessly to a portable Fujifilm Instax printer, and hands you a physical polaroid print.',
                  },
                  {
                    q: 'Do I need an appointment for boardwalk polaroids?',
                    a: 'No appointment is needed for walk-up shots on the Virginia Beach Oceanfront Boardwalk. Wave Neal over or use the Find Me form. Scheduled sessions are available for headshots, family photos, and events around Virginia Beach.',
                  },
                  {
                    q: 'Can Neal come to my location for photos in Virginia Beach?',
                    a: 'Yes. In addition to walk-up shots on the boardwalk, Neal offers on-demand booking for headshots, family sessions, and events throughout Virginia Beach. Submit a request through the Find Me form.',
                  },
                  {
                    q: 'What camera and printer does Neal use for instant polaroids?',
                    a: 'Neal uses a Google Pixel Pro for computational photography and a portable Fujifilm Instax mobile printer to produce a physical polaroid-style print in seconds.',
                  },
                ].map((item) => (
                  <details key={item.q} style={{ background: 'var(--accent-soft-bg)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px 16px' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {item.q}
                    </summary>
                    <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </section>
        )}

        {/* ─── TAB 2: HOW IT WORKS ─── */}
        {activeTab === 'how-it-works' && (
          <section aria-labelledby="how-heading" style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <img 
                src={userLogoUrl || "/text-logo.jpg"}
                alt="1nc0gn30 Vision 1NC0GN30.SI"
                style={{ height: '52px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 16px', display: 'block', boxShadow: '0 3px 12px rgba(0,0,0,0.1)' }}
              />
              <h2 id="how-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', marginBottom: '10px', color: 'var(--text-main)' }}>
                The Instant Polaroid Experience
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
                How <strong>Google Pixel Pro precision</strong> meets tangible, physical <strong>polaroid print magic</strong> — in under 60 seconds on the Virginia Beach Boardwalk.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                {
                  step: 1,
                  color: 'var(--text-main)',
                  icon: <Camera size={18} color="var(--accent-warm)" />,
                  title: 'Snap — Shot on Google Pixel Pro',
                  body: "Neal composes your photo using the Pixel Pro's computational photography, Portrait Mode depth, and vibrant dynamic range. Studio-quality candid moments — even in low beach light. Your shot is taken in one click.",
                },
                {
                  step: 2,
                  color: 'var(--accent-warm)',
                  icon: <Zap size={18} color="var(--accent-amber)" />,
                  title: 'Transmit — Wireless in Seconds',
                  body: "With a single tap, the photo is formatted to polaroid aspect ratio and wirelessly sent to the portable Fujifilm Instax printer right in Neal's hand. No cables, no waiting for an app.",
                },
                {
                  step: 3,
                  color: 'var(--accent-ocean)',
                  icon: <Printer size={18} color="var(--accent-ocean)" />,
                  title: 'Print — Physical Polaroid In Your Hands',
                  body: 'Watch it develop in real time. The Instax printer produces a real, physical, silver-halide polaroid-style print — a permanent keepsake from your Virginia Beach vacation moment.',
                },
                {
                  step: 4,
                  color: '#4CAF50',
                  icon: <Heart size={18} color="#4CAF50" />,
                  title: 'Keep the Print — Tip If You Loved It',
                  body: "Leave a $5–$20 tip through Stripe if the moment made your day. Tips cover Instax film, paper, and gear so Neal can keep showing up on the boardwalk. Either way, the print is yours.",
                },
              ].map((item) => (
                <div key={item.step} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border-light)', borderRadius: '18px', padding: '26px', display: 'flex', gap: '20px', alignItems: 'flex-start', backdropFilter: 'blur(6px)' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: item.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.icon}
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA at bottom of how-it-works */}
            <div style={{ textAlign: 'center', marginTop: '40px', padding: '32px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', border: '1px solid var(--border-light)', backdropFilter: 'blur(6px)' }}>
              <img src={userLogoUrl || "/text-logo.jpg"} alt="1nc0gn30 Vision logo" style={{ height: '40px', width: 'auto', borderRadius: '8px', objectFit: 'contain', margin: '0 auto 14px', display: 'block' }} />
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Ready for your instant polaroid? Neal is on the <strong>Virginia Beach Boardwalk right now.</strong>
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('book')} style={{ background: 'var(--accent-warm)', color: '#FFF', padding: '13px 28px', borderRadius: '24px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                  📍 Find Neal Now
                </button>
                <button onClick={() => setActiveTab('gallery')} style={{ background: '#FFF', color: 'var(--text-main)', padding: '13px 28px', borderRadius: '24px', border: '1px solid var(--border-light)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
                  See the Gallery
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB 3: BOOK / FIND ME ─── */}
        {activeTab === 'book' && (
          <section aria-labelledby="book-heading" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <img src={userLogoUrl || "/text-logo.jpg"} alt="1nc0gn30 Vision 1NC0GN30.SI" style={{ height: '46px', width: 'auto', borderRadius: '8px', objectFit: 'contain', margin: '0 auto 14px', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              <h2 id="book-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>
                Find Neal on the Virginia Beach Boardwalk
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
                Spot me walking the oceanfront and wave me over — or fill out the form below so I know where to find you. <strong>Walk-ups always welcome, no appointment needed.</strong>
              </p>
            </div>

            {/* Booking type toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
              <button 
                onClick={() => setBookingType('oceanfront')}
                aria-pressed={bookingType === 'oceanfront'}
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  border: bookingType === 'oceanfront' ? '2px solid var(--accent-warm)' : '1.5px solid var(--border-light)',
                  background: bookingType === 'oceanfront' ? '#FFF' : 'rgba(255,255,255,0.6)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: bookingType === 'oceanfront' ? '0 4px 14px rgba(226,125,96,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px' }}>
                  <MapPin size={17} color="var(--accent-warm)" />
                  🌊 Boardwalk Spotting
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  I'm somewhere between 17th–40th St. Tell me where you are and I'll walk to you. Walk-ups always welcome!
                </div>
              </button>

              <button 
                onClick={() => setBookingType('on-demand')}
                aria-pressed={bookingType === 'on-demand'}
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  border: bookingType === 'on-demand' ? '2px solid var(--accent-ocean)' : '1.5px solid var(--border-light)',
                  background: bookingType === 'on-demand' ? '#FFF' : 'rgba(255,255,255,0.6)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: bookingType === 'on-demand' ? '0 4px 14px rgba(65,123,140,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px' }}>
                  <Compass size={17} color="var(--accent-ocean)" />
                  📋 On-Demand Booking
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  Book me to come to your location for headshots, family sessions, or events around Virginia Beach.
                </div>
              </button>
            </div>

            {/* Form */}
            <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-light)', borderRadius: '22px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', backdropFilter: 'blur(8px)' }}>
              {bookingSubmitted ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <CheckCircle size={32} />
                  </div>
                  <img src={userLogoUrl || "/text-logo.jpg"} alt="1nc0gn30 Vision" style={{ height: '36px', width: 'auto', borderRadius: '6px', objectFit: 'contain', margin: '0 auto 14px', display: 'block' }} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '8px' }}>Request Received!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
                    {bookingType === 'oceanfront' 
                      ? "🌊 I'm checking my phone now! Stay near your spot on the boardwalk — I'll walk right to you!"
                      : "📋 Thanks for reaching out! I'll text or call you shortly to confirm time, location, and details."}
                  </p>
                  <button 
                    onClick={() => { setBookingSubmitted(false); }} 
                    style={{ background: 'var(--text-main)', color: '#FFF', padding: '11px 26px', borderRadius: '20px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form 
                  name="booking" 
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field" 
                  onSubmit={handleBookingSubmit} 
                  style={{ display: 'grid', gap: '20px' }}
                >
                  <input type="hidden" name="form-name" value="booking" />
                  <p style={{ display: 'none' }}>
                    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label htmlFor="booking-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Your Name</label>
                      <input id="booking-name" type="text" name="name" required placeholder="e.g. Alex" value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Phone / Text Number</label>
                      <input id="booking-phone" type="tel" name="phone" required placeholder="(948) 204-7987" value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label htmlFor="booking-location" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        {bookingType === 'oceanfront' ? '📍 Your Boardwalk Location' : '📋 Desired Session Location'}
                      </label>
                      <input id="booking-location" type="text" name="location" required placeholder={bookingType === 'oceanfront' ? 'e.g. Near 24th St Neptune Statue' : 'e.g. Chic\'s Beach, Backyard, Park'} value={bookingForm.location} onChange={(e) => setBookingForm({...bookingForm, location: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="booking-session" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Session Type</label>
                      <select id="booking-session" name="sessionType" value={sessionType} onChange={(e) => setSessionType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option>Walk-up Instant Polaroid</option>
                        <option>Family Beach Photoshoot (On-Demand)</option>
                        <option>Professional Headshots (On-Demand)</option>
                        <option>Couples / Engagement Shoot</option>
                        <option>Special Event / Party (On-Demand)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-notes" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Notes / Special Requests</label>
                    <textarea id="booking-notes" name="notes" rows={3} placeholder="How many prints? Any props? Best time to catch you? Let Neal know!" value={bookingForm.notes} onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})} style={inputStyle} />
                  </div>

                  <button 
                    type="submit" 
                    style={{ 
                      background: bookingType === 'oceanfront' ? 'var(--accent-warm)' : 'var(--accent-ocean)', 
                      color: '#FFF', 
                      padding: '15px 24px', 
                      borderRadius: '14px', 
                      border: 'none', 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: bookingType === 'oceanfront' ? '0 6px 20px rgba(226,125,96,0.3)' : '0 6px 20px rgba(65,123,140,0.25)'
                    }}
                  >
                    <Send size={17} />
                    {bookingType === 'oceanfront' ? '📍 Notify Neal — I\'m on the Boardwalk!' : '📋 Request On-Demand Booking'}
                  </button>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-6px' }}>
                    Sending a request is free. Tips through Stripe are always optional.
                  </p>
                </form>
              )}
            </div>
          </section>
        )}

        {/* ─── TAB 4: TIP VIA STRIPE ─── */}
        {activeTab === 'tip' && (
          <section aria-labelledby="tip-heading" style={{ maxWidth: '660px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-light)', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', backdropFilter: 'blur(10px)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src={userLogoUrl || "/text-logo.jpg"} alt="1nc0gn30 Vision 1NC0GN30.SI" style={{ height: '54px', width: 'auto', borderRadius: '10px', objectFit: 'contain', margin: '0 auto 16px', display: 'block', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(226,125,96,0.1)', color: 'var(--accent-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <Heart size={26} fill="var(--accent-warm)" />
                </div>
                <h2 id="tip-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Show Neal Some Love 💛
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto' }}>
                  Loved your instant polaroid? Tips go toward Instax film, paper, and gear so Neal can keep printing on the boardwalk. A quick Stripe checkout — no account needed.
                </p>
              </div>

              {/* Tip cards */}
              <div style={{ display: 'grid', gap: '14px', marginBottom: '24px' }}>
                
                {[
                  {
                    href: 'https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X',
                    amount: '$5',
                    label: '$5 Polaroid Coffee Tip',
                    sub: 'Helps cover a film cartridge refill',
                    accent: 'var(--accent-warm)',
                    featured: false,
                    badge: null,
                  },
                  {
                    href: 'https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X',
                    amount: '$10',
                    label: '$10 Supporter Tip',
                    sub: 'Keep the mobile Instax printer rolling',
                    accent: 'var(--accent-warm)',
                    featured: true,
                    badge: '⭐ Most Popular',
                  },
                  {
                    href: 'https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X',
                    amount: '$20',
                    label: '$20 Super Fan Tip',
                    sub: 'Huge support for Neal\'s Vision & gear',
                    accent: 'var(--accent-ocean)',
                    featured: false,
                    badge: '🙏 VIP Supporter',
                  },
                ].map((tip) => (
                  <a
                    key={tip.amount}
                    href={tip.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Tip Neal ${tip.amount} via Stripe — ${tip.sub}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 22px',
                      borderRadius: '16px',
                      border: tip.featured ? `2px solid ${tip.accent}` : '1.5px solid var(--border-light)',
                      background: tip.featured ? '#FFF' : 'rgba(250,247,242,0.8)',
                      textDecoration: 'none',
                      color: 'var(--text-main)',
                      transition: 'all 0.2s ease',
                      boxShadow: tip.featured ? '0 4px 16px rgba(226,125,96,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      if (!tip.featured) e.currentTarget.style.borderColor = tip.accent;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'none';
                      if (!tip.featured) e.currentTarget.style.borderColor = 'var(--border-light)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: tip.featured ? tip.accent : `${tip.accent}22`, color: tip.featured ? '#FFF' : tip.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                        {tip.amount}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {tip.label}
                          {tip.badge && <span style={{ fontSize: '0.68rem', background: tip.featured ? '#FEF3C7' : '#E0F2FE', color: tip.featured ? '#B45309' : '#0369A1', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{tip.badge}</span>}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{tip.sub}</div>
                      </div>
                    </div>
                    <span style={{ background: tip.accent, color: '#FFF', padding: '10px 18px', borderRadius: '20px', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Tip {tip.amount} →
                    </span>
                  </a>
                ))}

              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', paddingTop: '14px', borderTop: '1px dashed var(--border-light)' }}>
                <ShieldCheck size={17} color="var(--accent-ocean)" />
                <span>Redirects to official <strong>Stripe Checkout</strong> — secure, encrypted, no account needed</span>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                Thank you for keeping Neal on the boardwalk. 💛
              </p>

            </div>
          </section>
        )}

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: 'rgba(255,255,255,0.95)', borderTop: '1px solid var(--border-light)', padding: '36px 24px', marginTop: '64px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Footer top: logo + links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img 
                src={userLogoUrl || "/text-logo.jpg"} 
                alt="1nc0gn30 Vision 1NC0GN30.SI Footer Logo"
                style={{ height: '42px', width: 'auto', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>1nc0gn30 Vision</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Virginia Beach Instant Polaroid Photographer • 1NC0GN30.SI</div>
              </div>
            </div>

            <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {([
                { id: 'gallery', label: 'Gallery' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'book', label: 'Find Me' },
                { id: 'tip', label: 'Tip Neal' },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, padding: '0', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-warm)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer keyword-rich copy for SEO */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>📱 Google Pixel Pro</span>
              <span>•</span>
              <span>🖨️ Fujifilm Instax Printer</span>
              <span>•</span>
              <span>🌊 Virginia Beach Oceanfront Boardwalk</span>
              <span>•</span>
              <span>💛 Walk-up Polaroids · Pay What You Love</span>
            </div>
            <div>
              © {new Date().getFullYear()} 1nc0gn30 Vision / 1NC0GN30.SI — Virginia Beach, VA. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
