# Gabe US Incorporated — Website Project

> **For Claude sessions picking up this project:** read this whole file first,
> then `ls` the folder to see what's there. All design decisions are locked in.
> Do not suggest re-architecting unless the owner explicitly asks.

## What this is

Marketing website for **Gabe US Incorporated** — an FDA-registered, cGMP-compliant
gummy contract manufacturer based in Lorton, Virginia. B2B lead generation site:
the goal is to get emerging supplement brands / retailers / Amazon sellers to
submit the contact form for a quote.

**Owner email:** jason@bigboxretailer.com
**Company email:** contact@gabeus.com
**Address:** 7951 Angleton Ct Ste 1A, Lorton, VA 22079
**Production URL:** https://gabeus.com (deployed via Netlify)

## Tech stack

Pure static HTML + CSS + minimal vanilla JS. **No build step.** No framework.
No npm. Anyone can edit any file directly and deploy by re-uploading.

- HTML per page (no templating engine — shared header/footer are copy-pasted)
- One shared stylesheet: `css/main.css`
- One JS file: `js/main.js` (brand animation + hero mouse parallax)
- Google Fonts: Plus Jakarta Sans (400/500/600/700/800)
- Hosting: Netlify (drag-and-drop deploys, Netlify Forms for contact form)

## File structure

```
gabeus/
├── index.html             Homepage — hero with scattered gummies + parallax
├── about.html             About, approach, quality, 4-step process
├── services.html          6 services + 7-step "How it works"
├── private-label.html     4 customer types + 7-step customization workflow
├── faq.html               22 FAQ items (2 sections, <details> accordion)
├── contact.html           Contact form + info cards (Netlify Forms enabled)
├── thank-you.html         Form submission success page
├── css/main.css           Single stylesheet (design tokens + components)
├── js/main.js             Brand animation, hero parallax (spring physics)
├── images/
│   ├── logo.png           Full red maple-leaf seal (512×512, transparent)
│   ├── logo-mark.png      Inner red disc with leaf only (320×320, for nav)
│   └── gummies/           15 photorealistic PNG gummies (600×600, transparent)
│       └── 2.png ~ 16.png
├── robots.txt             Allows all, disallows /thank-you.html
├── sitemap.xml            6 pages listed, uses https://gabeus.com/ as root
├── _headers               Netlify caching + security headers
└── PROJECT.md             This file
```

## Design system (locked in)

### Colors (CSS custom properties, defined in css/main.css `:root`)

| Purpose | Token | Hex |
|---|---|---|
| Brand red (CTAs, accents) | `--red` | `#E11D2E` |
| Dark red (hover) | `--red-dark` | `#B91525` |
| Text primary | `--ink` | `#1F2937` |
| Text muted | `--muted` | `#6B7280` |
| Background default | `--white` | `#FFFFFF` |
| Warm cream (hero + cream sections) | `--cream` | `#FDF6E6` |

Committed pastel section backgrounds (single-color blocks, NOT tints):
`--pink-2 #FFE8EC` / `--peach-2 #FFE7D0` / `--mint-2 #DFF3E5` /
`--butter-2 #FFF2B8` / `--lavender-2 #EEE2FF` / `--sky-2 #DCEBFF`

Each has a stronger sibling (`--pink` etc.) for pill chips and card icons.

### Typography

- **Font:** Plus Jakarta Sans (single family, multiple weights)
- **H1:** clamp(2.25rem, 5vw, 4.5rem), weight 800, letter-spacing -0.035em
- **H2:** clamp(1.75rem, 3.6vw, 3rem), weight 700
- **Body:** 1rem, line-height 1.65, weight 400
- **Eyebrow labels:** 0.8125rem, uppercase, letter-spacing 0.12em, red

### Key components (all in css/main.css)

- `.btn` — pill-shaped, rounded 999px. Variants: `--primary` (red), `--ghost` (white/border), `--light` (white text on dark)
- `.card` — 24px radius, soft shadow, lift-on-hover. Icon bg comes from `.card__icon--pink` etc.
- `.step` — process steps. 7 color variants via `.step--pink`/`--mint` etc.
- `.pill` — rounded chip for tags (trust bar, dietary options)
- `.hero__gummies` — absolutely positioned photo gummies with data-sx/sy for parallax
- `.split` — 2-column layout with visual + text (used for "Why Gabe US")
- `.faq-item` — uses native `<details>`/`<summary>` for accordion
- `.page-banner` — sub-page hero, color variants `--cream`/`--butter`/`--peach`/`--mint`

### Page banner colors (committed)

- About → `page-banner--cream`
- Services → `page-banner--peach`
- Private Label → `page-banner--butter` (signature warm yellow)
- FAQ → `page-banner--mint`
- Contact → `page-banner--cream`

## Animations

1. **Hero gummy parallax** (js/main.js, homepage only) — Spring physics with
   momentum. `STIFFNESS=0.04`, `DAMPING=0.90`, `AMPLITUDE=90px`. Each gummy has
   per-element `data-sx`/`data-sy` for scattered (non-uniform) motion.
   Respects `prefers-reduced-motion`.
2. **Logo stamp-in** (all pages) — Runs once on page load. JS adds `.popping`
   class, removes it when animation ends so it doesn't conflict with hover.
3. **Logo hover spin** — 360° rotation on `:hover`. JS toggles `.spinning`.
4. **Brand text rise** — text fades up on load.
5. **Gummy float** — subtle continuous up-and-down on scattered gummies.

## Mobile responsiveness

Breakpoints:
- `max-width: 1024px` — nav logo shrinks 80→64px, height 104→92px
- `max-width: 880px` — main tablet breakpoint. Nav collapses to hamburger,
  steps stack, cards grid reflows
- `max-width: 640px` — form rows stack
- `max-width: 560px` — footer stacks to single column, hero gummies reduced

Nav mobile uses `flex-wrap` on `.nav__inner` when `.is-open` so menu items flow
below the header (NOT absolute-positioned — that caused overlap bug earlier).

Touch targets: all buttons ≥44px, nav toggle has `min-width/min-height: 44px`.

## Deployment (current setup)

**Netlify** via drag-and-drop of the `gabeus/` folder:
1. app.netlify.com → Site → Deploys → drop folder
2. Form detection is enabled (Netlify auto-detects `<form data-netlify>`)
3. Contact form goes to Netlify Forms dashboard, configure email notifications to
   `contact@gabeus.com` in Forms → Settings & usage → Notifications.

### Future: recommend git-based deploys

Once pushed to GitHub, Netlify can auto-deploy on every push.
See `GITHUB_SETUP.md`.

## Content ownership / sources

Content is original prose written for this site (marketing copy synthesized from
several competitor sites the owner liked: vircgummies.com, hhprocessors.com,
gummyworlds.com, famehealthlabs.com). All gummy photos are owner-provided PNGs.
Logo is owner-provided.

## Known open items / TODOs

- **Sitemap URL:** `sitemap.xml` uses `https://gabeus.com/` — confirm that's the
  final production domain (it is, as of current deploy).
- **Social media:** Owner explicitly does NOT want FB/IG/X/LinkedIn links in
  footer. Do not add.
- **"Our Team" / Pricing pages:** Explicitly skipped. Do not rebuild.
- **Gummy images:** Optimized from 2048→600px PNG. If owner wants even smaller,
  could convert to WebP (~50% smaller) with PNG fallback via `<picture>`.
- **Analytics:** Not added. Owner hasn't mentioned preference. Options when
  needed: Plausible, Fathom, or simple Netlify Analytics.
- **Contact form thank-you:** `thank-you.html` exists and works. Form `action`
  points to `/thank-you.html`.

## Design decisions that were explicitly made

These came up in conversation and were decided — don't re-litigate:

- ✅ **Stay on Netlify** (not Webflow) — user switched from Webflow template.
- ✅ **Red + white + pastel** only. No navy, no gold-accent, no bright neon.
- ✅ **Plus Jakarta Sans** over Fraunces/Inter (user wanted softer rounded).
- ✅ **Photorealistic PNG gummies** over SVG shapes (user rejected SVG).
- ✅ **Committed single-color section backgrounds** over gradient mixes.
- ✅ **Logo: real PNG** over inline SVG approximation.
- ✅ **No fake testimonials / team members** — removed, don't add back.
- ✅ **Brand name only two forms:** "Gabe US" and "Gabe US Incorporated".
  Never "Gabe US Inc." or "Gabe US LLC".
- ✅ **No phone number** in footer/contact (user said so).

## How to work on this project efficiently

### Small tweaks (new Claude session)
Open new Claude Code session in `C:\Users\Jason L\Desktop\Claude\`, say:
> "Read gabeus/PROJECT.md then change X on Y page."

Claude reads this file, then the specific HTML/CSS file, makes the change.
Typical cost: a few cents.

### Big features
Same starting prompt. Describe the whole feature upfront so Claude can plan
before implementing.

### Preview locally
```bash
cd C:\Users\Jason L\Desktop\Claude\gabeus
python -m http.server 8900
```
Then open http://localhost:8900 in a browser.

### Deploy after changes
If connected to GitHub (see GITHUB_SETUP.md): `git push`, Netlify auto-deploys.
If still drag-and-drop: Netlify → Deploys → drag the folder again.
