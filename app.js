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
}

// Log-out Handler
document.getElementById('btn-logout').addEventListener('click', () => {
  const app = document.getElementById('app');
  const govHeader = document.getElementById('gov-header');
  const authContainer = document.getElementById('auth-container');
  const dashboard = document.getElementById('dashboard');
  
  app.classList.remove('theme-anatolian');
  app.classList.add('theme-edevlet');
  
  govHeader.classList.remove('hidden');
  authContainer.classList.remove('hidden');
  dashboard.classList.add('hidden');
  
  // Clear inputs
  document.getElementById('login-name').value = '';
  document.getElementById('login-tc').value = '';
});

