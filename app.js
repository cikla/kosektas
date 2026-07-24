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

// Placeholder for transition to dashboard (fully implemented in Task 3)
function enterDashboard(user) {
  console.log("Logged in successfully:", user);
  alert(`Cemiyete Hoş Geldiniz: ${user.name}\nUnvanınız: ${user.title}`);
}
