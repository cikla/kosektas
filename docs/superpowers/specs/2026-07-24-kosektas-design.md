# e-Köşektaş Portal Design Specification

This document details the design and implementation plan for the **e-Köşektaş Kütük ve Yüksek Cemiyet Portalı** static website. The website is a humorous gift for a friend who married and moved their civil registry (kütük) to Köşektaş village in Nevşehir (Hacıbektaş).

---

## 1. Overview & Conceptual Themes
The application merges two distinct visual and thematic directions:
1. **The Bureaucratic Portal (e-Devlet Style):** The initial login/registration state. Clean, white/red/grey color palette, official banners, standard typography, and mock legal warnings.
2. **The Anatolian Bektashi Sanctuary:** The dashboard state. Dark mode, deep crimson (`#8B0000`), warm amber (`#FFBF00`), charcoal (`#121212`), gold accents, scroll-reveals, traditional Turkish geometric motifs, and a programmatically synthesized saz/bağlama melody.

---

## 2. Technical Stack
- **Structure:** Single Page Application (SPA) structured in a single `index.html` file to maintain a zero-dependency static site.
- **Styling:** Modern Vanilla CSS inside `style.css`. Key styling concepts:
  - Custom CSS variables for theme switching.
  - Backdrop filters (glassmorphism) for dashboard elements.
  - Dynamic responsive layout (flexbox/grid).
  - Modern animations (`@starting-style` for modals, CSS keyframes for transition).
- **Behavior & Logic:** Vanilla ES6 JavaScript inside `app.js`.
  - Programmatic synthesizer using **Web Audio API** (simulating bağlama string plucks using Karpus-Strong algorithm or additive synthesis).
  - Predefined JSON user database inside `app.js` with local registration syncing to `localStorage`.
  - Dynamic title generation ("Köşektaş'ın Enleri") using a simple hashing function on the user's name.
  - Interactive canvas-based official "Cemiyet Şahadetnamesi" generator for download.

---

## 3. Detailed Features & Components

### A. Authentication & Registry System
- **JSON User DB:**
  ```javascript
  const PRESET_USERS = [
    { name: "Can Köşektaşlı", tcPrefix: "ABC", title: "Köşektaş'ın En Asili" },
    { name: "Mert Ciklabakkal", tcPrefix: "EVL", title: "Köşektaş'ın En Alaveisi (Yüce Hami)" },
    { name: "Taze Damat", tcPrefix: "EVL", title: "Köşektaş'ın En Ala Damadı" }
  ];
  ```
- **Login Matching:** Matches input Name & Surname and the first 3 letters of the TC Identification Number. (A tooltip explains that for state secrecy, letters like `EVL`, `ABC`, `TCK` are required instead of digits).
- **Register Tab:** Allows creating a new profile. Appends the user to `localStorage`.

### B. User Dashboard (The Sanctuary)
Once authorized, the layout fades into the Alevi-Anatolian sanctuary.
- **Official Certificate (Şahadetname) Canvas:**
  - Standard template drawn dynamically on a `<canvas>` element (traditional border, official seal of Nevşehir Hacıbektaş Köşektaş Muhtarlığı, gold text "KÜTÜK TESCİL BELGESİ").
  - Includes a download button (`Download Certificate (PDF/PNG)`).
- **The "Enleri" Generator:**
  - Displays the user's unique Köşektaş title: "Köşektaş'ın [En]..."
- **Web Audio Saz Synth:**
  - A play/pause audio controller.
  - Programmatic synth: Simulates acoustic pluck notes using an oscillator combined with an exponential gain decay and a low-pass filter (plucked string simulation). It will loop a simple traditional Turkish folk melody (e.g. *Uzun İnce Bir Yoldayım* or a classic Bektashi Nefes melody like *Haydar Haydar*).
- **The 12 Rules of Köşektaş (İyi Bir Köşektaşlı Olmanın 12 Altın Kuralı):**
  - Accordion style using native `<details>` and `<summary>` elements.
  - Rules include humorous Anatolian village traditions, potato appreciation, and Bektashi philosophy.

---

## 4. Verification Plan
### Manual Verification
- Test registration, local storage saving, and login using correct and incorrect "TC letters".
- Test canvas generation across Chrome, Safari, and Firefox.
- Test Web Audio API execution (ensure user interaction triggers audio to comply with browser autoplay policies).
- Verify styling responsiveness on mobile devices.
