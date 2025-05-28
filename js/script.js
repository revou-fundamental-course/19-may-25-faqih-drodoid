// Mode konversi: true = C to F, false = F to C
let isCelsiusToFahrenheit = true;

// Key untuk menyimpan tema di localStorage
const themeKey = "suhu-theme";

// Fungsi untuk menerapkan tema pada <body>
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Update icon sesuai tema
function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  if (document.body.classList.contains("dark-mode")) {
    icon.textContent = "🌙";
  } else {
    icon.textContent = "☀️";
  }
}

// Toggle mode tema antara dark dan light
function toggleTheme() {
  const isDark = document.body.classList.contains("dark-mode");
  if (isDark) {
    applyTheme("light");
    localStorage.setItem(themeKey, "light");
  } else {
    applyTheme("dark");
    localStorage.setItem(themeKey, "dark");
  }
  updateThemeIcon();
}

// Event listener untuk DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Apply theme
  const savedTheme = localStorage.getItem(themeKey) || "light";
  applyTheme(savedTheme);
  updateThemeIcon();

  // Event listener tombol theme
  const themeBtn = document.getElementById("toggleThemeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Konversi otomatis saat tekan Enter
  const inputField = document.getElementById("inputTemp");
  if (inputField) {
    inputField.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        convertTemperature();
      }
    });
  }

  // Inisialisasi tampilan awal
  resetCalculator();
});

// Fungsi untuk mengonversi suhu
function convertTemperature() {
  const inputValue = parseFloat(document.getElementById("inputTemp").value);

  // Validasi input harus angka
  if (isNaN(inputValue)) {
    showError("Sebelum Klik Konversi Masukin Angka Dulu ya🙏😌");
    return;
  }

  let result;
  let calculationSteps;

  if (isCelsiusToFahrenheit) {
    // Celsius ke Fahrenheit: °F = (°C × 9/5) + 32
    result = (inputValue * 9) / 5 + 32;
    calculationSteps = `
            <div class="formula">°F = (°C × 9/5) + 32</div>
            <div class="formula">°F = (${inputValue} × 9/5) + 32</div>
            <div class="formula">°F = (${inputValue} × 1.8) + 32</div>
            <div class="formula">°F = ${(inputValue * 1.8).toFixed(
              2
            )} + 32</div>
            <div class="formula">°F = ${result.toFixed(2)}</div>
        `;
  } else {
    // Fahrenheit ke Celsius: °C = (°F - 32) × 5/9
    result = ((inputValue - 32) * 5) / 9;
    calculationSteps = `
            <div class="formula">°C = (°F - 32) × 5/9</div>
            <div class="formula">°C = (${inputValue} - 32) × 5/9</div>
            <div class="formula">°C = ${(inputValue - 32).toFixed(
              2
            )} × 5/9</div>
            <div class="formula">°C = ${(inputValue - 32).toFixed(
              2
            )} × 0.5556</div>
            <div class="formula">°C = ${result.toFixed(2)}</div>
        `;
  }
  // Tampilkan hasil konversi dan langkah perhitungan
  document.getElementById("outputTemp").value = result.toFixed(2);
  document.getElementById("calculationSteps").innerHTML = calculationSteps;
}

function resetCalculator() {
  document.getElementById("inputTemp").value = "";
  document.getElementById("outputTemp").value = "";
  document.getElementById("calculationSteps").innerHTML =
    '<p style="color: #999; font-style: italic;">Masukkan nilai suhu dan klik "Konversi" untuk melihat perhitungan</p>';
}

//Membalik mode konversi antara Celsius ↔ Fahrenheit sekaligus mereset kalkulator dan update label, rumus, dan contoh.
function reverseMode() {
  isCelsiusToFahrenheit = !isCelsiusToFahrenheit;

  // Reset nilai input dan output
  resetCalculator();

  // Update label dan mode indicator
  if (isCelsiusToFahrenheit) {
    document.getElementById("inputLabel").textContent = "Celsius (°C):";
    document.getElementById("outputLabel").textContent = "Fahrenheit (°F):";
    document.getElementById("modeIndicator").textContent =
      "Mode: Celsius ke Fahrenheit";
    document.getElementById("conversionTitle").textContent =
      "Rumus Konversi Dari Celsius (°C) ke Fahrenheit (°F)";
    document.getElementById("conversionFormula").textContent =
      "°F = (°C × 9/5) + 32";
    document.getElementById("conversionExample").textContent =
      "Contoh: 0°C = (0 × 9/5) + 32 = 32°F";
  } else {
    document.getElementById("inputLabel").textContent = "Fahrenheit (°F):";
    document.getElementById("outputLabel").textContent = "Celsius (°C):";
    document.getElementById("modeIndicator").textContent =
      "Mode: Fahrenheit ke Celsius";
    document.getElementById("conversionTitle").textContent =
      "Rumus Konversi Dari Fahrenheit (°F) ke Celsius (°C)";
    document.getElementById("conversionFormula").textContent =
      "°C = (°F - 32) × 5/9";
    document.getElementById("conversionExample").textContent =
      "Contoh: 32°F = (32 - 32) × 5/9 = 0°C";
  }
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
  const errorEl = document.getElementById("errorMessage");
  if (!errorEl) return alert(message); // fallback kalau HTML belum ada

  errorEl.textContent = message;
  errorEl.classList.add("show");

  // Sembunyikan otomatis setelah 1,9 detik
  setTimeout(() => {
    errorEl.classList.remove("show");
    setTimeout(() => {
      errorEl.style.display = "none";
    }, 190); // tunggu animasi selesai
  }, 1900); // Error box tampil 1,9 detik

  // Biar smooth munculnya
  errorEl.style.display = "block";
}
