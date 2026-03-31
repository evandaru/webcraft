# WebCraft — AI Landing Page Builder

> *Describe it. Build it. Launch it.*

WebCraft adalah SaaS landing page builder berbasis AI. User ketik prompt, AI generate landing page HTML lengkap yang siap dipakai.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS + shadcn/ui** (dark mode default)
- **SQLite + Drizzle ORM**
- **NextAuth.js v5** (Credentials)
- **Anthropic Claude API**
- **Zod** (validasi)

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/evandaru/webcraft.git
cd webcraft
npm install

# 2. Setup environment
cp .env.example .env.local
# Isi NEXTAUTH_SECRET dan ANTHROPIC_API_KEY

# 3. Buat & migrate database
npx drizzle-kit push

# 4. Seed data (admin + demo user)
npm run db:seed

# 5. Jalankan
npm run dev
```

Buka http://localhost:3000

## Akun Default

| Email | Password | Role | Plan |
|---|---|---|---|
| admin@webcraft.id | admin123 | admin | premium |
| demo@webcraft.id | demo123 | member | free |

## Struktur Project

```
src/
├── app/
│   ├── (public)/          # Landing page, pricing, login, register
│   ├── (dashboard)/       # Dashboard, generate, projects
│   ├── (admin)/           # Admin panel
│   ├── api/               # API routes
│   └── p/[slug]/          # Published landing pages
├── components/
│   ├── ui/                # shadcn UI components
│   ├── landing/           # Landing page sections
│   ├── dashboard/         # Dashboard components
│   └── shared/            # Shared components
└── lib/
    ├── db/                # Drizzle schema & connection
    ├── auth.ts            # NextAuth config
    ├── ai.ts              # Claude API wrapper
    └── plan.ts            # Plan limits & helpers
```

## Plan System

| Plan | Harga | Generate/Bulan |
|---|---|---|
| Free | Rp 0 | 1x |
| Lite | Rp 49.000 | 5x |
| Premium | Rp 149.000 | 30x |
