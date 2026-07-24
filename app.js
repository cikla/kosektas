// e-Köşektaş Kütük ve Cemiyet Portal Logic

// Preset users directly specified in design specification
const PRESET_USERS = [
  { name: "Mustafa Çöl", tcPrefix: "136", title: "Köşektaş'ın En Alevisi, En Kabadayısı, En Yakışıklısı, En Şakircisi" },
  { name: "Yazgı Su Çöl", tcPrefix: "EVL", title: "Köşektaş'ın En yeni üyesi, En Asil, En Moderni, En Güzeli" },
  { name: "Enes Berk", tcPrefix: "119", title: "Köşektaş'ın En Kafkaslı, En Tokatlısı, En Çapkını" }
];

// Initialize users from LocalStorage or use Presets
function getUsers() {
  const local = localStorage.getItem('kosektas_users');
  if (!local) {
    localStorage.setItem('kosektas_users', JSON.stringify(PRESET_USERS));
    return PRESET_USERS;
  }
  return JSON.parse(local);
}

// Tab toggle logic
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

tabLogin.addEventListener('click', () => toggleTab('login'));
tabRegister.addEventListener('click', () => toggleTab('register'));

function toggleTab(mode) {
  if (mode === 'login') {
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formLogin.classList.add('hidden');
    formRegister.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

// Login verification
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('login-name').value.trim();
  const tcInput = document.getElementById('login-tc').value.trim();
  
  const users = getUsers();
  
  // Case-insensitive name match and case-insensitive TC prefix check
  const matchedUser = users.find(u => 
    u.name.toLowerCase() === nameInput.toLowerCase() && 
    u.tcPrefix.toUpperCase() === tcInput.toUpperCase()
  );
  
  if (matchedUser) {
    enterDashboard(matchedUser);
  } else {
    alert("❌ KİMLİK DOĞRULAMA HATASI: Belirtilen kütük kaydı bulunamadı. Lütfen bilgilerinizi (özellikle TC'nin ilk 3 harfini!) kontrol edin.");
  }
});

// Registration logic
formRegister.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('reg-name').value.trim();
  const tcInput = document.getElementById('reg-tc').value.trim();
  
  const users = getUsers();
  
  if (users.some(u => u.name.toLowerCase() === nameInput.toLowerCase())) {
    alert("❌ KAYIT HATASI: Bu isimle kayıtlı bir kütük kaydı zaten mevcut.");
    return;
  }
  
  // Custom generated titles for newly registered members
  const newUser = {
    name: nameInput,
    tcPrefix: tcInput,
    title: "Köşektaş'ın En Yeni Üyesi (Hürmetkâr & Gayretkeş)"
  };
  
  users.push(newUser);
  localStorage.setItem('kosektas_users', JSON.stringify(users));
  
  alert("✅ KÜTÜK TESCİLİ BAŞARILI: Köşektaş köyü kütük tescil talebiniz onaylandı! Şimdi giriş yapabilirsiniz.");
  toggleTab('login');
  
  // Auto-fill login values for easier access
  document.getElementById('login-name').value = nameInput;
  document.getElementById('login-tc').value = tcInput;
});

// Good Köşektaşlı 12 Golden Rules list
const RULES = [
  "Sazın tellerine dokunmadan güne başlama (Anadolu dervişinin sabah ritüeli).",
  "Nevşehir'de her yolun Hacıbektaş'a, her kalbin Köşektaş'a çıktığını unutma.",
  "Köyün kuzeyindeki deve ve köşek şeklindeki kutsal taşları ziyaret edip beddua koruma duası okumak.",
  "Cemiyet toplantılarına asla eli boş (özellikle Hacıbektaş üzümü veya Nevşehir patatesi olmadan) gelmemek.",
  "Kütüğe yeni geçmiş olmanın verdiği tatlı ezikliği, Köşektaş köyünü her mecliste aşırı yücelterek kapatmak.",
  "Köşektaş'ın geleceğine dair her projede 'bizim köyün insanı merttir' diyerek katkıda bulunmak.",
  "Saz tınısını duyduğunda elindeki işi gücü bırakıp derin bir tefekküre dalmak.",
  "Köyün bilge çınarlarının ve aşıklık geleneğinin önünde saygıyla eğilmek.",
  "Nevşehir pekmezini şifa niyetine içip 'Köşektaş iksiri' olarak tüm dünyaya anlatmak.",
  "Köy düğünlerinde halayın başını çekip, cemiyet disiplinini asla bozmamak.",
  "Alevi-Bektaşi kültürünün barışçıl, hoşgörülü ve aydınlık felsefesini her ortamda yaşatmak.",
  "Köşektaş Özel Cemiyeti'ne dahil olma şerefini her sabah aynaya bakarak gururla kutlamak."
];

// Handles state transition into dashboard
function enterDashboard(user) {
  const app = document.getElementById('app');
  const govHeader = document.getElementById('gov-header');
  const authContainer = document.getElementById('auth-container');
  const dashboard = document.getElementById('dashboard');
  
  // Transition class names for beautiful fading
  app.classList.remove('theme-edevlet');
  app.classList.add('theme-anatolian');
  
  govHeader.classList.add('hidden');
  authContainer.classList.add('hidden');
  dashboard.classList.remove('hidden');
  
  // Populate User info
  document.getElementById('user-display-name').textContent = user.name;
  document.getElementById('user-display-title').textContent = user.title;
  
  // Dynamically render 12 Rules
  const rulesContainer = document.getElementById('rules-container');
  rulesContainer.innerHTML = RULES.map((rule, idx) => `
    <details class="rule-details" name="kosektas-rules">
      <summary>Kural ${idx + 1}: ${rule.substring(0, 42)}...</summary>
      <p>${rule}</p>
    </details>
  `).join('');

  // Draw the official certificate
  drawCertificate(user);
}

// Draw the official Köşektaş Certificate on Canvas
function drawCertificate(user) {
  const canvas = document.getElementById('cert-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. Draw Paper background
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. Outer border (Crimson)
  ctx.strokeStyle = '#7f0000';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  
  // Inner border (Gold)
  ctx.strokeStyle = '#e2b13c';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  
  // 3. Header Text
  ctx.fillStyle = '#7f0000';
  ctx.font = 'bold 20px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('KÖŞEKTAŞ CEMİYETİ ŞAHADETNAMESİ', canvas.width / 2, 60);
  
  // Subheader
  ctx.fillStyle = '#666666';
  ctx.font = 'italic 12px "Outfit", sans-serif';
  ctx.fillText('Nevşehir Hacıbektaş Köşektaş Köyü Kütük Kabul Beyannamesi', canvas.width / 2, 85);
  
  // Decorative line
  ctx.strokeStyle = '#e2b13c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 95);
  ctx.lineTo(450, 95);
  ctx.stroke();
  
  // 4. Body text
  ctx.fillStyle = '#333333';
  ctx.font = '14px "Outfit", sans-serif';
  ctx.fillText('İşbu vesika ile aşağıda ismi beyan edilen cemiyet üyesinin,', canvas.width / 2, 140);
  ctx.fillText('evlilik ve bağ akdi ile kutsal Köşektaş köyü kütüğüne', canvas.width / 2, 162);
  ctx.fillText('kaydının tescil edildiği resmen beyan olunur:', canvas.width / 2, 184);
  
  // Name (Large, Crimson, bold)
  ctx.fillStyle = '#7f0000';
  ctx.font = 'bold 26px "Cinzel", Georgia, serif';
  ctx.fillText(user.name.toUpperCase(), canvas.width / 2, 235);
  
  // Title (Italic, Gold)
  ctx.fillStyle = '#b8860b';
  ctx.font = 'italic 13px "Outfit", sans-serif';
  ctx.fillText(`"${user.title}"`, canvas.width / 2, 260);
  
  // Registry ID (Mizahi)
  const hash = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const registryId = `K-38-50-ALEV-${hash % 9999}`;
  ctx.fillStyle = '#777777';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`KÜTÜK SİCİL NO: ${registryId}`, canvas.width / 2, 290);
  
  // 5. Official Seal (Bottom Left)
  ctx.strokeStyle = 'rgba(127, 0, 0, 0.75)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(100, 340, 32, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Inner ring of seal
  ctx.strokeStyle = 'rgba(127, 0, 0, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(100, 340, 27, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(127, 0, 0, 0.85)';
  ctx.font = 'bold 7px "Outfit", sans-serif';
  ctx.fillText('KÖŞEKTAŞ', 100, 330);
  ctx.fillText('MUHTARLIĞI', 100, 342);
  ctx.font = 'bold 8px "Outfit", sans-serif';
  ctx.fillText('1928', 100, 355);
  
  // 6. Signatures (Bottom Right)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('Yüksek Heyet Reisi', canvas.width - 120, 325);
  
  ctx.font = 'italic 10px Georgia, serif';
  ctx.fillText('Mustafa Çöl', canvas.width - 120, 342);
  
  // Handwritten-like scribble line
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 160, 355);
  ctx.quadraticCurveTo(canvas.width - 120, 345, canvas.width - 80, 360);
  ctx.stroke();
}

// Download Button Event Listener
document.getElementById('btn-download-cert').addEventListener('click', () => {
  const canvas = document.getElementById('cert-canvas');
  if (!canvas) return;
  
  // Trigger download
  const link = document.createElement('a');
  link.download = 'kosektas_kutu_sahadetnamesi.png';
  
  // Make sure to specify PNG mime-type
  link.href = canvas.toDataURL('image/png');
  link.click();
});


// Log-out Handler
document.getElementById('btn-logout').addEventListener('click', () => {
  const app = document.getElementById('app');
  const govHeader = document.getElementById('gov-header');
  const authContainer = document.getElementById('auth-container');
  const dashboard = document.getElementById('dashboard');
  
  // Stop the music if running
  stopFolkLoop();
  
  app.classList.remove('theme-anatolian');
  app.classList.add('theme-edevlet');
  
  govHeader.classList.remove('hidden');
  authContainer.classList.remove('hidden');
  dashboard.classList.add('hidden');
  
  // Clear inputs
  document.getElementById('login-name').value = '';
  document.getElementById('login-tc').value = '';
});

// ==========================================================================
// Web Audio API Saz Synthesizer & Anthem Player
// ==========================================================================
let audioCtx = null;
let synthInterval = null;
let isPlayingSaz = false;
let noteIndex = 0;

// Traditional folk melody progression (simplified Uzun İnce Bir Yoldayım)
const TUNE = [
  293.66, 293.66, 329.63, 349.23, 349.23, 329.63, 293.66, 261.63,
  293.66, 233.08, 220.00, 220.00, 220.00, 220.00
];

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Simulates a double-stringed (çift telli) saz string pluck using Karpus-Strong-ish synth
function playSazPluck(frequency, startTime) {
  if (!audioCtx) return;
  
  // Create nodes
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  // Double string detuning (creates beautiful traditional resonance chorus)
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(frequency, startTime);
  osc1.detune.setValueAtTime(6, startTime); // detune +6 cents
  
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(frequency, startTime);
  osc2.detune.setValueAtTime(-6, startTime); // detune -6 cents
  
  // Plucked string filter damping (high-freqs decay faster)
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(frequency * 4, startTime);
  filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, startTime + 0.5);
  filter.Q.setValueAtTime(1.5, startTime);
  
  // Pluck gain envelope
  gainNode.gain.setValueAtTime(0.001, startTime);
  // Pluck attack
  gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
  // Natural decay
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);
  
  // Connections
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  // Start and stop
  osc1.start(startTime);
  osc1.stop(startTime + 0.8);
  osc2.start(startTime);
  osc2.stop(startTime + 0.8);
}

function startFolkLoop() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  isPlayingSaz = true;
  document.getElementById('btn-play-saz').textContent = "Sazı Durdur ⏸";
  document.getElementById('playback-indicator').classList.remove('hidden');
  
  const scroller = document.getElementById('lyrics-scroller');
  const container = document.querySelector('.lyrics-container');
  
  synthInterval = setInterval(() => {
    const freq = TUNE[noteIndex % TUNE.length];
    playSazPluck(freq, audioCtx.currentTime);
    
    // Lyric Autoscrolling interaction
    noteIndex++;
    if (container) {
      container.scrollTop = (noteIndex * 15) % (scroller.scrollHeight - 100);
    }
  }, 420);
}

function stopFolkLoop() {
  isPlayingSaz = false;
  document.getElementById('btn-play-saz').textContent = "Sazı Çal 🪕";
  const indicator = document.getElementById('playback-indicator');
  if (indicator) indicator.classList.add('hidden');
  
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

document.getElementById('btn-play-saz').addEventListener('click', () => {
  if (isPlayingSaz) {
    stopFolkLoop();
  } else {
    startFolkLoop();
  }
});


