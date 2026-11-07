# PROJECT PAGLU – THE UNIVERSE

> *One universe. A million little memories. One special person.*

An interactive, dark-cosmic-fantasy 3D web experience created for **Paglu**—blending the atmosphere of an AAA sci-fi/fantasy adventure, an interactive 3D galaxy, playable cosmic mini-games, a friendship museum, mood letters, a moonlit dreamscape, and an unlockable grand finale.

---

## 1. Technology Stack

- **React 18 + Vite 5** (JavaScript ES Modules)
- **Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`** for the interactive 3D solar system, procedural planetary surfaces, spiral nebula particle cloud, atmospheric halos, and orbital controls
- **GSAP** for cinematic intro sequencing and smooth 3D camera warp transitions
- **Framer Motion** for glassmorphism UI transitions, modals, envelopes, and typography choreography
- **Lucide React** for crisp cosmic iconography
- **Web Audio API + HTML5 Audio** for interactive cosmic sound effects and crossfading ambient soundtracks (strictly respecting user-interaction autoplay rules)

---

## 2. Quick Start (Local Development & Production Build)

### Prerequisites
- **Node.js 18+** (Node 20 LTS recommended) and **npm 9+**

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open the local URL printed in your terminal (default: `http://localhost:5173`).

### Build for Production
```bash
npm run build
```
This outputs a minified, code-split production bundle inside `dist/`.

### Preview Production Build Locally
```bash
npm run preview
```

---

## 3. Personalising the Entire Universe (`src/config/pagluConfig.js`)

You do **not** need to hunt through components to personalise text, photos, puzzles, quiz questions, letters, or music. Everything lives in one central file:

```
src/config/pagluConfig.js
```

### Replacing Placeholder Photographs & Audio
1. Drop your real `.jpg`, `.png`, or `.webp` photos into `public/images/memories/`.
2. Update the `src` paths inside `memoryPlanet.photoGallery` and `memoryPlanet.memoryCards` in `src/config/pagluConfig.js` (e.g. `'./images/memories/our-photo-1.jpg'`).
3. Optional: Drop your favourite `.mp3` or `.wav` tracks into `public/audio/` and update `music.tracks.galaxy.src` and `music.tracks.final.src` in `src/config/pagluConfig.js`.

> **Important Note on the Secret Gate (`2023`):**
> The password screen is a playful front-end surprise gate stored in `sessionStorage` for UX convenience—it is **not** cryptographic security. Never store sensitive personal data, private keys, or real credentials in frontend code.

---

## 4. Universe Walkthrough & Puzzle Keys

- **Secret Gate Password:** `2023`
- **Planet 1 — Memory Planet:** Featured photo showcase, full-screen Lightbox, interactive 2023+ Friendship Timeline, and Scrapbook Memory Cards.
- **Planet 2 — Mystery Planet (Unlocks Final Destination):**
  - *Level 1 Riddle Answer:* **A cherished memory**
  - *Level 2 Hidden Constellation Scanner:* Scan the starfield and tap **`P → A → G → L → U`**
  - *Level 3 Final Celestial Code:* **`6371`** (*6 planets, 3 mini-games, 7 envelopes, 1 special person*)
  - Completing Level 3 opens the **Secret Sanctuary** and awakens **Planet 6: Final Destination**.
- **Planet 3 — Fun Planet:**
  1. *How Well Do You Know Me?* (15 editable questions)
  2. *Catch The Stars* (45s arcade game with 3 escalating difficulty waves)
  3. *The Lucky Wheel* (Compliments, Funny Challenges, Secret Messages, Memory Prompts, Random Surprises)
- **Planet 4 — Letters Planet:** 7 sealed *"Open when..."* envelopes with floating hearts and personalisable letters.
- **Planet 5 — Dream Planet:** Animated moon, drifting nebula clouds, shooting stars, *"Things I Hope Life Gives You."* wish cards, and an interactive wish launcher.
- **Planet 6 — Final Destination:** Magical singularity portal, fade to darkness, rising starlight embers, cosmic fireworks, animated typography, and the final personal letter.

---

## 5. Deployment Instructions

### Option A: Deploy to Vercel (Zero Configuration)
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Framework Preset: **Vite** | Build Command: `npm run build` | Output Directory: `dist`.
4. Click **Deploy** (`vercel.json` is already included).

### Option B: Deploy to GitHub Pages
`vite.config.js` is pre-configured with `base: process.env.VITE_BASE_PATH || './'`, and `.github/workflows/deploy.yml` is ready out of the box:
1. Push this project to the `main` branch of a GitHub repository.
2. In your GitHub repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) automatically installs dependencies, runs `npm run build`, and publishes `dist/` to GitHub Pages!
   - *(If deploying manually to a subpath like `https://username.github.io/project-paglu/`, you can also run `VITE_BASE_PATH=/project-paglu/ npm run build`.)*
