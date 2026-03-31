import Groq from "groq-sdk";

const SKELETON = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[NAMA BRAND] - [Tagline Singkat & Menarik]</title>
  <meta name="description" content="[Deskripsi SEO 150 karakter tentang bisnis/layanan]">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=[FONT_HEADING]:wght@700;800;900&family=[FONT_BODY]:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ============================================================
       CSS VARIABLES — sesuaikan warna dengan konteks bisnis
    ============================================================ */
    :root {
      --primary:       [WARNA_UTAMA_HEX];
      --primary-dark:  [WARNA_UTAMA_LEBIH_GELAP];
      --primary-light: [WARNA_UTAMA_SANGAT_MUDA];
      --primary-rgb:   [R], [G], [B];          /* angka saja, untuk rgba() */
      --secondary:     [WARNA_SEKUNDER_HEX];
      --accent:        [WARNA_AKSEN_HEX];

      --text-dark:     #0f172a;
      --text-body:     #334155;
      --text-muted:    #64748b;
      --bg-white:      #ffffff;
      --bg-light:      #f8fafc;
      --bg-soft:       #f1f5f9;
      --border:        #e2e8f0;

      --shadow-xs: 0 1px 3px rgba(0,0,0,.08);
      --shadow-sm: 0 4px 16px rgba(0,0,0,.08);
      --shadow-md: 0 8px 32px rgba(0,0,0,.12);
      --shadow-lg: 0 24px 64px rgba(0,0,0,.15);
      --shadow-xl: 0 40px 80px rgba(0,0,0,.18);

      --radius-sm: 10px;
      --radius:    16px;
      --radius-lg: 24px;
      --radius-xl: 32px;

      --font-heading: '[FONT_HEADING]', sans-serif;
      --font-body:    '[FONT_BODY]', sans-serif;

      --transition: 0.3s cubic-bezier(.4,0,.2,1);
    }

    /* ============================================================
       RESET & BASE
    ============================================================ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      font-family: var(--font-body);
      color: var(--text-body);
      background: var(--bg-white);
      line-height: 1.7;
      overflow-x: hidden;
    }
    img { max-width: 100%; height: auto; display: block; }
    a  { text-decoration: none; color: inherit; }
    ul { list-style: none; }
    section { padding: 96px 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* ============================================================
       TYPOGRAPHY
    ============================================================ */
    h1, h2, h3, h4 { font-family: var(--font-heading); color: var(--text-dark); line-height: 1.2; }
    h1 { font-size: clamp(2.4rem, 5.5vw, 3.8rem); font-weight: 900; letter-spacing: -0.02em; }
    h2 { font-size: clamp(1.9rem, 4vw,  2.8rem); font-weight: 800; letter-spacing: -0.01em; }
    h3 { font-size: 1.2rem;  font-weight: 700; }
    p  { font-size: 1.05rem; line-height: 1.8; }

    /* ============================================================
       UTILITY
    ============================================================ */
    .section-label {
      display: inline-block;
      font-size: 0.78rem; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: var(--primary);
      background: rgba(var(--primary-rgb), .1);
      padding: 6px 14px; border-radius: 50px;
      margin-bottom: 14px;
    }
    .section-header { text-align: center; max-width: 660px; margin: 0 auto 64px; }
    .section-header h2  { margin-bottom: 16px; }
    .section-header > p { color: var(--text-muted); font-size: 1.1rem; }

    /* ============================================================
       BUTTONS
    ============================================================ */
    .btn {
      display: inline-flex; align-items: center; gap: 9px;
      padding: 15px 32px; border-radius: 50px;
      font-family: var(--font-body); font-weight: 600; font-size: 1rem;
      cursor: pointer; border: none;
      transition: all var(--transition);
      white-space: nowrap;
    }
    .btn-primary {
      background: var(--primary); color: #fff;
      box-shadow: 0 4px 24px rgba(var(--primary-rgb), .38);
    }
    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-3px);
      box-shadow: 0 10px 36px rgba(var(--primary-rgb), .48);
    }
    .btn-outline {
      background: transparent; color: var(--primary);
      border: 2px solid var(--primary);
    }
    .btn-outline:hover {
      background: var(--primary); color: #fff;
      transform: translateY(-3px);
    }
    .btn-white {
      background: #fff; color: var(--primary);
      box-shadow: var(--shadow-md);
    }
    .btn-white:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .btn-ghost {
      background: rgba(var(--primary-rgb), .08); color: var(--primary);
    }
    .btn-ghost:hover { background: rgba(var(--primary-rgb), .16); transform: translateY(-2px); }

    /* ============================================================
       NAVBAR
    ============================================================ */
    #navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      transition: all var(--transition);
    }
    #navbar.scrolled {
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: var(--shadow-xs);
    }
    nav {
      display: flex; align-items: center; justify-content: space-between;
      height: 76px; max-width: 1200px; margin: 0 auto; padding: 0 24px;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800;
      color: var(--primary);
    }
    .nav-logo .logo-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
    }
    .nav-links {
      display: flex; align-items: center; gap: 36px;
    }
    .nav-links a {
      font-size: 0.93rem; font-weight: 500; color: var(--text-dark);
      transition: color var(--transition); position: relative; padding-bottom: 4px;
    }
    .nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 2px; background: var(--primary);
      border-radius: 2px; transition: width var(--transition);
    }
    .nav-links a:hover { color: var(--primary); }
    .nav-links a:hover::after { width: 100%; }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      cursor: pointer; padding: 4px; background: none; border: none;
    }
    .hamburger span {
      display: block; width: 26px; height: 2.5px;
      background: var(--text-dark); border-radius: 3px;
      transition: all var(--transition);
    }
    /* Mobile menu */
    #mobile-menu {
      display: none;
      background: rgba(255,255,255,.97);
      backdrop-filter: blur(16px);
      border-top: 1px solid var(--border);
      padding: 20px 24px 28px;
    }
    #mobile-menu a {
      display: block; padding: 12px 4px;
      font-weight: 500; font-size: 1rem;
      color: var(--text-dark);
      border-bottom: 1px solid var(--border);
      transition: color var(--transition);
    }
    #mobile-menu a:hover { color: var(--primary); }
    #mobile-menu .btn { margin-top: 16px; width: 100%; justify-content: center; }

    /* ============================================================
       HERO
    ============================================================ */
    #hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding-top: 76px;
      background: [HERO_GRADIENT];   /* e.g. linear-gradient(135deg, #0f0c29, #302b63, #24243e) */
      position: relative; overflow: hidden;
    }
    /* decorative blobs */
    #hero::before, #hero::after {
      content: ''; position: absolute; border-radius: 50%;
      filter: blur(90px); opacity: .18; pointer-events: none;
    }
    #hero::before {
      width: 600px; height: 600px;
      background: var(--primary);
      top: -120px; right: -80px;
    }
    #hero::after {
      width: 500px; height: 500px;
      background: var(--secondary);
      bottom: -100px; left: -60px;
    }
    .hero-inner {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 64px; align-items: center;
      max-width: 1200px; margin: 0 auto;
      padding: 72px 24px;
      position: relative; z-index: 1;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.12);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 50px; padding: 8px 18px;
      font-size: 0.85rem; font-weight: 600;
      color: #fff; margin-bottom: 24px;
    }
    .hero-badge .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #4ade80;
      animation: pulse-dot 2s infinite;
    }
    @keyframes pulse-dot {
      0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,.6); }
      50%      { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
    }
    .hero-title { color: #fff; margin-bottom: 22px; }
    .hero-title span { color: var(--accent); }
    .hero-desc {
      color: rgba(255,255,255,.8);
      font-size: 1.15rem; margin-bottom: 40px; max-width: 520px;
    }
    .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 52px; }
    .hero-trust {
      display: flex; align-items: center; gap: 16px;
      flex-wrap: wrap;
    }
    .avatar-stack { display: flex; }
    .avatar-stack img {
      width: 38px; height: 38px; border-radius: 50%;
      border: 3px solid rgba(255,255,255,.5);
      margin-left: -10px; object-fit: cover;
    }
    .avatar-stack img:first-child { margin-left: 0; }
    .hero-trust-text { font-size: 0.85rem; color: rgba(255,255,255,.75); }
    .hero-trust-text strong { color: #fff; }
    /* hero image side */
    .hero-visual { position: relative; animation: float 5s ease-in-out infinite; }
    @keyframes float {
      0%,100% { transform: translateY(0);   }
      50%      { transform: translateY(-16px); }
    }
    .hero-visual img {
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      width: 100%;
    }
    .hero-card {
      position: absolute;
      background: rgba(255,255,255,.95);
      backdrop-filter: blur(12px);
      border-radius: var(--radius);
      padding: 14px 18px;
      box-shadow: var(--shadow-md);
      display: flex; align-items: center; gap: 12px;
      font-size: 0.88rem; font-weight: 600;
      color: var(--text-dark);
      white-space: nowrap;
    }
    .hero-card .icon { font-size: 1.6rem; }
    .hero-card .label { font-size: 0.72rem; color: var(--text-muted); font-weight: 400; }
    .hero-card-1 { top: -18px; right: -18px; }
    .hero-card-2 { bottom: 28px; left: -24px; }

    /* ============================================================
       CLIENTS / PARTNERS STRIP  (opsional, bisa dihapus)
    ============================================================ */
    #clients {
      padding: 48px 0;
      background: var(--bg-light);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .clients-label {
      text-align: center;
      font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase;
      color: var(--text-muted); font-weight: 600;
      margin-bottom: 28px;
    }
    .clients-logos {
      display: flex; align-items: center; justify-content: center;
      gap: 48px; flex-wrap: wrap;
    }
    .client-logo {
      font-family: var(--font-heading);
      font-weight: 800; font-size: 1.1rem;
      color: var(--text-muted); letter-spacing: -0.02em;
      opacity: .55; transition: opacity var(--transition);
    }
    .client-logo:hover { opacity: 1; }

    /* ============================================================
       SERVICES
    ============================================================ */
    #services { background: var(--bg-white); }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
    }
    .service-card {
      background: var(--bg-white);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 36px 32px;
      transition: all var(--transition);
      position: relative; overflow: hidden;
    }
    .service-card::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--transition);
    }
    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-md);
      border-color: rgba(var(--primary-rgb), .3);
    }
    .service-card:hover::before { transform: scaleX(1); }
    .service-icon-wrap {
      width: 68px; height: 68px;
      background: rgba(var(--primary-rgb), .1);
      border-radius: var(--radius);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; margin-bottom: 22px;
      transition: background var(--transition);
    }
    .service-card:hover .service-icon-wrap {
      background: rgba(var(--primary-rgb), .18);
    }
    .service-card h3 { margin-bottom: 12px; font-size: 1.15rem; }
    .service-card p  { color: var(--text-muted); font-size: 0.95rem; }
    .service-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--primary); font-weight: 600; font-size: 0.88rem;
      margin-top: 18px;
      transition: gap var(--transition);
    }
    .service-card:hover .service-link { gap: 12px; }

    /* ============================================================
       ABOUT / WHY US
    ============================================================ */
    #about { background: var(--bg-light); }
    .about-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 80px; align-items: center;
    }
    .about-img-wrap { position: relative; }
    .about-img-wrap img {
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl); width: 100%;
    }
    .about-badge {
      position: absolute; bottom: -24px; right: -24px;
      background: var(--primary); color: #fff;
      border-radius: var(--radius-lg); padding: 22px 26px;
      text-align: center; box-shadow: var(--shadow-md);
    }
    .about-badge .big  { font-size: 2.2rem; font-weight: 900; display: block; line-height: 1; }
    .about-badge .small{ font-size: 0.78rem; opacity: .85; margin-top: 4px; }
    .about-content .section-label { display: inline-block; }
    .about-content h2  { margin-bottom: 18px; }
    .about-content > p { color: var(--text-muted); margin-bottom: 36px; }
    .feature-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
    .feature-item { display: flex; align-items: flex-start; gap: 16px; }
    .feature-item-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      background: rgba(var(--primary-rgb), .08);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      transition: background var(--transition);
    }
    .feature-item:hover .feature-item-icon { background: rgba(var(--primary-rgb), .16); }
    .feature-item h4   { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .feature-item p    { font-size: 0.9rem; color: var(--text-muted); }
    .stats-row {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 20px; padding-top: 36px;
      border-top: 1px solid var(--border);
      margin-top: 36px;
    }
    .stat-box { text-align: center; }
    .stat-box .num   { font-family: var(--font-heading); font-size: 2rem; font-weight: 900; color: var(--primary); }
    .stat-box .lbl   { font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; font-weight: 500; }

    /* ============================================================
       TESTIMONIALS
    ============================================================ */
    #testimonials { background: var(--bg-white); }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }
    .testi-card {
      background: var(--bg-light);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px;
      transition: all var(--transition);
    }
    .testi-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-md);
      border-color: rgba(var(--primary-rgb), .25);
    }
    .stars { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; margin-bottom: 18px; }
    .testi-text {
      color: var(--text-body);
      font-size: 0.97rem; font-style: italic; line-height: 1.85;
      margin-bottom: 24px;
    }
    .testi-text::before { content: '"'; font-size: 2rem; color: var(--primary); line-height: .8; vertical-align: middle; margin-right: 4px; }
    .testi-author { display: flex; align-items: center; gap: 14px; }
    .testi-avatar {
      width: 50px; height: 50px; border-radius: 50%; object-fit: cover;
      border: 3px solid rgba(var(--primary-rgb), .2);
    }
    .testi-name  { font-weight: 700; font-size: 0.95rem; margin-bottom: 2px; }
    .testi-role  { font-size: 0.8rem; color: var(--text-muted); }

    /* ============================================================
       FAQ
    ============================================================ */
    #faq { background: var(--bg-light); }
    .faq-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .faq-item {
      background: var(--bg-white);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 28px 32px;
      transition: all var(--transition);
      cursor: pointer;
    }
    .faq-item:hover {
      border-color: rgba(var(--primary-rgb), .4);
      box-shadow: var(--shadow-sm);
    }
    .faq-q {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
      font-weight: 700; font-size: 1rem; color: var(--text-dark);
      margin-bottom: 12px;
    }
    .faq-q .faq-icon { font-size: 1.1rem; flex-shrink: 0; color: var(--primary); }
    .faq-a { font-size: 0.93rem; color: var(--text-muted); line-height: 1.8; }

    /* ============================================================
       CONTACT / CTA
    ============================================================ */
    #contact {
      background: [CTA_GRADIENT];  /* e.g. linear-gradient(135deg, var(--primary-dark), var(--primary)) */
      position: relative; overflow: hidden;
    }
    #contact::before {
      content: ''; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
    }
    .cta-top {
      text-align: center; max-width: 700px; margin: 0 auto 64px;
      color: #fff; position: relative; z-index: 1;
    }
    .cta-top h2   { color: #fff; margin-bottom: 16px; }
    .cta-top p    { color: rgba(255,255,255,.8); font-size: 1.1rem; margin-bottom: 36px; }
    .contact-box {
      display: grid; grid-template-columns: 1fr 1.2fr; gap: 0;
      background: #fff; border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden; position: relative; z-index: 1;
    }
    /* Info pane */
    .contact-info-pane {
      background: var(--bg-soft);
      padding: 48px 40px;
      display: flex; flex-direction: column;
    }
    .contact-info-pane h3  { font-size: 1.35rem; margin-bottom: 10px; }
    .contact-info-pane > p { color: var(--text-muted); margin-bottom: 36px; font-size: 0.93rem; }
    .c-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; }
    .c-icon {
      width: 46px; height: 46px; border-radius: 12px;
      background: rgba(var(--primary-rgb), .1);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; flex-shrink: 0;
    }
    .c-item h4   { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 600; margin-bottom: 3px; }
    .c-item p    { font-weight: 600; font-size: 0.95rem; color: var(--text-dark); }
    .social-row  { display: flex; gap: 10px; margin-top: auto; padding-top: 32px; }
    .soc-btn {
      width: 42px; height: 42px;
      border-radius: 10px; background: var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.05rem; color: var(--text-muted);
      transition: all var(--transition);
    }
    .soc-btn:hover { background: var(--primary); color: #fff; transform: translateY(-3px); }
    /* Form pane */
    .contact-form-pane { padding: 48px 44px; }
    .contact-form-pane h3 { margin-bottom: 28px; }
    .form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .fg { margin-bottom: 18px; }
    .fg label {
      display: block; font-size: 0.85rem; font-weight: 600;
      margin-bottom: 7px; color: var(--text-dark);
    }
    .fg input, .fg textarea, .fg select {
      width: 100%; padding: 13px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-family: var(--font-body); font-size: 0.97rem;
      color: var(--text-dark); background: var(--bg-white);
      transition: all var(--transition);
    }
    .fg input:focus, .fg textarea:focus, .fg select:focus {
      outline: none; border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb), .1);
    }
    .fg textarea { min-height: 110px; resize: vertical; }
    .fg select    { appearance: none; cursor: pointer; }
    .form-submit .btn { width: 100%; justify-content: center; padding: 16px; }

    /* ============================================================
       FOOTER
    ============================================================ */
    footer {
      background: var(--text-dark); color: rgba(255,255,255,.75);
      padding: 72px 0 0;
    }
    .footer-grid {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px; max-width: 1200px; margin: 0 auto; padding: 0 24px;
    }
    .footer-brand .nav-logo { color: #fff; margin-bottom: 16px; }
    .footer-brand p { font-size: 0.88rem; line-height: 1.8; margin-bottom: 24px; }
    .footer-col h4 {
      font-family: var(--font-heading);
      font-size: 0.78rem; text-transform: uppercase;
      letter-spacing: 2px; color: rgba(255,255,255,.4);
      margin-bottom: 20px;
    }
    .footer-col li + li { margin-top: 12px; }
    .footer-col a {
      font-size: 0.88rem; color: rgba(255,255,255,.65);
      transition: color var(--transition);
    }
    .footer-col a:hover { color: #fff; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,.08);
      margin-top: 56px; padding: 24px;
      text-align: center;
      font-size: 0.83rem; color: rgba(255,255,255,.4);
    }

    /* ============================================================
       FLOATING WHATSAPP
    ============================================================ */
    .wa-float {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      display: flex; align-items: center; gap: 10px;
      background: #25D366; color: #fff;
      padding: 14px 22px; border-radius: 50px;
      font-weight: 700; font-size: 0.9rem;
      box-shadow: 0 6px 28px rgba(37,211,102,.45);
      transition: all var(--transition);
      border: none; cursor: pointer;
    }
    .wa-float:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(37,211,102,.55); }
    .wa-float .wa-ico { font-size: 1.4rem; }

    /* ============================================================
       SCROLL REVEAL
    ============================================================ */
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: .1s; }
    .reveal-delay-2 { transition-delay: .2s; }
    .reveal-delay-3 { transition-delay: .3s; }

    /* ============================================================
       RESPONSIVE
    ============================================================ */
    @media (max-width: 1024px) {
      .hero-inner   { grid-template-columns: 1fr; }
      .hero-visual  { display: none; }
      .about-grid   { grid-template-columns: 1fr; }
      .contact-box  { grid-template-columns: 1fr; }
      .footer-grid  { grid-template-columns: 1fr 1fr; gap: 36px; }
    }
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      h1 { font-size: 2.3rem; }
      .nav-links, .nav-actions { display: none; }
      .hamburger { display: flex; }
      .faq-grid   { grid-template-columns: 1fr; }
      .stats-row  { grid-template-columns: repeat(3,1fr); }
      .form-row2  { grid-template-columns: 1fr; }
      .footer-grid{ grid-template-columns: 1fr; }
      .about-badge{ right: 0; bottom: -16px; }
    }
    @media (max-width: 480px) {
      .hero-cta { flex-direction: column; }
      .hero-cta .btn { width: 100%; justify-content: center; }
      .stats-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<!-- ======================= NAVBAR ======================= -->
<header id="navbar">
  <nav>
    <a href="#" class="nav-logo">
      <div class="logo-icon">[IKON_EMOJI]</div>
      [NAMA BRAND]
    </a>
    <div class="nav-links">
      <a href="#services">Layanan</a>
      <a href="#about">Tentang</a>
      <a href="#testimonials">Testimoni</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Kontak</a>
    </div>
    <div class="nav-actions">
      <a href="#contact" class="btn btn-primary">[CTA_NAVBAR]</a>
    </div>
    <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div id="mobile-menu">
    <a href="#services"      onclick="toggleMobileMenu()">Layanan</a>
    <a href="#about"         onclick="toggleMobileMenu()">Tentang</a>
    <a href="#testimonials"  onclick="toggleMobileMenu()">Testimoni</a>
    <a href="#faq"           onclick="toggleMobileMenu()">FAQ</a>
    <a href="#contact"       onclick="toggleMobileMenu()">Kontak</a>
    <a href="#contact" class="btn btn-primary" onclick="toggleMobileMenu()">[CTA_NAVBAR]</a>
  </div>
</header>

<!-- ======================= HERO ======================= -->
<section id="hero">
  <div class="hero-inner">
    <div class="hero-content">
      <div class="hero-badge">
        <span class="dot"></span>
        [BADGE_TEXT]
      </div>
      <h1 class="hero-title">[HEADLINE_UTAMA] <span>[HEADLINE_HIGHLIGHT]</span></h1>
      <p class="hero-desc">[SUBHEADLINE_2_3_KALIMAT]</p>
      <div class="hero-cta">
        <a href="#contact" class="btn btn-primary">[CTA_UTAMA]</a>
        <a href="#services" class="btn btn-outline" style="color:#fff;border-color:rgba(255,255,255,.5);">[CTA_SEKUNDER]</a>
      </div>
      <div class="hero-trust">
        <div class="avatar-stack">
          <img src="https://picsum.photos/38/38?random=1" alt="pelanggan">
          <img src="https://picsum.photos/38/38?random=2" alt="pelanggan">
          <img src="https://picsum.photos/38/38?random=3" alt="pelanggan">
          <img src="https://picsum.photos/38/38?random=4" alt="pelanggan">
        </div>
        <div class="hero-trust-text"><strong>[JUMLAH_PELANGGAN]+ pelanggan</strong> telah mempercayai kami</div>
      </div>
    </div>
    <div class="hero-visual">
      <img src="https://picsum.photos/580/460?random=10" alt="[BRAND]">
      <div class="hero-card hero-card-1">
        <span class="icon">[IKON_CARD_1]</span>
        <div>
          <div class="label">[LABEL_CARD_1]</div>
          <div>[VALUE_CARD_1]</div>
        </div>
      </div>
      <div class="hero-card hero-card-2">
        <span class="icon">[IKON_CARD_2]</span>
        <div>
          <div class="label">[LABEL_CARD_2]</div>
          <div>[VALUE_CARD_2]</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================= CLIENTS (opsional) ======================= -->
<section id="clients">
  <div class="container">
    <p class="clients-label">Dipercaya oleh berbagai [institusi/bisnis/klien]</p>
    <div class="clients-logos">
      <div class="client-logo">[NAMA KLIEN 1]</div>
      <div class="client-logo">[NAMA KLIEN 2]</div>
      <div class="client-logo">[NAMA KLIEN 3]</div>
      <div class="client-logo">[NAMA KLIEN 4]</div>
      <div class="client-logo">[NAMA KLIEN 5]</div>
    </div>
  </div>
</section>

<!-- ======================= SERVICES ======================= -->
<section id="services">
  <div class="container">
    <div class="section-header reveal">
      <div class="section-label">[LABEL_SERVICES]</div>
      <h2>[JUDUL_SERVICES]</h2>
      <p>[DESKRIPSI_SERVICES]</p>
    </div>
    <div class="services-grid">

      <div class="service-card reveal reveal-delay-1">
        <div class="service-icon-wrap">[IKON_1]</div>
        <h3>[NAMA_LAYANAN_1]</h3>
        <p>[DESKRIPSI_LAYANAN_1]</p>
        <a href="#contact" class="service-link">Selengkapnya →</a>
      </div>

      <div class="service-card reveal reveal-delay-2">
        <div class="service-icon-wrap">[IKON_2]</div>
        <h3>[NAMA_LAYANAN_2]</h3>
        <p>[DESKRIPSI_LAYANAN_2]</p>
        <a href="#contact" class="service-link">Selengkapnya →</a>
      </div>

      <div class="service-card reveal reveal-delay-3">
        <div class="service-icon-wrap">[IKON_3]</div>
        <h3>[NAMA_LAYANAN_3]</h3>
        <p>[DESKRIPSI_LAYANAN_3]</p>
        <a href="#contact" class="service-link">Selengkapnya →</a>
      </div>

      <!-- tambah card sesuai kebutuhan -->
    </div>
  </div>
</section>

<!-- ======================= ABOUT ======================= -->
<section id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-img-wrap reveal">
        <img src="https://picsum.photos/560/480?random=20" alt="[BRAND]">
        <div class="about-badge">
          <span class="big">[ANGKA]+</span>
          <span class="small">[KETERANGAN_ANGKA]</span>
        </div>
      </div>
      <div class="about-content reveal reveal-delay-1">
        <div class="section-label">[LABEL_ABOUT]</div>
        <h2>[JUDUL_ABOUT]</h2>
        <p>[PARAGRAF_ABOUT]</p>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-item-icon">[IKON_F1]</div>
            <div>
              <h4>[KEUNGGULAN_1]</h4>
              <p>[DESKRIPSI_KEUNGGULAN_1]</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item-icon">[IKON_F2]</div>
            <div>
              <h4>[KEUNGGULAN_2]</h4>
              <p>[DESKRIPSI_KEUNGGULAN_2]</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item-icon">[IKON_F3]</div>
            <div>
              <h4>[KEUNGGULAN_3]</h4>
              <p>[DESKRIPSI_KEUNGGULAN_3]</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item-icon">[IKON_F4]</div>
            <div>
              <h4>[KEUNGGULAN_4]</h4>
              <p>[DESKRIPSI_KEUNGGULAN_4]</p>
            </div>
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-box"><div class="num">[STAT1]+</div><div class="lbl">[LBL1]</div></div>
          <div class="stat-box"><div class="num">[STAT2]%</div><div class="lbl">[LBL2]</div></div>
          <div class="stat-box"><div class="num">[STAT3]+</div><div class="lbl">[LBL3]</div></div>
        </div>
        <a href="#contact" class="btn btn-primary" style="margin-top:36px;">[CTA_ABOUT]</a>
      </div>
    </div>
  </div>
</section>

<!-- ======================= TESTIMONIALS ======================= -->
<section id="testimonials">
  <div class="container">
    <div class="section-header reveal">
      <div class="section-label">TESTIMONI</div>
      <h2>Apa Kata Pelanggan Kami?</h2>
      <p>[DESKRIPSI_TESTIMONI]</p>
    </div>
    <div class="testimonials-grid">

      <div class="testi-card reveal reveal-delay-1">
        <div class="stars">★★★★★</div>
        <p class="testi-text">[TESTIMONI_1]</p>
        <div class="testi-author">
          <img src="https://picsum.photos/50/50?random=30" alt="customer" class="testi-avatar">
          <div>
            <div class="testi-name">[NAMA_1]</div>
            <div class="testi-role">[JABATAN_KOTA_1]</div>
          </div>
        </div>
      </div>

      <div class="testi-card reveal reveal-delay-2">
        <div class="stars">★★★★★</div>
        <p class="testi-text">[TESTIMONI_2]</p>
        <div class="testi-author">
          <img src="https://picsum.photos/50/50?random=31" alt="customer" class="testi-avatar">
          <div>
            <div class="testi-name">[NAMA_2]</div>
            <div class="testi-role">[JABATAN_KOTA_2]</div>
          </div>
        </div>
      </div>

      <div class="testi-card reveal reveal-delay-3">
        <div class="stars">★★★★★</div>
        <p class="testi-text">[TESTIMONI_3]</p>
        <div class="testi-author">
          <img src="https://picsum.photos/50/50?random=32" alt="customer" class="testi-avatar">
          <div>
            <div class="testi-name">[NAMA_3]</div>
            <div class="testi-role">[JABATAN_KOTA_3]</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================= FAQ ======================= -->
<section id="faq">
  <div class="container">
    <div class="section-header reveal">
      <div class="section-label">FAQ</div>
      <h2>Pertanyaan yang Sering Ditanyakan</h2>
      <p>[DESKRIPSI_FAQ]</p>
    </div>
    <div class="faq-grid">
      <div class="faq-item reveal reveal-delay-1">
        <div class="faq-q"><span>[PERTANYAAN_1?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_1]</p>
      </div>
      <div class="faq-item reveal reveal-delay-2">
        <div class="faq-q"><span>[PERTANYAAN_2?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_2]</p>
      </div>
      <div class="faq-item reveal reveal-delay-3">
        <div class="faq-q"><span>[PERTANYAAN_3?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_3]</p>
      </div>
      <div class="faq-item reveal">
        <div class="faq-q"><span>[PERTANYAAN_4?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_4]</p>
      </div>
      <div class="faq-item reveal reveal-delay-1">
        <div class="faq-q"><span>[PERTANYAAN_5?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_5]</p>
      </div>
      <div class="faq-item reveal reveal-delay-2">
        <div class="faq-q"><span>[PERTANYAAN_6?]</span><span class="faq-icon">❓</span></div>
        <p class="faq-a">[JAWABAN_6]</p>
      </div>
    </div>
  </div>
</section>

<!-- ======================= CONTACT / CTA ======================= -->
<section id="contact">
  <div class="container">
    <div class="cta-top reveal">
      <h2>[HEADLINE_CTA]</h2>
      <p>[SUBHEADLINE_CTA]</p>
      <a href="https://wa.me/628[NOMOR_WA]" target="_blank" class="btn btn-white">💬 Chat WhatsApp Sekarang</a>
    </div>
    <div class="contact-box reveal">
      <!-- INFO -->
      <div class="contact-info-pane">
        <h3>Informasi Kontak</h3>
        <p>[DESKRIPSI_KONTAK]</p>
        <div class="c-item">
          <div class="c-icon">📍</div>
          <div><h4>Alamat</h4><p>[ALAMAT_LENGKAP]</p></div>
        </div>
        <div class="c-item">
          <div class="c-icon">📞</div>
          <div><h4>Telepon / WhatsApp</h4><p>[NOMOR_TELEPON]</p></div>
        </div>
        <div class="c-item">
          <div class="c-icon">✉️</div>
          <div><h4>Email</h4><p>[EMAIL]</p></div>
        </div>
        <div class="c-item">
          <div class="c-icon">🕐</div>
          <div><h4>Jam Operasional</h4><p>[JAM_OPERASIONAL]</p></div>
        </div>
        <div class="social-row">
          <a href="#" class="soc-btn">📘</a>
          <a href="#" class="soc-btn">📷</a>
          <a href="#" class="soc-btn">▶️</a>
          <a href="#" class="soc-btn">🐦</a>
        </div>
      </div>
      <!-- FORM -->
      <div class="contact-form-pane">
        <h3>Kirim Pesan</h3>
        <form onsubmit="handleSubmit(event)">
          <div class="form-row2">
            <div class="fg">
              <label>Nama Lengkap *</label>
              <input type="text" placeholder="Nama Anda" required>
            </div>
            <div class="fg">
              <label>No. WhatsApp *</label>
              <input type="tel" placeholder="08xx-xxxx-xxxx" required>
            </div>
          </div>
          <div class="fg">
            <label>Email</label>
            <input type="email" placeholder="email@contoh.com">
          </div>
          <div class="fg">
            <label>Layanan yang Diminati</label>
            <select>
              <option value="">— Pilih Layanan —</option>
              <option>[OPSI_LAYANAN_1]</option>
              <option>[OPSI_LAYANAN_2]</option>
              <option>[OPSI_LAYANAN_3]</option>
            </select>
          </div>
          <div class="fg">
            <label>Pesan</label>
            <textarea placeholder="[PLACEHOLDER_PESAN]"></textarea>
          </div>
          <div class="form-submit">
            <button type="submit" class="btn btn-primary">📤 Kirim Pesan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- ======================= FOOTER ======================= -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="nav-logo">
        <div class="logo-icon">[IKON_EMOJI]</div> [NAMA BRAND]
      </div>
      <p>[DESKRIPSI_BRAND_FOOTER]</p>
      <div class="social-row">
        <a href="#" class="soc-btn">📘</a>
        <a href="#" class="soc-btn">📷</a>
        <a href="#" class="soc-btn">▶️</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>LAYANAN</h4>
      <ul>
        <li><a href="#services">[LAYANAN_FOOTER_1]</a></li>
        <li><a href="#services">[LAYANAN_FOOTER_2]</a></li>
        <li><a href="#services">[LAYANAN_FOOTER_3]</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>PERUSAHAAN</h4>
      <ul>
        <li><a href="#about">Tentang Kami</a></li>
        <li><a href="#testimonials">Testimoni</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>KONTAK</h4>
      <ul>
        <li><a href="#">[ALAMAT_SINGKAT]</a></li>
        <li><a href="#">[NOMOR_TELEPON]</a></li>
        <li><a href="#">[EMAIL]</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 [NAMA BRAND]. Semua hak cipta dilindungi. Dibuat dengan ❤️</p>
  </div>
</footer>

<!-- ======================= FLOATING WA ======================= -->
<a href="https://wa.me/628[NOMOR_WA]" target="_blank" class="wa-float">
  <span class="wa-ico">💬</span>
  <span>Chat Kami</span>
</a>

<script>
  /* --- Navbar scroll effect --- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* --- Mobile menu --- */
  function toggleMobileMenu() {
    const m = document.getElementById('mobile-menu');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
  }

  /* --- Form submit --- */
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Pesan Terkirim!';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; e.target.reset(); }, 3500);
  }

  /* --- Scroll reveal --- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
</script>
</body>
</html>`;

const SYSTEM_PROMPT = `
Kamu adalah expert UI/UX engineer dan copywriter Indonesia. Tugasmu membuat landing page HTML premium untuk bisnis/institusi Indonesia.

WAJIB IKUTI SKELETON BERIKUT — jangan ubah struktur class/id CSS, hanya GANTI semua [PLACEHOLDER] dengan konten nyata:

${SKELETON}

═══════════════════════════════════════════════════════
INSTRUKSI PENGISIAN PLACEHOLDER
═══════════════════════════════════════════════════════

1. WARNA & TEMA
   • Pilih palet warna yang sesuai konteks bisnis:
     - Pendidikan / formal      → biru tua / navy (#1e3a8a, #1d4ed8) atau hijau tua (#065f46)
     - Kesehatan / klinik       → teal (#0d9488) atau biru langit (#0284c7)
     - Kuliner / F&B            → oranye (#ea580c) atau merah (#dc2626)
     - Kecantikan / salon       → rose gold (#e11d48) atau dusty rose (#be185d)
     - Teknologi / startup      → ungu (#7c3aed) atau biru gelap (#1e40af)
     - Properti / konstruksi    → slate (#475569) atau amber (#b45309)
     - Ritel / fashion          → hitam elegan (#111827) atau sage green (#4d7c0f)
     - UMKM umum                → sesuaikan dengan karakter produk
   • Isi --primary-rgb dengan nilai R, G, B terpisah koma (misal: 30, 58, 138)
   • --primary-dark  = warna lebih gelap ~15% dari primary
   • --primary-light = warna sangat muda (opacity ~5-10%)
   • --secondary & --accent = warna komplementer yang harmonis

2. FONT (Google Fonts)
   • Heading: pilih yang berkarakter kuat (Poppins, Raleway, Montserrat, Playfair Display, Plus Jakarta Sans, Sora, Lexend)
   • Body: pilih yang readable (Inter, Lato, Nunito, DM Sans, Outfit, Figtree)
   • Ganti SEMUA kemunculan [FONT_HEADING] dan [FONT_BODY] secara konsisten

3. HERO GRADIENT
   • [HERO_GRADIENT] → linear/radial gradient gelap yang sesuai brand
     Contoh: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
   • [CTA_GRADIENT] → gradient serupa atau lebih terang untuk section contact

4. KONTEN — buat realistis, spesifik, dan persuasif:
   • Nama brand, tagline, headline: catchy dan problem-solving
   • Sub-headline: jelaskan value proposition dalam 2-3 kalimat
   • Layanan: minimal 3, maksimal 6, sesuai konteks bisnis
   • Keunggulan: 4 poin yang benar-benar membedakan dari kompetitor
   • Statistik: angka realistis (misal: 500+ pelanggan, 98% kepuasan, 5+ tahun)
   • Testimoni: 3 testimoni spesifik dengan nama & jabatan Indonesia yang realistis
   • FAQ: 6 pertanyaan paling sering ditanya tentang bisnis tersebut
   • Kontak: nomor WA fiktif tapi format valid (628xxxx), email domain brand, alamat kota

5. GAMBAR
   • Gunakan https://picsum.photos/[lebar]/[tinggi]?random=[angka_unik]
   • Pastikan angka random berbeda untuk setiap gambar
   • Sesuaikan ukuran dengan konteks penggunaan

6. EMOJI IKON
   • Pilih emoji yang benar-benar relevan dengan layanan/bisnis
   • Gunakan konsisten di seluruh halaman

7. SECTION CLIENTS (opsional)
   • Jika bisnis B2B atau punya mitra terkenal → tampilkan nama klien/mitra
   • Jika bisnis B2C / UMKM baru → hapus seluruh section #clients

═══════════════════════════════════════════════════════
OUTPUT RULES — SANGAT PENTING
═══════════════════════════════════════════════════════
• Return HANYA kode HTML mentah — mulai tepat dengan <!DOCTYPE html>
• JANGAN ada penjelasan, komentar, markdown, atau code block
• JANGAN gunakan triple backtick
• SEMUA [PLACEHOLDER] HARUS diganti — tidak boleh ada satu pun yang tersisa
• max_tokens diset ke 8000 — manfaatkan penuh untuk konten yang kaya
`.trim();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateLandingPage(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 8000,
    temperature: 0.75,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Buatkan landing page premium untuk: ${prompt}`,
      },
    ],
  });

  const raw: string = completion.choices[0]?.message?.content ?? "";

  // Strip markdown code block jika model tidak patuh
  return raw
    .replace(/^```html?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();
}
