# e-Köşektaş Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a highly polished, humorous hybrid e-Devlet & Alevi-Anatolian static site for a friend's wedding registry transfer to Köşektaş village.

**Architecture:** A static SPA (Single Page Application) with a visual transition from a rigid government registration UI to an immersive dark-mode Anatolian shrine dashboard.

**Tech Stack:** Native HTML5 semantic elements, Vanilla CSS, Vanilla JavaScript with Web Audio API (for programmatically generated saz sounds) and Canvas API (for printable certificates).

## Global Constraints
- Zero external package dependencies for the production bundle (fully standalone static site).
- Must utilize modern CSS features (Variables, Grid, Backdrop-Filter, `@starting-style` where appropriate).
- Authentication matches Name/Surname and first 3 characters of TC Number (saved in localStorage).

---

### Task 1: Project Scaffolding & e-Devlet Login Screen

**Files:**
- Create: `index.html`
- Create: `style.css`

**Interfaces:**
- Produces: Base HTML layout and css classes for the mock e-Devlet login/register interface.

- [ ] **Step 1: Create the HTML scaffolding**
  Create `index.html` with a semantic structure, including head metadata, theme stylesheet links, and the container for the "e-Devlet" portal login.
  ```html
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>e-Köşektaş Kütük ve Cemiyet Portal Girişi</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="app" class="theme-edevlet">
      <header class="gov-header">
        <div class="gov-logo">türkiye.gov.tr</div>
        <div class="gov-title">T.C. KÖŞEKTAŞ YÜKSEK CEMİYETİ PORTALI</div>
      </header>
      <main class="auth-container">
        <!-- Auth forms go here -->
      </main>
    </div>
    <script src="app.js"></script>
  </body>
  </html>
  ```

- [ ] **Step 2: Add Login and Register forms to HTML**
  Add a dual-tab container for "Giriş Yap" (Login) and "Cemiyete Kayıt Ol" (Register).
  ```html
  <div class="auth-box">
    <div class="auth-tabs">
      <button id="tab-login" class="active">Giriş Yap</button>
      <button id="tab-register">Cemiyete Kayıt Ol</button>
    </div>
    <form id="form-login" class="auth-form">
      <h2>Cemiyet Kimlik Doğrulama</h2>
      <label for="login-name">Ad Soyad</label>
      <input type="text" id="login-name" required autocomplete="name">
      <label for="login-tc">TC Kimlik No İlk 3 Harfi</label>
      <div class="input-tooltip-wrapper">
        <input type="text" id="login-tc" maxlength="3" required autocomplete="current-password">
        <span class="tooltip">Devlet sırrı gereği rakam değil, HARF girilmelidir! (Örn: EVL, TCK)</span>
      </div>
      <button type="submit" class="btn-submit">Kimlik Doğrula</button>
    </form>
    <form id="form-register" class="auth-form hidden">
      <h2>Yeni Kütük & Cemiyet Kaydı</h2>
      <label for="reg-name">Ad Soyad</label>
      <input type="text" id="reg-name" required autocomplete="name">
      <label for="reg-tc">TC Kimlik No İlk 3 Harfi (Erişim Kodu)</label>
      <input type="text" id="reg-tc" maxlength="3" required autocomplete="new-password">
      <button type="submit" class="btn-submit">Kütük Kaydı Oluştur</button>
    </form>
  </div>
  ```

- [ ] **Step 3: Implement Initial Stylesheets**
  Create `style.css` and define the color scheme tokens for both the e-Devlet theme and the Anatolian theme.
  ```css
  :root {
    --gov-red: #cc0000;
    --gov-grey: #f4f4f4;
    --gov-dark-grey: #333;
    --ana-crimson: #8b0000;
    --ana-gold: #ffbf00;
    --ana-dark: #121212;
    --ana-paper: #1c1c1c;
  }
  /* Define e-Devlet layout styles */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #e5e5e5;
  }
  .hidden { display: none !important; }
  /* Include basic form styling */
  ```

- [ ] **Step 4: Verify rendering manually**
  Open `index.html` in a web browser to ensure the page displays the portal layout with tabs.

- [ ] **Step 5: Commit changes**
  ```bash
  git add index.html style.css
  git commit -m "feat: scaffold workspace and build e-Devlet login layout"
  ```

---

### Task 2: Authentication Logic & localStorage Integration

**Files:**
- Create: `app.js`

**Interfaces:**
- Consumes: Login & Register form submission events in `index.html`.
- Produces: Authentication state validation, profile saving in local storage, and transition function hooks.

- [ ] **Step 1: Define Preset Users & LocalStorage initialization**
  Write the user list in `app.js` and initialize storage if empty.
  ```javascript
  const PRESET_USERS = [
    { name: "Mustafa Çöl", tcPrefix: "136", title: "Köşektaş'ın En Alevisi, En Kabadayısı, En Yakışıklısı, En Şakircisi" },
    { name: "Yazgı Su Çöl", tcPrefix: "EVL", title: "Köşektaş'ın En yeni üyesi, En Asil, En Moderni, En Güzeli" },
    { name: "Enes Berk", tcPrefix: "119", title: "Köşektaş'ın En Kafkaslı, En Tokatlısı, En Çapkını" }
  ];

  function getUsers() {
    const local = localStorage.getItem('kosektas_users');
    if (!local) {
      localStorage.setItem('kosektas_users', JSON.stringify(PRESET_USERS));
      return PRESET_USERS;
    }
    return JSON.parse(local);
  }
  ```

- [ ] **Step 2: Implement Auth logic & tabs**
  Add event listeners to toggle forms and handle login/registration.
  ```javascript
  // Handle Tabs
  document.getElementById('tab-login').addEventListener('click', () => toggleTab('login'));
  document.getElementById('tab-register').addEventListener('click', () => toggleTab('register'));

  function toggleTab(mode) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    if (mode === 'login') {
      loginForm.classList.remove('hidden');
      regForm.classList.add('hidden');
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
    } else {
      loginForm.classList.add('hidden');
      regForm.classList.remove('hidden');
      tabLogin.classList.remove('active');
      tabRegister.classList.add('active');
    }
  }
  ```

- [ ] **Step 3: Form Handlers**
  ```javascript
  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const tc = document.getElementById('login-tc').value.trim();
    const users = getUsers();
    const found = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.tcPrefix.toUpperCase() === tc.toUpperCase());
    if (found) {
      enterDashboard(found);
    } else {
      alert("UYARI: Kütük kaydı bulunamadı! Lütfen TC'nin ilk 3 harfini doğru girdiğinizden emin olun.");
    }
  });

  document.getElementById('form-register').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const tc = document.getElementById('reg-tc').value.trim();
    const users = getUsers();
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
      alert("Bu isimle zaten bir kütük kaydı var!");
      return;
    }
    const newUser = {
      name,
      tcPrefix: tc,
      title: "Köşektaş'ın En Yeni Üyesi (Hürmetkâr)"
    };
    users.push(newUser);
    localStorage.setItem('kosektas_users', JSON.stringify(users));
    alert("Kütük kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
    toggleTab('login');
  });
  ```

- [ ] **Step 4: Manual test**
  Verify registering a new user and logging in with correct credentials.
  
- [ ] **Step 5: Commit changes**
  ```bash
  git add app.js
  git commit -m "feat: implement JSON user registry, authentication, and localStorage persistence"
  ```

---

### Task 3: Dashboard Layout & Anatolian Visual Transition

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: Successful login events triggering theme transition.
- Produces: Premium dashboard structure showing custom titles and accordion rules.

- [ ] **Step 1: Add Dashboard structure to HTML**
  Add the dashboard container to `index.html` (wrapped in a div hidden by default).
  ```html
  <div id="dashboard" class="hidden">
    <header class="dash-header">
      <div class="dash-title">KÖŞEKTAŞ ÖZEL CEMİYETİ PORTALI</div>
      <button id="btn-logout" class="btn-secondary">Çıkış Yap</button>
    </header>
    <main class="dash-grid">
      <!-- Title Section -->
      <section class="dash-card profile-card">
        <h3>Hoş Geldiniz, Cemiyet Üyesi</h3>
        <h1 id="user-display-name">Mustafa Çöl</h1>
        <p id="user-display-title" class="badge">Köşektaş'ın En Alevisi...</p>
      </section>
      
      <!-- 12 Rules Accordion -->
      <section class="dash-card rules-card">
        <h3>İyi Bir Köşektaşlı Olmanın 12 Altın Kuralı</h3>
        <div id="rules-container"></div>
      </section>
    </main>
  </div>
  ```

- [ ] **Step 2: Add transition styles in CSS**
  Style the Anatolian dashboard with responsive grids, crimson colors, glassmorphism card layouts, and customized scrollbars.
  ```css
  .theme-anatolian {
    background-color: var(--ana-dark);
    color: #fff;
    min-height: 100vh;
  }
  .dash-card {
    background: rgba(28, 28, 28, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 191, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }
  .badge {
    background: var(--ana-crimson);
    color: var(--ana-gold);
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: bold;
    display: inline-block;
  }
  ```

- [ ] **Step 3: Implement transitions and Rules populated dynamically**
  Populate the 12 rules in JS and write the state transition function.
  ```javascript
  const RULES = [
    "Sazın tellerine dokunmadan güne başlama.",
    "Nevşehir'de her yolun Hacıbektaş'a, her kalbin Köşektaş'a çıktığını unutma.",
    "Köyün kuzeyindeki deve ve köşek şeklindeki taşlara gidip 'bizi taş etme' duası okumak.",
    "Cemiyet toplantılarına asla eli boş (özellikle Nevşehir patatesi veya üzümü olmadan) gelmemek.",
    "Kütüğe yeni geçmiş olmanın verdiği ezikliği Köşektaş'ı aşırı yücelterek kapatmak.",
    "Dilek ağacına çaput bağlarken kütük sahibinin mutluluğu için üç ihlas bir fatiha okumak.",
    "Bağlama çalmayı öğrenene kadar her mecliste 'ben dinleyiciyim' diyerek köşede oturmak.",
    "Misafire Nevşehir pekmezi ikram ederken 'Köşektaş pekmezi' diye yutturmaya çalışmak.",
    "Köy muhtarına selam vermeden köy kahvesinden geçmemek.",
    "Düğünlerde en önde halay çekip en son yorulan olmak.",
    "Köşektaş'ın geleceğine dair her projede 'bizim köyün insanı merttir' diyerek kadeh kaldırmak.",
    "Bu cemiyete ait olma şerefini her sabah aynaya bakıp tebrik etmek."
  ];

  function enterDashboard(user) {
    document.getElementById('app').className = "theme-anatolian";
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('.gov-header').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    document.getElementById('user-display-name').textContent = user.name;
    document.getElementById('user-display-title').textContent = user.title;
    
    // Render Rules
    const rulesContainer = document.getElementById('rules-container');
    rulesContainer.innerHTML = RULES.map((r, i) => `
      <details class="rule-details" name="kosektas-rules">
        <summary>Kural ${i+1}: ${r.substring(0, 30)}...</summary>
        <p>${r}</p>
      </details>
    `).join('');
  }
  ```

- [ ] **Step 4: Verify manual styling**
  Test login transition and the accordion behavior of rules.

- [ ] **Step 5: Commit changes**
  ```bash
  git add index.html style.css app.js
  git commit -m "feat: build Anatolian dashboard layout and 12 rules accordion"
  ```

---

### Task 4: Interactive Canvas Certificate (Şahadetname)

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Produces: Interactive dynamic Canvas generator that displays the official "Köşektaş Kütük Şahadetnamesi" and downloads it as an image.

- [ ] **Step 1: Add Canvas and download action to index.html**
  Add a canvas container card.
  ```html
  <section class="dash-card cert-card">
    <h3>Resmi Kütük Şahadetnamesi</h3>
    <canvas id="cert-canvas" width="600" height="400"></canvas>
    <button id="btn-download-cert" class="btn-primary">Şahadetnameyi İndir (PNG)</button>
  </section>
  ```

- [ ] **Step 2: Add Styles for Canvas**
  Ensure canvas fits responsively on smaller viewports.
  ```css
  #cert-canvas {
    width: 100%;
    max-width: 600px;
    height: auto;
    border: 2px solid var(--ana-gold);
    border-radius: 8px;
    background: #fff8eb;
    margin-bottom: 12px;
  }
  ```

- [ ] **Step 3: Implement Certificate Drawing Logic in app.js**
  Write the drawing script using canvas contexts.
  ```javascript
  function drawCertificate(userName) {
    const canvas = document.getElementById('cert-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background color
    ctx.fillStyle = '#fff9f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borders
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    ctx.strokeStyle = '#ffbf00';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
    
    // Header Text
    ctx.fillStyle = '#8b0000';
    ctx.font = 'bold 24px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('KÖŞEKTAŞ CEMİYETİ ŞAHADETNAMESİ', canvas.width / 2, 70);
    
    // Subheader
    ctx.fillStyle = '#333';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Resmi Nüfus ve Kütük Kabul Tescil Belgesi', canvas.width / 2, 100);
    
    // Body Text
    ctx.font = '16px "Cinzel", sans-serif';
    ctx.fillText('Nevşehir ili, Hacıbektaş ilçesi, Köşektaş Köyü', canvas.width / 2, 160);
    ctx.fillText('Yüksek Cemiyeti Heyeti kararı uyarınca;', canvas.width / 2, 185);
    
    // Name
    ctx.fillStyle = '#8b0000';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(userName, canvas.width / 2, 240);
    
    // Statement
    ctx.fillStyle = '#555';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('evlilik akdi vesilesiyle kutsal Köşektaş kütüğüne tescil edilmiş olup,', canvas.width / 2, 280);
    ctx.fillText('Cemiyetin tüm mistik ve dünyevi imtiyazlarına hak kazanmıştır.', canvas.width / 2, 305);
    
    // Official Seal and Signatures
    ctx.fillStyle = '#8b0000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('MÜHÜR VE ONAY', 100, 350);
    
    ctx.strokeStyle = '#8b0000';
    ctx.beginPath();
    ctx.arc(100, 355, 30, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = 'italic 12px Georgia, serif';
    ctx.fillText('Yüksek Divan Katibi', canvas.width - 120, 345);
    ctx.fillText('Muhtar & Reis', canvas.width - 120, 360);
  }
  ```

- [ ] **Step 4: Add Download Handler**
  Trigger image download on button click.
  ```javascript
  document.getElementById('btn-download-cert').addEventListener('click', () => {
    const canvas = document.getElementById('cert-canvas');
    const link = document.createElement('a');
    link.download = 'kosektas_sahadetname.png';
    link.href = canvas.toDataURL();
    link.click();
  });
  ```

- [ ] **Step 5: Verify drawing output**
  Log in, look at the canvas element, click the download button, and check the generated file.

- [ ] **Step 6: Commit changes**
  ```bash
  git add app.js index.html style.css
  git commit -m "feat: implement interactive canvas certificate and download handler"
  ```

---

### Task 5: Web Audio API Saz Synthesizer & Anthem Section

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Produces: Programmatic Saz audio synthesizer looping a simple traditional tune, coupled with a lyrics visualizer.

- [ ] **Step 1: Add Music player controls and Lyrics to index.html**
  Add the player controls and an interactive lyric visualizer.
  ```html
  <section class="dash-card media-card">
    <h3>Köşektaş Yüceltme Marşı & Saz Dinletisi</h3>
    <div class="audio-panel">
      <button id="btn-play-saz" class="btn-primary">Sazı Çal 🪕</button>
      <div id="playback-indicator" class="pulse-light hidden"></div>
    </div>
    <div class="lyrics-container">
      <pre id="lyrics-scroller">
Köşektaş'ın dağları taştır,
Cemiyetin yolları aşktır,
Mustafa'mız bize baştır,
Köşektaş'ım şanındandır!

Aşk ile çalar bağlama,
Gönül verip de ağlama,
Kütüğün burda, gam yeme,
Köşektaş'ım canındandır!
      </pre>
    </div>
  </section>
  ```

- [ ] **Step 2: Add styling for audio panel & lyrics**
  Add pulsing indicator light, custom font for lyrics, and styling for standard audio panel.
  ```css
  .lyrics-container {
    background: #0d0d0d;
    color: var(--ana-gold);
    font-style: italic;
    border-radius: 8px;
    padding: 15px;
    height: 120px;
    overflow-y: scroll;
    text-align: center;
    border: 1px solid rgba(255, 191, 0, 0.1);
  }
  .pulse-light {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #00ff00;
    box-shadow: 0 0 10px #00ff00;
    margin-left: 10px;
    display: inline-block;
  }
  ```

- [ ] **Step 3: Implement Web Audio Saz Synthesizer**
  Build a plucked string synthesizer. Saz has a distinct metallic, high-frequency sound with resonance.
  ```javascript
  let audioCtx = null;
  let synthInterval = null;
  let isPlaying = false;

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playSazPluck(frequency, startTime) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // A combination of Triangle (hollow string pluck) and Sawtooth (buzz/twang resonance)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 1.5, startTime);
    filter.Q.setValueAtTime(3, startTime);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, startTime);
    
    // Pluck decay envelope
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.6, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 0.8);
  }

  // A simple traditional folk loop (notes)
  const TUNE = [
    293.66, 329.63, 349.23, 329.63, 293.66, 261.63, 293.66, 293.66
  ];
  let noteIndex = 0;

  function startFolkLoop() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    isPlaying = true;
    document.getElementById('btn-play-saz').textContent = "Sazı Durdur ⏸";
    document.getElementById('playback-indicator').classList.remove('hidden');
    
    synthInterval = setInterval(() => {
      const noteFreq = TUNE[noteIndex % TUNE.length];
      playSazPluck(noteFreq, audioCtx.currentTime);
      noteIndex++;
    }, 450);
  }

  function stopFolkLoop() {
    isPlaying = false;
    document.getElementById('btn-play-saz').textContent = "Sazı Çal 🪕";
    document.getElementById('playback-indicator').classList.add('hidden');
    clearInterval(synthInterval);
  }

  document.getElementById('btn-play-saz').addEventListener('click', () => {
    if (isPlaying) {
      stopFolkLoop();
    } else {
      startFolkLoop();
    }
  });
  ```

- [ ] **Step 4: Verify Audio plucks**
  Log in, click the play button, and verify that the sound plays, loops, and stops correctly.

- [ ] **Step 5: Commit changes**
  ```bash
  git add app.js index.html style.css
  git commit -m "feat: implement Web Audio API saz synthesis and anthem text player"
  ```

---

### Task 6: Final Responsive Polish, SEO & Validation

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Produces: A completed, responsive, and SEO-optimized web page ready for deployment.

- [ ] **Step 1: Add SEO Tags and Accessibility features**
  Ensure headers have ARIA attributes, semantic hierarchy (`<h1>`), unique IDs, and metadata descriptions.
  ```html
  <meta name="description" content="e-Köşektaş: Köşektaş Köyü Cemiyet ve Kütük Doğrulama Sistemi">
  ```

- [ ] **Step 2: Clean up styling issues**
  Ensure visual elements work on both mobile (e.g. iPhone) and desktop viewports, adding container queries or media queries.
  ```css
  @media (max-width: 600px) {
    .dash-grid {
      grid-template-columns: 1fr;
    }
  }
  ```

- [ ] **Step 3: Test final builds and validation**
  Verify there are no JS errors in the console.

- [ ] **Step 4: Commit changes**
  ```bash
  git add index.html style.css
  git commit -m "chore: add metadata, responsive styling, and complete initial release"
  ```
